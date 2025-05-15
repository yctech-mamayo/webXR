#### 2025 05 14

以上訊息收到 我會今天更新 AR UI 時候一併處理:
1. 使用片數沒有靠左: 這點我自己的裝置沒有發生這問題。
    我測試後，確認 在 Line 的內建瀏覽模式下，UI呈現不太完整。
    建議所有網址後面加上 ?openExternalBrowser=1 讓用戶可以在預設瀏覽器中體驗。
2. Logo 太大: 會處理。 done
3. 步驟調整: 「鐘樓」、「恐龍」 會處理。 
    恐龍: 步驟2 變成  步驟2 - 步驟3 - 步驟4 done
    鐘樓: 原先步驟五拆成 步驟5 步驟6 步驟7 done


我今明兩天會更新 AR UI 上去。關於流程 跟 「掃描其他圖」的對應彈跳視窗的體驗。要調整請再跟我說。
流程文字解說如下:
1. 開啟網頁後，會先顯示「 四邊角掃描框 」跟「掃描說明文字」、「 下方按鈕列表 」( 「掃描其他圖」、「查看教學」、「所有作品」 )。
2. 點擊「掃描其他圖」: 會開啟「滿版作品列表調出視窗」。點擊個別產品之後，「掃描說明文字」內文會改變。可掃描的 AR辨識圖 也會改變。
3. 點擊「查看教學」: 會跳轉網址到對應的 VR detail 網頁。
4. 點擊「所有作品」:會跳轉網址到 列表頁。
5. 掃描到 AR 辨識圖: 會隱藏「 四邊角掃描框 」跟「掃描說明文字」，出現「操控說明文字」。同時隱藏「掃描其他圖」按鈕。



#### 2025 05 08

* 對方提出以下細節微調:
    1. component padding
    2. loading white
    3. logo vertical
    4. picsize same
    5. copyright 2025 sticky
    6. step text

* 紀錄: 
    1. VR: body 底色設定為 白色。不要跟 loading 有區隔 done
    2. 直版 標題:  切齊【 使用片數 】 done
    3. 步驟說明: 文字加上 讓 甲方 測試。 done
    4. 手機 直版: 重頭開始 完整作品 貼邊一點 done
    5. 平板 直版: 步驟說明文字 位置錯誤 done
    6. 使用片數 的 scroll bar onload時候 回到 靠前 靠右 done
    7. 平板 直版: 步驟說明文字 調大 Logo 調大 done
    8. 平板 直版: Logo 調大 done
    9. AR 手指操控 敏感度下調 done
    10. AR 起始載入: 固定旋轉 2 圈  done
    11. VR 體驗上 天鵝: 長大 大象: 飛入  done



#### 2025 05 07

* 在對照 使用片數 的時候。
1. 城堡 看起來缺少: 網格、方塊中間有半圓、
2. 恐龍 看起來缺少: 眼睛、
3. 大象 看起來缺少: 眼睛、
4. 火車 看起來缺少: 網格、
5. 森林的「基底物件」沒有找到對應的 圖片內容。


#### 2025 05 06
調整:
1. VR 使用片數 顏色，標題顏色。按鈕顏色 done
2. 列表頁: 上方顏色、本體顏色 done
3. FlyIn 功能初步完成 done
4. 大象/鐘樓 圖片更新 done
5. 


#### 2025 05 05

* 列表頁面:
    https://yctech-mamayo.github.io/webXR/list.html?openExternalBrowser=1

* VR: 
    天鵝 https://yctech-mamayo.github.io/webXR/detail/p1.html?openExternalBrowser=1
    大象 https://yctech-mamayo.github.io/webXR/detail/p2.html?openExternalBrowser=1
    恐龍 https://yctech-mamayo.github.io/webXR/detail/p3.html?openExternalBrowser=1
    鐘樓 https://yctech-mamayo.github.io/webXR/detail/p4.html?openExternalBrowser=1
    城堡 https://yctech-mamayo.github.io/webXR/detail/p5.html?openExternalBrowser=1
    火車 https://yctech-mamayo.github.io/webXR/detail/p6.html?openExternalBrowser=1
    拱門 https://yctech-mamayo.github.io/webXR/detail/p7.html?openExternalBrowser=1
    森林 https://yctech-mamayo.github.io/webXR/detail/p8.html?openExternalBrowser=1

* AR: 
    天鵝 https://yctech-mamayo.github.io/webXR/AR/p1.html?openExternalBrowser=1
    大象 https://yctech-mamayo.github.io/webXR/AR/p2.html?openExternalBrowser=1
    恐龍 https://yctech-mamayo.github.io/webXR/AR/p3.html?openExternalBrowser=1
    鐘樓 https://yctech-mamayo.github.io/webXR/AR/p4.html?openExternalBrowser=1
    城堡 https://yctech-mamayo.github.io/webXR/AR/p5.html?openExternalBrowser=1
    火車 https://yctech-mamayo.github.io/webXR/AR/p6.html?openExternalBrowser=1
    拱門 https://yctech-mamayo.github.io/webXR/AR/p7.html?openExternalBrowser=1
    森林 https://yctech-mamayo.github.io/webXR/AR/p8.html?openExternalBrowser=1


    建議所有網址後面加上 ?openExternalBrowser=1 是因為可以讓用戶從 line 連結直接開啟 預設瀏覽器


    
#### 2025 05 02

1. 載入畫面 全白 0.9 done
2. 步驟說明，不要淡出 。淡入就好 done
3. 列表頁面，點圖片 進入網址 
4. AR 授權相機， 提醒文字改為中文。 
5. 下方框 陰影條白 border 取消 done
6. 直版 標題上下沿 對齊 灰框
7. help_container opacity 0.8  done
8. 教學頁面 icon 文字 都在放大 ( help_text_1: margin 25, help_img_confirm: 150 , help_img_arrow: 90 ) done
9. 可直接用單指旋轉及雙指平移縮放模型，即可以360度來瀏覽磁力片作品 ( 兩行 ) done
10. stepTextContainer 移上一點。 改為最多兩排顯示。 done
11. 讓 AR VR 場景每一個面向 都是 亮面。 不應以 平行光 為目標 done
12. 平板 橫版 使用片數 高度拉大 done
 


更新一下目前進度:
昨天已經上線:
    1. VR 1-8 專案
    2. VR 步驟文字顯示
    3. VR 載入畫面
    4. VR 介紹遊玩方式畫面
    5. UI 調整( 手機直橫、平板直橫 )
    6. VR 起始視角設定

後面預計製作:
    1. VR 各別磁力片飛入動畫
    2. 列表頁、AR頁面的 UI/UX ( 假如設計師有示意圖，請提供給我 )
    3. 請提供給我 正確的「 專案內步驟顯示文字 」
    4. 請提供給我 「 專案內步驟對應希望的相機視角 」
     


#### 2025 04 28


1. 下方寬度增加 文字大小不變 gap 增加  done
2. 按鈕(重頭開始、完整作品) 起始色為 深灰色(調整) 點擊狀態 改為 filter done
3. 購買按鈕 圓角加大 (直橫不同) done
4. 標題 字體加大  done
5. loading 希望 有 max-size 平板上 ，換為 png 點點動畫 css 做。
6. 灰線再淺一點 done
7. 平板 直橫版 版型 字體 重調整 ( 最後 ) done
8. 介面規劃: logo 置中 。 兩按鈕 置底(左右)。標題置底 組件區域靠標題  done
9. 下方陰影 調淺色一點 done
10. 步驟 文字 改為 上:步驟 下: 1/9 done


* 媽媽友回報:
    1. 旋轉放大縮小遮罩
    2. 從頭開始(button click status) 不好按(可能沒有滿版)
    3. 新增回到所有作品
    4. 少部分作品希望更細一些 例如恐龍(待討論)
    5. loading 透視感
    6. 作品打開來超滿

#### 2025 04 23
    
* 今日我會開始進行頁面 UI 建置。以下有些內容跟資料，請評估是否希望加入網頁。
    1. 背景音樂( 手機裝置下，聲音需要使用者有互動行為才能夠進行播放，我會加在使用者有點擊行為後觸發。 )
    2. 每個頁面的 meta 內容( SEO跟分享所需 ): 「 標題文字 」「簡介文字」「600x400 的分享圖片」
    3. 網站的 icon
    4. 網站的隱私權聲明，建議可小字放於每頁面的右下角
    5. 網站的擁有者介紹文字 ，建議會放在 首頁跟列表頁的底部
    6. 你們的社群網址( Line, FB, IG, YT 等等 )，建議會放在 首頁跟列表頁的底部
    
補充:
    1. 網頁載入中( 下載素材、載入場景 )的圖片( 建議 單張圖片 或 GIF 或 連續圖片我來組裝 )


對方回應:
    2. © 2025 Mamayo. All rights reserved.
        您可視版面調整文字串長短

    3. 每一頁TITLE
        VR展示列表 - 媽媽友mamayo磁力片
        XXXXX作品名 - 媽媽友mamayo磁力片
        右上角的中文與英文名
        網頁內標題我現在給您
        天鵝 – Swan
        火車 – Train
        城堡 – Castle
        大象 – Elephant
        恐龍 – Dinosaur
        鐘樓 – Clock Tower
        拱橋 – Arch Bridge
        森林 – Forest 

    4. 可以不需要有首頁 沒關係 謝謝您

    5. 網站icon 您指的應該是favicon?
        這邊給您 謝謝


#### 2025 04 22

對接 天鵝 恐龍 模型:

    您好 關於 模型，有以下幾點問題請您幫忙評估修改。
    1. 天鵝的眼睛，貌似只有單一 mesh ，這樣我無法設定「眼白」、「眼黑」 
    2. 天鵝的軀體，看起來中間應該有一片。檔案中沒有看到
    3. 天鵝的頭部， mesh 16, 17 的磁鐵部分，看起來沒有帶到 mesh( 只有16-1, 17-1, 沒有 16-2, 17-2, )

紀錄
恐龍 天鵝 拱門 的範例 AR VR 網站已經上線
請觀看後有需要調整的地方再跟我說

1. 恐龍:
    AR: https://yctech-mamayo.github.io/webXR/AR/p3.html
    VR: https://yctech-mamayo.github.io/webXR/detail/p3.html
    
    天鵝:
    AR: https://yctech-mamayo.github.io/webXR/AR/p1.html
    VR: https://yctech-mamayo.github.io/webXR/detail/p1.html

    拱門: 
    AR: https://yctech-mamayo.github.io/webXR/AR/p7.html
    VR: https://yctech-mamayo.github.io/webXR/detail/p7.html

#### 2025 04 22

* 製作 AR,VR 完成:

    1. 城堡:
    AR: https://yctech-mamayo.github.io/webXR/AR/p5.html
    VR: https://yctech-mamayo.github.io/webXR/detail/p5.html
    
    火車:
    AR: https://yctech-mamayo.github.io/webXR/AR/p6.html
    VR: https://yctech-mamayo.github.io/webXR/detail/p6.html
        


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
