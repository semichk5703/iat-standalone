/* iat-sdl.c — SDL2 frontend: words and pictures.  Only dependency: SDL2.
 * Build: cc -O2 -std=c99 -o iat-sdl iat-sdl.c $(sdl2-config --cflags --libs) -lm
 * JPG/PNG/GIF decoding by stb_image.h (public domain), text by font8x8 (public domain) - both bundled.
 * Env: IAT_FULLSCREEN=1 (default: 800x600 window), IAT_SCALE=n (font pixel scale, default 3),
 *      IAT_ECHO=1 (print what is shown to stdout) + IAT_STDIN_KEYS=1 (also read keys from stdin): test hooks. */
#include "core.h"
#include <SDL.h>
#include <unistd.h>
#include <sys/select.h>
#include <termios.h>
#define STB_IMAGE_IMPLEMENTATION
#define STBI_ONLY_JPEG
#define STBI_ONLY_PNG
#define STBI_ONLY_GIF
#define STBI_NO_LINEAR
#define STBI_NO_HDR
#include "third_party/stb_image.h"
#include "third_party/font8x8_basic.h"

static SDL_Window *win; static SDL_Renderer *ren; static int W=800,H=600,fs=3;
static int echo=0,stdin_keys=0;
static SDL_Texture *tex[4][MAXITEMS]; static int texw[4][MAXITEMS],texh[4][MAXITEMS];

static void die(const char *m){ fprintf(stderr,"%s: %s\n",m,SDL_GetError()); exit(1); }

/* ---- text ---- */
static int text_w(const char *s){ return ulen(s)*8*fs; }
static void draw_text(int x,int y,const char *s,SDL_Color col){
    SDL_SetRenderDrawColor(ren,col.r,col.g,col.b,255);
    for(;*s;s++){
        unsigned char ch=(unsigned char)*s; if((ch&0xC0)==0x80) continue;   /* skip UTF-8 continuation bytes */
        const char *g=font8x8_basic[ch<128?ch:'?'];
        for(int r=0;r<8;r++) for(int c=0;c<8;c++) if(g[r]&(1<<c)){ SDL_Rect px={x+c*fs,y+r*fs,fs,fs}; SDL_RenderFillRect(ren,&px); }
        x+=8*fs;
    }
}
static void text_centered(int y,const char *s,SDL_Color col){ draw_text((W-text_w(s))/2,y,s,col); }
static void present(void){ SDL_RenderPresent(ren); }
static void clear_all(void){ SDL_SetRenderDrawColor(ren,0,0,0,255); SDL_RenderClear(ren); }
static const SDL_Color white={255,255,255,255}, green={120,220,120,255}, red={255,60,60,255};

/* ---- images ---- */
static SDL_Texture *load_image(const char *path,int *w,int *h){
    int n; unsigned char *px=stbi_load(path,w,h,&n,4);
    if(!px){ fprintf(stderr,"cannot decode %s\n",path); return NULL; }
    SDL_Surface *s=SDL_CreateRGBSurfaceFrom(px,*w,*h,32,*w*4,0x000000ff,0x0000ff00,0x00ff0000,0xff000000);
    SDL_Texture *t=SDL_CreateTextureFromSurface(ren,s); SDL_FreeSurface(s); stbi_image_free(px); return t;
}

/* ---- hooks ---- */
static void ui_init(void){
    echo=getenv("IAT_ECHO")!=NULL; stdin_keys=getenv("IAT_STDIN_KEYS")!=NULL;
    if(stdin_keys&&isatty(0)){ static struct termios t; tcgetattr(0,&t); t.c_lflag&=~(ICANON|ECHO); t.c_cc[VMIN]=0; t.c_cc[VTIME]=0; tcsetattr(0,TCSANOW,&t); }
    if(getenv("IAT_SCALE")) fs=atoi(getenv("IAT_SCALE"));
    if(SDL_Init(SDL_INIT_VIDEO)) die("SDL_Init");
    Uint32 flags=getenv("IAT_FULLSCREEN")?SDL_WINDOW_FULLSCREEN_DESKTOP:0;
    win=SDL_CreateWindow("IAT",SDL_WINDOWPOS_CENTERED,SDL_WINDOWPOS_CENTERED,W,H,flags); if(!win) die("window");
    ren=SDL_CreateRenderer(win,-1,0); if(!ren) die("renderer");
    SDL_GetRendererOutputSize(ren,&W,&H);
    for(int c=0;c<4;c++) for(int i=0;i<cat[c].n;i++) if(cat[c].isimg[i]) tex[c][i]=load_image(cat[c].item[i],&texw[c][i],&texh[c][i]);
}
static void ui_quit(void){ SDL_DestroyRenderer(ren); SDL_DestroyWindow(win); SDL_Quit(); }
/* Retained scene: SDL's renderer is double-buffered, so every present() must redraw the whole frame;
   presenting after drawing only one region shows a back buffer that lacks the rest (header jumps). */
static struct {
    const Block *block;      /* header to draw, or NULL */
    const Cat *stim_cat;     /* stimulus to draw, or NULL */
    int stim_item;
    int error_shown;         /* red X under the stimulus */
} scene;

static void ui_message(const char **lines,int n){
    scene.block=NULL; scene.stim_cat=NULL; scene.error_shown=0;
    clear_all();
    int save=fs, longest=0; for(int i=0;i<n;i++) if(ulen(lines[i])>longest) longest=ulen(lines[i]);
    while(fs>1 && longest*8*fs > W-20) fs--;            /* shrink font so the widest line fits the window */
    int lh=8*fs+6; int y=(H-n*lh)/2;
    for(int i=0;i<n;i++){ text_centered(y+i*lh,lines[i],white); if(echo){ puts(lines[i]); } }
    fs=save;
    if(echo) fflush(stdout);
    present();
}

static void draw_header(const Block *b){
    int lh=8*fs+6;
    draw_text(10,10,"Press E for:",white);
    draw_text(W-10-text_w("Press I for:"),10,"Press I for:",white);
    for(int i=0;i<b->nleft;i++)  draw_text(10,10+lh*(i+1),cat[b->left[i]].name,green);
    for(int i=0;i<b->nright;i++) draw_text(W-10-text_w(cat[b->right[i]].name),10+lh*(i+1),cat[b->right[i]].name,green);
}
static void draw_stimulus(const Cat *c,int item){
    int ci=(int)(c-cat);
    if(c->isimg[item]&&tex[ci][item]){
        int h=H*0.4, w=texw[ci][item]*h/texh[ci][item];
        if(w>W*0.6){ w=W*0.6; h=texh[ci][item]*w/texw[ci][item]; }
        SDL_Rect dst={(W-w)/2,(H-h)/2,w,h};
        SDL_RenderCopy(ren,tex[ci][item],NULL,&dst);
    } else text_centered(H/2-4*fs,c->isimg[item]?item_label(c,item):c->item[item],white);
}
static void draw_error(void){
    SDL_SetRenderDrawColor(ren,red.r,red.g,red.b,255);
    int s=6*fs, cx=W/2, cy=H/2+H*0.22;
    for(int t=-2;t<=2;t++){ SDL_RenderDrawLine(ren,cx-s+t,cy-s,cx+s+t,cy+s); SDL_RenderDrawLine(ren,cx-s+t,cy+s,cx+s+t,cy-s); }
}
static void redraw_scene(void){
    clear_all();
    if(scene.block) draw_header(scene.block);
    if(scene.stim_cat) draw_stimulus(scene.stim_cat,scene.stim_item);
    if(scene.error_shown) draw_error();
    present();
}

static void ui_header(const Block *b){ scene.block=b; scene.stim_cat=NULL; scene.error_shown=0; redraw_scene(); }
static void ui_stimulus(const Cat *c,int item){
    scene.stim_cat=c; scene.stim_item=item; scene.error_shown=0;
    if(echo){ printf("STIM %s\n",item_label(c,item)); fflush(stdout); }   /* test hook: driver keys off "STIM " */
    redraw_scene();
}
static void ui_clear_stimulus(void){ scene.stim_cat=NULL; scene.error_shown=0; redraw_scene(); }
static void ui_error(void){ scene.error_shown=1; redraw_scene(); }
static int map_key(SDL_Keycode k){ switch(k){ case SDLK_e: return 'e'; case SDLK_i: return 'i'; case SDLK_SPACE: return ' ';
    case SDLK_q: case SDLK_ESCAPE: return 'q'; default: return 0; } }
static int ui_key(void){
    SDL_Event ev;
    for(;;){
        if(stdin_keys){ /* test hook: poll both stdin and SDL */
            while(SDL_PollEvent(&ev)){ if(ev.type==SDL_QUIT) return 'q'; if(ev.type==SDL_KEYDOWN){ int k=map_key(ev.key.keysym.sym); if(k) return k; } }
            fd_set fds; FD_ZERO(&fds); FD_SET(0,&fds); struct timeval tv={0,1000};
            if(select(1,&fds,NULL,NULL,&tv)>0){ unsigned char ch; if(read(0,&ch,1)!=1) return 'q'; if(ch=='e'||ch=='i'||ch==' '||ch=='q') return ch; }
            continue;
        }
        if(!SDL_WaitEvent(&ev)) return 'q';
        if(ev.type==SDL_QUIT) return 'q';
        if(ev.type==SDL_KEYDOWN){ int k=map_key(ev.key.keysym.sym); if(k) return k; }
    }
}
static void ui_flush_keys(void){ SDL_Event ev; while(SDL_PollEvent(&ev)) if(ev.type==SDL_QUIT) exit(1);
    if(stdin_keys){ fd_set fds; struct timeval tv={0,0}; unsigned char ch;
        for(;;){ FD_ZERO(&fds); FD_SET(0,&fds); if(select(1,&fds,NULL,NULL,&tv)<=0||read(0,&ch,1)!=1) break; } } }

int main(int argc,char **argv){ return iat_main(argc,argv); }
