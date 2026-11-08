import json,re,sys
STOP=set('the a an and or of to in on for with your you yours this that from into over under about more less city memphis what who how where when see open go back done close new now all any each one two three year years month months your a action actions uses use left free chance works fails odds'.split())
def words(t):
    return {w[:5] for w in re.findall(r"[a-z]{4,}",t.lower()) if w not in STOP}
def money(t):
    m=re.findall(r"\$\s?([\d,.]+)\s?(k|m|million|thousand)?",t,re.I);return m
def judge(f,mode):
    out=[];rows=[]
    for r in json.load(open(f)):
        for g in r.get('go',[]):
            lab=g['label'];L=lab.split(' [')[0];d=g['dest'];a=g['st0'];b=g['st1']
            txt=(d['title']+' '+d['sub']+' '+d['body']).lower()
            rows.append(f"{r['screen']:14}|{L[:60]:60}|{d['kind']}:{d['title'][:40]}|{d['sub'][:30]}|{d['body'][:110]}")
            if g['dead']: continue
            flags=[]
            moved=(d['title']!=g['from'])
            if d['kind'] in('modal','panel','dialog') and len(d['body'])<40 and d['btns']<=1: flags.append('EMPTY screen')
            if d['kind']=='modal' and not d['exit']: flags.append('NO WAY OUT')
            if mode.startswith('after') and re.search(r"mayor's actions|reserve \$|take action|\bmayor [A-Z]|as mayor|7th floor",d['title']+' '+d['sub']+' '+d['body'][:300]): flags.append('MAYOR WORDING out of office')
            lw=words(L)
            if moved and lw and d['kind'] in('modal','panel','dialog','card') and not (lw & words(txt[:700])): flags.append('NO WORD MATCH')
            ds=(a['slots'] or 0)-(b['slots'] or 0)
            dra=(b['ra'] or 0)-(a['ra'] or 0) if a['ra'] is not None else 0
            if re.search(r"\b1 action\b|uses 1 action",lab,re.I) and ds<=0 and dra<=0 and not re.search(r"choose|pick|who|which",txt[:200]): flags.append(f'SAYS 1 ACTION, used {ds}')
            if ds>0 and not re.search(r"action",lab,re.I) and not mode.startswith('after'): flags.append(f'USED {ds} ACTION(S) without saying so')
            if re.search(r"\bfree\b",lab,re.I) and (b['cash']<a['cash'] or b['res']<a['res']): flags.append('SAYS FREE but cost money')
            if '⏱' in d['body']:
                rest=re.sub(r'⏱.*?this (month|year)','',d['body']);rest=re.sub(r'Back to work|More actions|Back to it','',rest).strip()
                if len(rest)<15: flags.append('EMPTY RESULT popup')
            if r['screen'] in('actions',) : flags=[x for x in flags if not x.startswith('USED')]
            if L=='(no text)': flags=[x for x in flags if x!='NO WORD MATCH']
            if flags: out.append((r['screen'],L,d['kind']+':'+d['title'],d['body'][:160],flags,{k:(a[k],b[k]) for k in a if a[k]!=b[k]}))
    return out,rows
if __name__=='__main__':
    f,mode=sys.argv[1],sys.argv[2]
    out,rows=judge(f,mode)
    open(f.replace('.json','_rows.txt'),'w').write('\n'.join(rows))
    for o in out: print(o[0],'|',o[1][:60],'->',o[2][:60],'|',o[4],'|',o[5],'\n     ',o[3][:150])
    print(len(out),'flagged of',len(rows))
