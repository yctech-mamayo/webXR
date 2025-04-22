

#### 2025 04 22

3D 模型提供紀錄:
    大象: 
        2025 04 14 
        elephant(無渲染A3).rar
        https://drive.google.com/file/d/159aCGACChbUMLRHg1r_8OAtwFfhAwQUb/view?usp=drive_link

    天鵝:
        2025 04 17
        天鵝(A0)
        https://drive.google.com/file/d/1862APrZZgaRPyP7EwLpJXfQb-1v2M0c0/view?usp=drive_link

    火車:
        2025 04 19
        火車(A0).rar
        https://drive.google.com/file/d/1TkxBq8GAe31dl4y1PfyPVXuEAiORq0Fc/view?usp=drive_link

    城堡:
        2025 04 20
        城堡(a0).rar
        https://drive.google.com/file/d/14pd7CPSErV7s630nv9vfMEdhOebTZtg_/view?usp=drive_link        

    恐龍:
        2025 04 22
        恐龍(a0).rar
        https://drive.google.com/file/d/1RFMoGVt9_6OsLbly0je9g8M-alTq2cuI/view?usp=drive_link



回應給 3D 設計師:
    您好，以下是檢查 模型 mesh 有「 重複名稱 」的部分。
    麻煩請幫我重新命名，感謝。

    天鵝:
        「 14 」、「 14-1 」、「 14-2 」
    
    恐龍: 
        「 52-1 」、「 54-1 」

    




#### 2025 04 21 

* 大致開發進程:

    1. 素材檢查 設定資料八個作品弄完 4天
    2. AR連結
    3. UI 場景色系
    4. 放文字: 進場效果


* 紀錄關於 媽媽友的提問:

    * 4/18: 
    1. AR 跟 VR 磁力片作品本人看能否再亮一點 ?
    2. AR出來的大象能否是與觀看的人同方向不要用俯瞰模式，然後預設俯瞰的作品能否再大一點?
    會有一些進場的效果嗎?
    3. AR模式為何會一直抖動的狀況 可以看影片後半段
    4. UI的部分應該後面才會修改對吧? 有看到一些頁面出來 感動~~~
    所以我們網址可以先確認了對吧?

    看能否改成類似這樣 讓他再圖片底部為轉動的中心點 然後一掃了之後 大象直接pop up 在鏡頭裡

    上面 可以有(作品標題)
    下面 如規劃的三個按鈕

* 回應:
    1. 亮度都可以調整。
    2. 角度跟大小 都可以調整。進場效果的部分，再不動模型的情況下，我會做【 點放大/面放大 】的效果。
    3. AR模式抖動的部分，我看影片，可能是因為反光的白色影響。
    4. 網址部分 可以確認 ，就是上面我給出的範例
        首頁: https://yctech-mamayo.github.io/webXR/index.html?openExternalBrowser=1
        列表頁: https://yctech-mamayo.github.io/webXR/list.html?openExternalBrowser=1
        AR 體驗頁面:https://yctech-mamayo.github.io/webXR/AR/p2.html?openExternalBrowser=1
        VR 體驗頁面:https://yctech-mamayo.github.io/webXR/detail/p2.html?openExternalBrowser=1
    5. 調整【 控制物件旋轉的中心 】這點，需要再評估。後面的流程我有點聽不懂，我們可以約時間再進行討論。


#### 2025 04 18

測試確認 VR AR 皆可於 github 基底使用
流量上，貌似比較緩慢，未來建議外接 AWS S3

AR 範例:
    https://yctech-mamayo.github.io/webXR/AR/p2.html?openExternalBrowser=1
VR 範例:
    https://yctech-mamayo.github.io/webXR/detail/p2.html?openExternalBrowser=1

後續預計的使用網址延續上面規則:
    首頁: 
        https://yctech-mamayo.github.io/webXR/index.html?openExternalBrowser=1
    列表頁:
        https://yctech-mamayo.github.io/webXR/list.html?openExternalBrowser=1
    提醒: 假如希望用戶從 line 上面直接點擊網址可以前往 safari 或是 chrome 瀏覽器
        必須加上【 ?openExternalBrowser=1 】於網址後面。
        如此才能使用完整瀏覽器的功能

    VR 體驗頁面:
        https://yctech-mamayo.github.io/webXR/detail/p1 ~ p8.html
    AR 詳細步驟頁面:
        https://yctech-mamayo.github.io/webXR/AR/p1 ~ p8.html

假如希望調整網址名稱，請再跟我說

#### 2025 04 16

預計未來作為【 Release 版本 】
網址: 
    https://yctech-mamayo.github.io/webXR


框架規劃:

    首頁: 
        https://yctech-mamayo.github.io/webXR/index.html

    列表頁:
        https://yctech-mamayo.github.io/webXR/list.html

    詳細資訊頁:
        https://yctech-mamayo.github.io/webXR/detail/p1.html  ~
        https://yctech-mamayo.github.io/webXR/detail/p8.html  

    AR 掃描頁:
        https://yctech-mamayo.github.io/webXR/AR/p1.html  ~
        https://yctech-mamayo.github.io/webXR/AR/p8.html  


# webXR
媽媽友磁力片release 版本

設計參考:
    https://docs.google.com/presentation/d/1Wd7BBdHB4J__dgBYJU1t-cE4WpCjmvyKmOTb8nwfR9Y/edit?slide=id.p#slide=id.p
    一定有缺少，邊做邊問。

3D 美術提供素材:
    https://drive.google.com/drive/folders/1_qzu65z4iPZ1uQu-hKNW6kXElEA4SIYp


磁力片 設計 顏色 步驟:
    https://drive.google.com/drive/folders/1bxoyqyHdGC8MJ_tDJL_SkH4PfImQlJdC
