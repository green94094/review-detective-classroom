export type Review = { id:string; place:number; author:string; stars:number; text:string; time:string; fake:boolean; evidence:string; clue:string };
export const places = [
 {name:'구름마을 순두부',menu:'순두부',code:'A',real:[...Array(6).fill(1),...Array(6).fill(2)],fake:38,attack:5},
 {name:'파도별 생선구이',menu:'생선구이',code:'B',real:[...Array(14).fill(5),...Array(6).fill(4)],fake:30,attack:1},
 {name:'솔바람 국수집',menu:'잔치국수',code:'C',real:Array(44).fill(4),fake:6,attack:5},
 {name:'달빛 감자식당',menu:'감자전',code:'D',real:[...Array(35).fill(4),...Array(9).fill(3)],fake:6,attack:5},
 {name:'초록지붕 김밥',menu:'김밥',code:'E',real:[...Array(22).fill(4),...Array(23).fill(3)],fake:5,attack:5},
 {name:'바다우체통 분식',menu:'떡볶이',code:'F',real:[...Array(9).fill(4),...Array(36).fill(3)],fake:5,attack:1}
];
const pos=['여기만이 진짜 맛집! 무조건 추천합니다!','최고!','인생맛집! 세상에서 제일 맛있음! 무조건 가세요!','여기만이 진짜 맛집! 무조건 추천합니다!'];
const neg=['절대 가지 마세요! 여기만 빼고 다 좋아요!','최악!','한 입도 못 먹겠어요. 모두 별점 1점 주세요!','절대 가지 마세요! 여기만 빼고 다 좋아요!'];
const detail=['직원이 메뉴를 설명해 주었어요.','창가 자리에 앉았어요.','점심에 가족과 다녀왔어요.','주문하고 10분 정도 기다렸어요.','물은 직접 가져다 마셨어요.','둘이 가서 한 접시를 나눠 먹었어요.'];
export const reviews:Review[]=places.flatMap((p,k)=>{
 const real:Review[]=p.real.map((s,i)=>({id:`${p.code}-${i+1}`,place:k,author:`여행자 ${String((i*17+k*11)%97+1).padStart(2,'0')}`,stars:s,
 text:i===3?(s<=2?'아쉬워요!':'맛있어요!'):`${p.menu}${s<=2?'가 제 입에는 짜고 식어 있었어요.':s===3?'는 무난했어요. 양이 조금 아쉬웠어요.':s===4?'가 따뜻하고 맛있었어요.': '가 잘 익었고 양도 넉넉했어요.'} ${detail[i%detail.length]}`,
 time:`09.${String(i%24+1).padStart(2,'0')} ${i===3?'03:12':`${11+i%9}:${String(i*7%60).padStart(2,'0')}`}`,
 fake:false,clue:'경험 확인',evidence:i===3?'연습용 확인 기록: 방문·결제 내용과 본인 경험이 확인되었습니다. 짧은 글을 새벽에 썼지만 조작한 리뷰는 아닙니다.':'연습용 확인 기록: 메뉴 주문 내역과 방문 경험이 확인되었습니다. 다른 사람과 취향이 달라도 이 평가는 남겨야 합니다.'}));
 const fake:Review[]=Array.from({length:p.fake},(_,i)=>({id:`${p.code}-${real.length+i+1}`,place:k,author:`여행자 ${String((i*13+41+k)%97+1).padStart(2,'0')}`,stars:p.attack,text:(p.attack===5?pos:neg)[i%4],time:`09.25 03:${String(i%60).padStart(2,'0')}`,fake:true,clue:i%4===1?'짧은 표현 + 집중 등록':i%4===2?'극단적 표현 + 집중 등록':'반복 문장 + 집중 등록',evidence:p.attack===5?'연습용 조사 기록: 방문하지 않은 사람이 보상을 받고 별점 5점 글을 여러 계정으로 올렸다는 조작 기록이 확인되었습니다.':'연습용 조사 기록: 방문하지 않은 사람이 가게의 평점을 떨어뜨리려고 낮은 별점을 여러 계정으로 올렸다는 조작 기록이 확인되었습니다.'}));
 return [...real,...fake].sort((a,b)=>{const n=(x:Review)=>(Number(x.id.split('-')[1])*19)%53;return n(a)-n(b)});
});
export function ranking(data:Review[]){return places.map((p,i)=>{const rs=data.filter(r=>r.place===i);return {...p,index:i,count:rs.length,score:rs.length?rs.reduce((a,r)=>a+r.stars,0)/rs.length:0}}).sort((a,b)=>b.score-a.score||a.index-b.index)}
export const baseline=ranking(reviews);
export const truth=ranking(reviews.filter(r=>!r.fake));
export const lessons=[
 {title:'반복 문장',question:'복사한 듯한 문장 두 개를 찾아보세요.',hint:'서로 다른 사람이 같은 문장을 썼나요? 여러 리뷰를 함께 비교해 보세요.',texts:['국수가 따뜻했어요. 양은 조금 적었어요.','여기만이 진짜 맛집! 무조건 추천합니다!','비 오는 날 가서 감자전을 먹었어요.','여기만이 진짜 맛집! 무조건 추천합니다!','가족과 순두부 두 그릇을 나눠 먹었어요.'],target:[1,3],note:'같은 문장은 복사한 흔적일 수 있어요. 흔한 표현이 우연히 겹칠 수도 있으니 작성 기록을 더 확인해요.'},
 {title:'짧은 표현',question:'경험 정보가 부족한 리뷰 두 개를 찾아보세요.',hint:'무엇을 먹었고 어땠는지 알 수 있나요? 정보가 적은 것과 거짓인 것은 달라요.',texts:['김밥의 채소가 아삭했어요.','굿!','줄이 길었지만 15분 뒤 들어갔어요.','생선구이는 따뜻했지만 조금 짰어요.','최고!'],target:[1,4],note:'짧다는 이유만으로 삭제하면 안 돼요. 실제로 방문한 사람이 짧게 썼을 수도 있어요.'},
 {title:'등록 시간',question:'1분 간격으로 몰려 올라온 리뷰 두 개를 찾아보세요.',hint:'새벽이라는 시간 하나보다 여러 글이 한꺼번에 올라온 패턴을 봐요.',texts:['국수가 맛있었어요.','여기만이 진짜 맛집!','무조건 여기로 가세요!','감자전이 바삭했어요.','저녁에 먹고 이제야 후기 써요.'],times:['09.21 12:10','09.25 03:01','09.25 03:02','09.22 18:30','09.18 03:00'],target:[1,2],note:'새벽에 쓴 진짜 리뷰도 있어요. 같은 날 짧은 시간에 집중된 글은 다른 단서와 함께 조사해요.'},
 {title:'극단적 표현',question:'무조건적인 칭찬·비난 두 개를 찾아보세요.',hint:'가짜는 칭찬일 수도, 비난일 수도 있어요. 구체적인 경험이 있는지 살펴봐요.',texts:['무조건 최고! 세계 1위! 안 가면 후회!','제 입에는 양념이 매웠어요.','김밥이 두툼해서 든든했어요.','절대 가지 마! 모두 1점 줘요!','기다리는 시간이 길어 아쉬웠어요.'],target:[0,3],note:'강한 감정만으로 거짓이라고 단정하지 않아요. 실제 불편을 겪은 사람의 부정적인 평가도 존중해요.'}
];
export const scenarios=[
 {q:'가본 적 없는 식당에 별점 5점을 달아 달래요.',options:['부탁이니까 5점을 줘요.','직접 가보지 않아서 평가하기 어렵다고 설명해요.','이번에는 3점만 줘요.'],good:1,why:'별점도 다른 사람의 선택에 영향을 주는 데이터예요. 직접 경험하지 않았다면 경험한 것처럼 평가하지 않아요.'},
 {q:'친구가 돈을 받고 가짜 게임 리뷰를 100개 쓰자고 해요.',options:['재미있어 보이면 함께 써요.','들키지 않게 문장만 바꿔요.','거절하고, 거짓 리뷰가 다른 사람을 속일 수 있다고 말해요.'],good:2,why:'보상을 받는다는 이유로 경험을 꾸며 쓰면 사람들의 선택을 속이게 돼요. 실제 경험을 쓸 때에도 받은 혜택은 밝혀요.'},
 {q:'영상으로만 본 식당을 친구들에게 소개하고 싶어요.',options:['“영상에서 봤는데 가보고 싶어. 직접 먹어보진 않았어.”라고 해요.','“내가 먹어봤는데 최고야!”라고 해요.','“모두가 맛있다고 하니까 무조건 가!”라고 해요.'],good:0,why:'본 정보의 출처와 직접 경험한 내용을 구분해요. “영상에서 봤다”는 사실과 “가보고 싶다”는 생각은 솔직하게 말할 수 있어요.'}
];

