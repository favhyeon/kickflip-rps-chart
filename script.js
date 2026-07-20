/* ==========================================
   KickFlip RPS Chart
========================================== */

const members = [
    "계훈",
    "아마루",
    "동화",
    "주왕",
    "민제",
    "케이주",
    "동현"
];

const nick = {
    "계훈":"곈",
    "아마루":"넛",
    "동화":"녘",
    "주왕":"랜",
    "민제":"젬",
    "케이주":"킷",
    "동현":"넹"
};

const options = [
    {name:"OTP",color:"#ff4d88"},
    {name:"좋아함",color:"#ff9ec8"},
    {name:"호감",color:"#ffd54f"},
    {name:"괜찮음",color:"#8bd66d"},
    {name:"관심 X",color:"#ffffff"},
    {name:"별로",color:"#87d8ff"},
    {name:"지뢰",color:"#8a8a8a"}
];

const STORAGE_KEY = "kickflip-rps";

const table = document.getElementById("chartTable");

const modal = document.getElementById("modal");
const optionList = document.getElementById("optionList");
const shipTitle = document.getElementById("shipTitle");

const closeModal = document.getElementById("closeModal");
const clearSelection = document.getElementById("clearSelection");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

const saveModal = document.getElementById("saveModal");
const previewImage = document.getElementById("previewImage");
const closeSaveModal = document.getElementById("closeSaveModal");

let currentCell = null;

let saveData =
JSON.parse(localStorage.getItem(STORAGE_KEY))
|| {};

createTable();

/* ==========================================
   표 생성
========================================== */

function createTable(){

    table.innerHTML="";

    const head=document.createElement("tr");

    const empty=document.createElement("th");

    head.appendChild(empty);

    members.forEach(member=>{

        const th=document.createElement("th");

        th.textContent=member;

        head.appendChild(th);

    });

    table.appendChild(head);

    members.forEach((row,rowIndex)=>{

        const tr=document.createElement("tr");

        const rowHead=document.createElement("th");

        rowHead.textContent=row;

        tr.appendChild(rowHead);

        members.forEach((col,colIndex)=>{

            const td=document.createElement("td");

            td.dataset.key=`${rowIndex}-${colIndex}`;

            if(rowIndex===colIndex){

                td.textContent="—";

                td.style.cursor="default";

            }else{

                td.textContent=
                nick[row]+nick[col];

                if(saveData[td.dataset.key]){

                    td.style.background=
                    saveData[td.dataset.key];

                }

                td.onclick=()=>{

                    currentCell=td;

                    openModal(row,col);

                };

            }

            tr.appendChild(td);

        });

        table.appendChild(tr);

    });

}

/* ==========================================
   모달 열기
========================================== */

function openModal(row,col){

    shipTitle.textContent =
    nick[row] + nick[col];

    optionList.innerHTML = "";

    options.forEach(option=>{

        const item =
        document.createElement("div");

        item.className = "option";

        item.innerHTML = `
            <span
                class="dot"
                style="background:${option.color}">
            </span>

            <span>${option.name}</span>
        `;

        item.onclick = ()=>{

            currentCell.style.background =
            option.color;

            saveData[currentCell.dataset.key] =
            option.color;

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(saveData)
            );

            modal.classList.add("hidden");

        };

        optionList.appendChild(item);

    });

    modal.classList.remove("hidden");

}

/* ==========================================
   모달 닫기
========================================== */

closeModal.onclick = ()=>{

    modal.classList.add("hidden");

};

window.onclick = (e)=>{

    if(e.target===modal){

        modal.classList.add("hidden");

    }

};

/* ==========================================
   선택 지우기
========================================== */

clearSelection.onclick = ()=>{

    if(!currentCell) return;

    currentCell.style.background = "#ffffff";

    delete saveData[currentCell.dataset.key];

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(saveData)
    );

    modal.classList.add("hidden");

};

/* ==========================================
   초기화
========================================== */

resetBtn.onclick = ()=>{

    if(!confirm("모든 선택을 초기화할까요?"))
    return;

    localStorage.removeItem(STORAGE_KEY);

    saveData = {};

    createTable();

};

/* ==========================================
   이미지 저장
========================================== */

const preloadLogo = new Image();
preloadLogo.src = "assets/logo.png";

saveBtn.onclick = () => {

    const buttonWrap = document.querySelector(".button-wrap");
    const area = document.getElementById("captureArea");

    const prevTransform = area.style.transform;
    const prevMargin = area.style.margin;
    const prevParentHeight = area.parentElement.style.height;

    buttonWrap.style.display = "none";

    html2canvas(area, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        width: 1400,
        windowWidth: 1400
    }).then(canvas => {

        buttonWrap.style.display = "flex";

        const image = canvas.toDataURL("image/png");

        previewImage.src = image;
        saveModal.classList.remove("hidden");

        const link = document.createElement("a");
        link.href = image;
        link.download = "KickFlip_RPS.png";
        link.click();

    });

};

/* ==========================================
   저장 완료 모달 닫기
========================================== */

closeSaveModal.onclick = ()=>{

    saveModal.classList.add("hidden");

};

saveModal.onclick = (e)=>{

    if(e.target===saveModal){

        saveModal.classList.add("hidden");

    }

};
/* ==========================================
   기타 초기 설정
========================================== */

// ESC 키를 누르면 모달 닫기
document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        modal.classList.add("hidden");

        saveModal.classList.add("hidden");

    }

});

/* ==========================================
   끝
========================================== */

/* ==========================================
   모바일 자동 축소 (높이 보정)
========================================== */

/* ==========================================
   모바일 자동 축소 (wrapper 높이도 같이 조절)
========================================== */

function fitCaptureArea() {

    const area = document.getElementById("captureArea");
    const wrap = document.getElementById("scaleWrap");

    if (!area || !wrap) return;

    // 원래 크기
    const ORIGINAL_WIDTH = 1400;

    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

    const scale = Math.min(1, screenWidth / ORIGINAL_WIDTH);

    area.style.transformOrigin = "top left";
    area.style.transform = `scale(${scale})`;

    wrap.style.height = `${area.scrollHeight * scale}px`;
}

fitCaptureArea();

window.addEventListener("load", fitCaptureArea);
window.addEventListener("resize", fitCaptureArea);

window.addEventListener("orientationchange", () => {
    setTimeout(fitCaptureArea, 200);
});
