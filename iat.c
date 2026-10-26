/* iat.c — terminal frontend (libc only: termios + ANSI escapes).  Build: cc -O2 -std=c99 -o iat iat.c -lm
 * Image stimuli are shown as their file names here; use iat-sdl for pictures. */
#include "core.h"
#include <unistd.h>
#include <termios.h>
#include <sys/ioctl.h>
#include <signal.h>

static struct termios orig; static int raw_on=0; static int rows=24,cols=80;
static void restore(void){ if(raw_on){ tcsetattr(0,TCSANOW,&orig); printf("\033[?25h\033[0m\n"); raw_on=0; } }
static void on_sig(int s){ (void)s; restore(); _exit(1); }
static void at(int r,int c){ printf("\033[%d;%dH",r,c); }
static void centered(int r,const char *s){ int c=(cols-ulen(s))/2; if(c<1)c=1; at(r,c); fputs(s,stdout); }

static void ui_init(void){
    struct winsize w; if(!ioctl(1,TIOCGWINSZ,&w)&&w.ws_row&&w.ws_col){ rows=w.ws_row; cols=w.ws_col; }
    tcgetattr(0,&orig); struct termios t=orig;
    t.c_lflag&=~(ICANON|ECHO|ISIG); t.c_cc[VMIN]=1; t.c_cc[VTIME]=0;
    tcsetattr(0,TCSANOW,&t); raw_on=1; atexit(restore); signal(SIGINT,on_sig); signal(SIGTERM,on_sig);
    printf("\033[?25l");
    if(have_images){ fprintf(stderr,"note: image stimuli will be shown as file names in the terminal; build iat-sdl for pictures\n"); sleep_ms(1500); }
}
static void ui_quit(void){ restore(); printf("\033[2J\033[1;1H"); }
static void ui_message(const char **lines,int n){ printf("\033[2J"); int r0=rows/2-n/2; for(int i=0;i<n;i++) centered(r0+i,lines[i]); fflush(stdout); }
static void ui_header(const Block *b){
    printf("\033[2J"); at(1,1); printf("Press E for:"); at(1,cols-13); printf("Press I for:");
    for(int i=0;i<b->nleft;i++){ at(2+i,1); fputs(cat[b->left[i]].name,stdout); }
    for(int i=0;i<b->nright;i++){ at(2+i,cols-ulen(cat[b->right[i]].name)); fputs(cat[b->right[i]].name,stdout); }
    fflush(stdout);
}
static void ui_stimulus(const Cat *c,int item){ centered(rows/2,item_label(c,item));
    if(getenv("IAT_ECHO")) printf("\033[%d;1HSTIM %s",rows,item_label(c,item));   /* test hook, bottom line */
    fflush(stdout); }
static void ui_clear_stimulus(void){ at(rows/2,1); printf("\033[K"); at(rows/2+1,1); printf("\033[K"); fflush(stdout); }
static void ui_error(void){ at(rows/2+1,cols/2-1); printf("\033[31;1mX\033[0m"); fflush(stdout); }
static int ui_key(void){ unsigned char ch; if(read(0,&ch,1)!=1) return 'q'; return ch; }
static void ui_flush_keys(void){ struct termios t; tcgetattr(0,&t); t.c_cc[VMIN]=0; tcsetattr(0,TCSANOW,&t);
    unsigned char ch; while(read(0,&ch,1)==1); t.c_cc[VMIN]=1; tcsetattr(0,TCSANOW,&t); }

int main(int argc,char **argv){ return iat_main(argc,argv); }
