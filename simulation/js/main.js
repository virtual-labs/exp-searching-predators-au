let last=null;
function g(id){return +document.getElementById(id).value;}
const chart=()=>document.getElementById('chart');
function build(){
  const hp1=g('hp1'),hp2=g('hp2'),ep1=g('ep1'),ep2=g('ep2'),es=g('es'),eh=g('eh');
  const rel=+document.getElementById('a2rel').value, mode=document.getElementById('plotMode').value;
  const aS=g('aStart'),aStep=Math.max(0.005,g('aStep')),aE=g('aEnd');
  const s1=[],s2=[],both=[];
  for(let a1=aS;a1<=aE+1e-9;a1+=aStep){
    const a2=rel*a1, A=a1+a2, w1=a1/A, w2=a2/A;
    const time1=1/a1+hp1, time2=1/a2+hp2, timeB=(1+hp1*a1+hp2*a2)/A;
    const en1=ep1-es/a1-eh*hp1, en2=ep2-es/a2-eh*hp2;
    const pB=hp1*w1+hp2*w2, enB=ep1*w1+ep2*w2-es/A-eh*pB;
    let y1,y2,yB;
    if(mode==='time'){y1=time1;y2=time2;yB=timeB;}else if(mode==='energy'){y1=en1;y2=en2;yB=enB;}else{y1=en1/time1;y2=en2/time2;yB=enB/timeB;}
    const x=+a1.toFixed(3);s1.push([x,+y1.toFixed(3)]);s2.push([x,+y2.toFixed(3)]);both.push([x,+yB.toFixed(3)]);
  }
  return {s1,s2,both,mode};
}
function run(){
  const d=build();last=d;
  const ylab={time:'Time per item (s)',energy:'Net energy per item (kCal)',rate:'Net energy per time (kCal/s)'}[d.mode];
  const ttl={time:'Time per item vs prey-1 abundance',energy:'Energy per item vs prey-1 abundance',rate:'Energy per time vs prey-1 abundance'}[d.mode];
  const series=[{color:'#b50246',name:'Eat prey-1 only',data:d.s1},{color:'#0e7c86',name:'Eat prey-2 only',data:d.s2},{color:'#e0662c',name:'Eat both prey',data:d.both}];
  Chart.draw(chart(),series,{xlabel:'Abundance of prey-1 (per second)',ylabel:ylab,ratio:0.55});setLegend(series);
  document.getElementById('plotTitle').textContent=ttl;
  document.getElementById('counts').innerHTML=(d.mode==='rate')?'The optimal diet is whichever curve is highest at a given prey abundance — a specialist switches to a generalist as prey become scarce.':'Compare specialising on one prey type against taking both.';
}
function sync(){document.querySelectorAll('#simbox .val').forEach(function(v){var el=document.getElementById(v.id.slice(2));if(el)v.textContent=el.value;});}
const D={hp1:6,hp2:120,ep1:150,ep2:2000,es:1,eh:5,aStart:0.02,aStep:0.02,aEnd:1};
function resetSim(){for(const k in D)document.getElementById(k).value=D[k];document.getElementById('plotMode').value='time';document.getElementById('a2rel').value='1';sync();run();toast('Reset');}
function downloadCSV(){if(!last){toast('Plot first');return;}let csv='prey1_abundance,prey1_only,prey2_only,both\n';for(let i=0;i<last.s1.length;i++)csv+=last.s1[i][0]+','+last.s1[i][1]+','+last.s2[i][1]+','+last.both[i][1]+'\n';dl(csv,'searching-predators.csv','text/csv');toast('CSV downloaded');}
var _lr;document.querySelectorAll('#simbox input[type=range]').forEach(function(el){el.addEventListener('input',function(){clearTimeout(_lr);_lr=setTimeout(run,110);});});
sync();window.addEventListener('resize',function(){if(last)run();});
