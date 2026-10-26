/* core.h — IAT procedure and scoring, shared by the terminal (iat.c) and SDL2 (iat-sdl.c) frontends.
 *
 * Design: Greenwald, McGhee & Schwartz (1998) 7-block IAT; scoring: Greenwald, Nosek & Banaji (2003)
 * "improved" D, built-in error penalty (respondent must press the correct key; latency to correct key).
 *
 * A frontend includes this header and implements the ui_* functions declared below, then calls
 * iat_main(argc, argv).  Stimulus items are words, or image files (anything ending .jpg/.png/.gif,
 * resolved relative to the stimuli file; shell globs like faces/old*.jpg are expanded).
 */
#ifndef IAT_CORE_H
#define IAT_CORE_H
#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include <glob.h>
#include <libgen.h>
#include <strings.h>

#define MAXITEMS 64
#define MAXLEN   256
#define MAXTRIALS 400

typedef struct { char name[MAXLEN]; char item[MAXITEMS][MAXLEN]; int isimg[MAXITEMS]; int n; } Cat;
typedef struct { int n; int left[2], nleft; int right[2], nright; const char *label; } Block;
typedef struct { int block; int cat; int item; int correct_key; int errors; double rt; } Trial;

static Cat cat[4];               /* 0 target_a, 1 target_b, 2 attr_a, 3 attr_b */
static Trial trials[MAXTRIALS]; static int ntrials=0;
static double tscale=1.0;        /* IAT_TIMESCALE=100: ISI shrinks, latencies scale up; scoring unchanged */
static int have_images=0;

/* ---- frontend hooks ---- */
static void ui_init(void);
static void ui_quit(void);
static void ui_message(const char **lines,int n);          /* clear screen, centred lines */
static void ui_header(const Block *b);                     /* clear screen, category labels left/right */
static void ui_stimulus(const Cat *c,int item);            /* centred word or image */
static void ui_clear_stimulus(void);
static void ui_error(void);                                /* red X under the stimulus */
static int  ui_key(void);                                  /* blocking; 'e' 'i' ' ' 'q', others ignored */
static void ui_flush_keys(void);

/* ---- helpers ---- */
static double now_ms(void){ struct timespec ts; clock_gettime(CLOCK_MONOTONIC,&ts); return (ts.tv_sec*1000.0+ts.tv_nsec/1e6)*tscale; }
static void sleep_ms(double ms){ struct timespec d; ms/=tscale; d.tv_sec=(time_t)(ms/1000); d.tv_nsec=(long)((ms-d.tv_sec*1000)*1e6); nanosleep(&d,NULL); }
static int rnd(int n){ return (int)((double)rand()/((double)RAND_MAX+1)*n); }
static int ulen(const char *s){ int n=0; for(;*s;s++) if(((unsigned char)*s&0xC0)!=0x80) n++; return n; }
static void trim(char *s){ char *e; while(*s==' '||*s=='\t') memmove(s,s+1,strlen(s));
    e=s+strlen(s); while(e>s && (e[-1]==' '||e[-1]=='\t'||e[-1]=='\n'||e[-1]=='\r')) *--e=0; }
static int is_image(const char *s){ size_t n=strlen(s); if(n<5) return 0; const char *e=s+n-4;
    return !strcasecmp(e,".jpg")||!strcasecmp(e,".png")||!strcasecmp(e,".gif")||!strcasecmp(e-1,".jpeg"); }
static const char *item_label(const Cat *c,int i){ const char *s=c->item[i]; const char *b=strrchr(s,'/'); return b?b+1:s; }

static void add_item(Cat *c,const char *path,int img){ if(c->n>=MAXITEMS) return;
    strncpy(c->item[c->n],path,MAXLEN-1); c->isimg[c->n]=img; c->n++; if(img) have_images=1; }

static void load_stimuli(const char *path){
    static const char *keys[4]={"target_a","target_b","attr_a","attr_b"};
    FILE *f=fopen(path,"r"); if(!f){ perror(path); exit(1); }
    char dirbuf[MAXLEN]; strncpy(dirbuf,path,MAXLEN-1); const char *dir=dirname(dirbuf);
    char line[4096];
    while(fgets(line,sizeof line,f)){
        char *eq=strchr(line,':'); if(!eq||line[0]=='#') continue;
        *eq=0; char *k=line,*v=eq+1; trim(k); trim(v);
        for(int c=0;c<4;c++){
            size_t kl=strlen(keys[c]);
            if(!strcmp(k,keys[c])) strncpy(cat[c].name,v,MAXLEN-1);
            else if(!strncmp(k,keys[c],kl)&&!strcmp(k+kl,"_items")){
                char *tok=strtok(v,","); cat[c].n=0;
                while(tok){ trim(tok);
                    if(is_image(tok)){
                        char full[MAXLEN]; if(tok[0]=='/') strncpy(full,tok,MAXLEN-1); else snprintf(full,MAXLEN,"%s/%s",dir,tok);
                        glob_t g; if(glob(full,0,NULL,&g)==0){ for(size_t i=0;i<g.gl_pathc;i++) add_item(&cat[c],g.gl_pathv[i],1); }
                        else { fprintf(stderr,"warning: no file matches %s\n",full); }
                        globfree(&g);
                    } else if(*tok) add_item(&cat[c],tok,0);
                    tok=strtok(NULL,","); }
            }
        }
    }
    fclose(f);
    for(int c=0;c<4;c++) if(!cat[c].n||!cat[c].name[0]){ fprintf(stderr,"stimuli: missing or empty %s\n",keys[c]); exit(1); }
    /* an item in two categories has no correct key: reject rather than score nonsense */
    for(int a=0;a<4;a++) for(int b=a+1;b<4;b++) for(int i=0;i<cat[a].n;i++) for(int j=0;j<cat[b].n;j++)
        if(!strcmp(item_label(&cat[a],i),item_label(&cat[b],j))){ fprintf(stderr,"stimuli: '%s' appears in both %s and %s\n",item_label(&cat[a],i),cat[a].name,cat[b].name); exit(1); }
}

/* ---- one block ---- */
static int wait_space(void){ ui_flush_keys(); for(;;){ int k=ui_key(); if(k==' ') return 1; if(k=='q') return 0; } }

static int run_block(int bi,const Block *b){
    char l1[128],l2[300],l3[300]; const char *lines[7];
    snprintf(l1,sizeof l1,"Part %d of 7 - %s",bi+1,b->label);
    snprintf(l2,sizeof l2,"LEFT (E): %s%s%s",cat[b->left[0]].name,b->nleft>1?" + ":"",b->nleft>1?cat[b->left[1]].name:"");
    snprintf(l3,sizeof l3,"RIGHT (I): %s%s%s",cat[b->right[0]].name,b->nright>1?" + ":"",b->nright>1?cat[b->right[1]].name:"");
    lines[0]=l1; lines[1]=l2; lines[2]=l3; lines[3]="";
    lines[4]="Go as fast as you can while making few errors.";
    lines[5]="A red X means wrong key: press the other key to continue.";
    lines[6]="Press SPACE to begin.";
    ui_message(lines,7); if(!wait_space()) return 0;

    int cats[4],nc=0;
    for(int i=0;i<b->nleft;i++) cats[nc++]=b->left[i];
    for(int i=0;i<b->nright;i++) cats[nc++]=b->right[i];
    int idx[4]; for(int c=0;c<4;c++) idx[c]=rnd(cat[c].n);
    ui_header(b);
    /* trial order as Project Implicit: targets and attributes strictly alternate, and within every pair of
       same-kind trials both sides appear once (so left/right are balanced), order of the pair random */
    int seq[MAXTRIALS];
    if(nc==4){ for(int t=0;t<b->n;t+=4){ int f=rnd(2),g=rnd(2); seq[t]=f?0:1; seq[t+1]=g?2:3; seq[t+2]=f?1:0; seq[t+3]=g?3:2; } }
    else      { for(int t=0;t<b->n;t+=2){ int f=rnd(2); seq[t]=cats[f]; seq[t+1]=cats[!f]; } }
    for(int t=0;t<b->n;t++){
        int c=seq[t];
        int it=idx[c]; idx[c]=(idx[c]+1)%cat[c].n; if(idx[c]==0) idx[c]=rnd(cat[c].n);
        int left=0; for(int i=0;i<b->nleft;i++) if(b->left[i]==c) left=1;
        int want=left?'e':'i';
        ui_clear_stimulus(); sleep_ms(250); ui_flush_keys();
        ui_stimulus(&cat[c],it);
        double t0=now_ms(); int errs=0;
        for(;;){ int k=ui_key(); if(k=='q') return 0; if(k!='e'&&k!='i') continue; if(k==want) break; errs++; ui_error(); }
        double rt=now_ms()-t0;
        if(ntrials<MAXTRIALS) trials[ntrials++]=(Trial){bi,c,it,want,errs,rt};
    }
    return 1;
}

/* ---- scoring ---- */
/* Trial filter as Project Implicit's scorer (minno nogaScorer): keep 400 ms <= latency <= 10000 ms.
   Greenwald et al. (2003) drop only >10 s; the 400 ms floor is PI's addition. Error trials are kept with
   their (to-correct-key) latency, which is the "built-in penalty" variant. */
#define RT_MIN 400
#define RT_MAX 10000
static int in_blocks(int i,int b1,int b2){ return (trials[i].block==b1||trials[i].block==b2)&&trials[i].rt>=RT_MIN&&trials[i].rt<=RT_MAX; }
static double blk_mean(int b1,int b2){ double s=0; int k=0;
    for(int i=0;i<ntrials;i++) if(in_blocks(i,b1,b2)){ s+=trials[i].rt; k++; }
    return k?s/k:0; }
static double pooled_sd(int c1,int c2,int r1,int r2){ double s=0,ss=0; int k=0;
    for(int i=0;i<ntrials;i++) if(in_blocks(i,c1,c2)||in_blocks(i,r1,r2)){ s+=trials[i].rt; ss+=trials[i].rt*trials[i].rt; k++; }
    if(k<2) return 0;
    double m=s/k; return sqrt((ss-k*m*m)/(k-1)); }

static void score(int order,FILE *out){
    int fast=0; for(int i=0;i<ntrials;i++) if(trials[i].rt<150) fast++;
    int c1=2,c2=3,r1=5,r2=6; if(order==2){ c1=5;c2=6;r1=2;r2=3; }   /* c = A+attrA pairing blocks, r = reversed */
    /* D as Project Implicit computes it: one parcel of all combined trials, (mean reversed - mean congruent) / pooled SD */
    double mc=blk_mean(c1,c2),mr=blk_mean(r1,r2),sd=pooled_sd(c1,c2,r1,r2),D=sd?(mr-mc)/sd:0;
    /* D as Greenwald, Nosek & Banaji (2003): practice and test parcels scored separately, then averaged */
    double sd1=pooled_sd(c1,c1,r1,r1),sd2=pooled_sd(c2,c2,r2,r2);
    double d1=sd1?(blk_mean(r1,r1)-blk_mean(c1,c1))/sd1:0,d2=sd2?(blk_mean(r2,r2)-blk_mean(c2,c2))/sd2:0,D2003=(d1+d2)/2;
    const char *verdict=fabs(D)<0.15?"little or no":fabs(D)<0.35?"slight":fabs(D)<0.65?"moderate":"strong";
    printf("\nD-score = %+.3f   (Greenwald-2003 two-parcel D = %+.3f: practice %+.3f, test %+.3f)\n",D,D2003,d1,d2);
    printf("%s association of %s+%s / %s+%s %s\n",verdict,cat[0].name,cat[2].name,cat[1].name,cat[3].name,
           D>0?"(faster with this pairing)":D<0?"(faster with the reverse pairing)":"");
    printf("Mean latency ms: %s+%s blocks %.0f | reversed blocks %.0f | pairing order %d\n",cat[0].name,cat[2].name,mc,mr,order);
    if(ntrials&&100.0*fast/ntrials>10) printf("WARNING: %.0f%% of responses < 150 ms - too fast, result unreliable.\n",100.0*fast/ntrials);
    if(out) fprintf(out,"# D=%.4f D_2003=%.4f d_practice=%.4f d_test=%.4f order=%d\n",D,D2003,d1,d2,order);
}

static int iat_main(int argc,char **argv){
    const char *stim=NULL,*outpath="results.csv"; int order=0;   /* 0 = random, as Project Implicit */ unsigned seed=(unsigned)time(NULL);
    for(int i=1;i<argc;i++){
        if(!strcmp(argv[i],"--order")&&i+1<argc) order=atoi(argv[++i]);
        else if(!strcmp(argv[i],"--out")&&i+1<argc) outpath=argv[++i];
        else if(!strcmp(argv[i],"--seed")&&i+1<argc) seed=(unsigned)atoi(argv[++i]);
        else stim=argv[i];
    }
    if(!stim){ fprintf(stderr,"usage: %s stimuli.txt [--order 1|2 (default random)] [--out results.csv] [--seed N]\n",argv[0]); return 1; }
    if(getenv("IAT_TIMESCALE")) tscale=atof(getenv("IAT_TIMESCALE"));
    load_stimuli(stim); srand(seed);
    if(order!=1&&order!=2) order=1+rnd(2);
    int A=0,B=1; if(order==2){ A=1;B=0; }
    Block blocks[7]={
        {20,{A},1,{B},1,"sort the two target categories"},
        {20,{2},1,{3},1,"sort the two attribute categories"},
        {20,{A,2},2,{B,3},2,"combined practice"},
        {40,{A,2},2,{B,3},2,"combined test"},
        {28,{B},1,{A},1,"targets switch sides - practice the new sides"},
        {20,{B,2},2,{A,3},2,"reversed combined practice"},
        {40,{B,2},2,{A,3},2,"reversed combined test"},
    };
    ui_init();
    const char *intro[]={"Implicit Association Test","",
        "You will sort words or pictures into categories using the E and I keys.",
        "Keep your index fingers on E and I.","","Press SPACE to start, Q to quit."};
    ui_message(intro,6); if(!wait_space()){ ui_quit(); return 0; }
    for(int b=0;b<7;b++) if(!run_block(b,&blocks[b])){ ui_quit(); puts("aborted"); return 1; }
    ui_quit();
    FILE *out=fopen(outpath,"w");
    if(out){ fprintf(out,"block,category,item,correct_key,errors,rt_ms\n");
        for(int i=0;i<ntrials;i++) fprintf(out,"%d,%s,%s,%c,%d,%.1f\n",trials[i].block+1,cat[trials[i].cat].name,
            item_label(&cat[trials[i].cat],trials[i].item),trials[i].correct_key,trials[i].errors,trials[i].rt); }
    score(order,out);
    if(out){ fclose(out); printf("raw trials written to %s\n",outpath); }
    return 0;
}
#endif
