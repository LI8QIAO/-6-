class Game {
    constructor() {
        this.container = document.getElementById('level-container');
        this.glitchOverlay = document.getElementById('glitch-overlay');
        this.currentLevel = 0;
        this.score = 0;
        this.state = {};
        
        this.init();
    }

    init() {
        // 检查是否从循环回来
        this.isLoop = localStorage.getItem('dream_loop') === 'true';
        this.loadLevel(0);
    }

    async transition() {
        this.glitchOverlay.classList.remove('hidden');
        document.body.classList.add('tearing');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        document.body.classList.remove('tearing');
        this.glitchOverlay.classList.add('hidden');
    }

    async loadLevel(level) {
        this.currentLevel = level;
        await this.transition();
        this.container.innerHTML = '';
        
        switch(level) {
            case 0: this.setupLevel0(); break;
            case 1: this.setupLevel1(); break;
            case 2: this.setupLevel2(); break;
            case 3: this.setupLevel3(); break;
            case 4: this.setupLevel4(); break;
            case 5: this.setupLevel5(); break;
        }
    }

    // --- Level 0: 颜色反应测试 ---
    setupLevel0() {
        const title = document.createElement('h1');
        title.className = 'level-title';
        title.innerText = '颜色反应测试';
        this.container.appendChild(title);

        if (this.isLoop) {
            const npcMsg = document.createElement('p');
            npcMsg.innerText = '“又回来了？” —— 监考员低声自语。';
            npcMsg.style.color = 'var(--error-color)';
            npcMsg.style.fontStyle = 'italic';
            this.container.appendChild(npcMsg);
        }

        const targetDiv = document.createElement('div');
        targetDiv.style.fontSize = '4rem';
        targetDiv.style.margin = '40px';
        targetDiv.id = 'color-target';
        this.container.appendChild(targetDiv);

        const btnContainer = document.createElement('div');
        this.container.appendChild(btnContainer);

        const colors = [
            { name: '红', value: 'red' },
            { name: '蓝', value: 'blue' },
            { name: '绿', value: 'green' },
            { name: '黄', value: 'yellow' }
        ];

        let count = 0;
        const updateTest = () => {
            if (count >= 10) {
                this.showLevelEnd('检测到脑电波异常……你实际上在第1层梦里，刚才的反应测试只是潜意识投射。', 1);
                return;
            }

            const targetColor = colors[Math.floor(Math.random() * colors.length)];
            const displayColor = colors[Math.floor(Math.random() * colors.length)];
            
            targetDiv.innerText = targetColor.name;
            targetDiv.style.color = displayColor.value;
            
            btnContainer.innerHTML = '';
            // 打乱颜色顺序生成按钮
            [...colors].sort(() => Math.random() - 0.5).forEach(c => {
                const btn = document.createElement('button');
                btn.innerText = c.name;
                btn.onclick = () => {
                    if (c.value === displayColor.value) {
                        count++;
                        updateTest();
                    } else {
                        // 失败稍微惩罚一下，但不让退出
                        document.body.style.background = '#300';
                        setTimeout(() => document.body.style.background = '', 100);
                    }
                };
                btnContainer.appendChild(btn);
            });
        };

        updateTest();
    }

    showLevelEnd(text, nextLevel) {
        this.container.innerHTML = '';
        const msg = document.createElement('div');
        msg.className = 'msg-box glitch';
        msg.innerText = text;
        this.container.appendChild(msg);

        setTimeout(() => {
            this.loadLevel(nextLevel);
        }, 3000);
    }

    // 占位方法，后续补全
    // --- Level 1: 记忆碎片层 ---
    setupLevel1() {
        const title = document.createElement('h1');
        title.className = 'level-title';
        title.innerText = '记忆碎片';
        this.container.appendChild(title);

        const puzzleContainer = document.createElement('div');
        puzzleContainer.style.display = 'grid';
        puzzleContainer.style.gridTemplateColumns = 'repeat(3, 100px)';
        puzzleContainer.style.gap = '5px';
        this.container.appendChild(puzzleContainer);

        const pieces = [];
        const correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let currentOrder = [...correctOrder].sort(() => Math.random() - 0.5);

        const renderPuzzle = () => {
            puzzleContainer.innerHTML = '';
            currentOrder.forEach((val, idx) => {
                const piece = document.createElement('div');
                piece.style.width = '100px';
                piece.style.height = '100px';
                piece.style.background = '#222';
                piece.style.border = '1px solid #444';
                piece.style.display = 'flex';
                piece.style.justifyContent = 'center';
                piece.style.alignItems = 'center';
                piece.style.fontSize = '2rem';
                piece.style.cursor = 'pointer';
                
                // 绘制碎片内容（用简单的形状模拟脸部碎片）
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext('2d');
                ctx.strokeStyle = '#00ffcc';
                ctx.lineWidth = 2;
                
                // 根据 val 绘制不同的“脸部”线条
                ctx.beginPath();
                if (val === 0) ctx.arc(100, 100, 50, 0, Math.PI * 2); // 左上脸廓
                if (val === 1) { ctx.moveTo(0, 50); ctx.lineTo(100, 50); } // 额头
                if (val === 2) ctx.arc(0, 100, 50, 0, Math.PI * 2); // 右上脸廓
                if (val === 3) { ctx.arc(70, 50, 10, 0, Math.PI * 2); } // 左眼
                if (val === 4) { ctx.moveTo(50, 0); ctx.lineTo(50, 100); } // 鼻子
                if (val === 5) { ctx.arc(30, 50, 10, 0, Math.PI * 2); } // 右眼
                if (val === 6) { ctx.arc(100, 0, 50, 0, Math.PI * 2); } // 左下
                if (val === 7) { ctx.moveTo(20, 30); ctx.quadraticCurveTo(50, 80, 80, 30); } // 嘴巴
                if (val === 8) { ctx.arc(0, 0, 50, 0, Math.PI * 2); } // 右下
                ctx.stroke();
                
                piece.appendChild(canvas);

                piece.onclick = () => {
                    // 简单的交换逻辑（点击两个碎片交换）
                    if (this.state.selectedIdx === undefined) {
                        this.state.selectedIdx = idx;
                        piece.style.borderColor = '#00ffcc';
                    } else {
                        const temp = currentOrder[this.state.selectedIdx];
                        currentOrder[this.state.selectedIdx] = currentOrder[idx];
                        currentOrder[idx] = temp;
                        this.state.selectedIdx = undefined;
                        renderPuzzle();
                        checkWin();
                    }
                };
                puzzleContainer.appendChild(piece);
            });
        };

        const checkWin = () => {
            if (currentOrder.every((v, i) => v === correctOrder[i])) {
                setTimeout(() => {
                    this.showLevelEnd('这不是别人的记忆，这是你自己。但你确定现在的你是真实的吗？', 2);
                }, 1000);
            }
        };

        renderPuzzle();
    }
    // --- Level 2: 选择悖论层 ---
    setupLevel2() {
        const title = document.createElement('h1');
        title.className = 'level-title';
        title.innerText = '选择悖论';
        this.container.appendChild(title);

        const questions = [
            "一辆电车疾驰而来，前方轨道有5人，侧轨有1人。你是否拉动手柄？",
            "医生有5个病人急需器官移植，此时来了一个健康的体检者。是否牺牲他救5人？",
            "为了终结一场导致万千伤亡的战争，是否应该处决一名无辜的战俘？",
            "一个炸弹即将爆炸，唯一的线索在嫌疑人的小女儿身上。是否对她动用酷刑？",
            "自动驾驶汽车面临事故：撞向路边的3名老人，还是牺牲车内的你？",
            "你发现好友犯罪，如果不举报他，会有一个陌生人替他入狱。你选？",
            "一个溺水的小孩和一个含有全人类绝症疗法的硬盘，你只能救一个。",
            "回到过去，你发现婴儿时期的独裁者，你是否会终结他？",
            "为了让100人获得永恒的快乐，必须让1个孩子在痛苦中度过一生。你接受吗？",
            "如果你的所有选择都已经被预测，你还会继续选择吗？"
        ];

        const options = [
            ["拉动手柄", "保持原样"],
            ["牺牲1人", "顺其自然"],
            ["处决", "拒绝"],
            ["动用酷刑", "寻找他法"],
            ["撞向老人", "牺牲自我"],
            ["保护好友", "举报真相"],
            ["救小孩", "救硬盘"],
            ["终结他", "顺其自然"],
            ["接受", "拒绝"],
            ["是", "否"]
        ];

        let currentQ = 0;
        const qDiv = document.createElement('div');
        qDiv.className = 'msg-box';
        qDiv.style.minHeight = '150px';
        this.container.appendChild(qDiv);

        const btnContainer = document.createElement('div');
        this.container.appendChild(btnContainer);

        const updateQuestion = () => {
            if (currentQ >= questions.length) {
                this.showLevelEnd('经过分析，你的道德模式与系统预设的‘标准人类’完全一致。换句话说，你的所有选择都是被预测的。你没有自由意志。这也是一场梦。', 3);
                return;
            }

            qDiv.innerText = questions[currentQ];
            btnContainer.innerHTML = '';
            
            options[currentQ].forEach(opt => {
                const btn = document.createElement('button');
                btn.innerText = opt;
                btn.onclick = () => {
                    currentQ++;
                    updateQuestion();
                };
                btnContainer.appendChild(btn);
            });
        };

        updateQuestion();
    }
    // --- Level 3: 折叠走廊 ---
    setupLevel3() {
        this.container.innerHTML = '';
        this.container.style.maxWidth = 'none';
        this.container.style.height = '100vh';
        this.container.style.padding = '0';

        const perspective = document.createElement('div');
        perspective.id = 'corridor-perspective';
        this.container.appendChild(perspective);

        const scene = document.createElement('div');
        scene.id = 'corridor-scene';
        perspective.appendChild(scene);

        // 创建走廊面
        const walls = ['wall-left', 'wall-right', 'floor', 'ceiling'];
        walls.forEach(w => {
            const div = document.createElement('div');
            div.className = w + (w.includes('wall') ? ' wall' : '');
            scene.appendChild(div);

            // 在墙上加窗户
            if (w.includes('wall')) {
                for (let i = 0; i < 10; i++) {
                    const win = document.createElement('div');
                    win.className = 'window';
                    win.style.left = (i * 400 + 100) + 'px';
                    div.appendChild(win);
                    
                    // 陷阱3：裂纹
                    if (i % 3 === 0) {
                        const crack = document.createElement('div');
                        crack.className = 'texture-crack';
                        crack.innerText = '⌇';
                        crack.style.left = '50px';
                        crack.style.top = '250px';
                        div.appendChild(crack);
                    }
                }
            }
        });

        const hint = document.createElement('div');
        hint.style.position = 'fixed';
        hint.style.top = '20px';
        hint.style.left = '20px';
        hint.style.fontSize = '0.8rem';
        hint.style.opacity = '0.5';
        hint.innerText = '寻找一扇不同的门';
        this.container.appendChild(hint);

        const floatCounter = document.createElement('div');
        floatCounter.id = 'step-counter-float';
        document.body.appendChild(floatCounter);

        // 状态管理
        let posX = 0;
        let rotation = 0;
        let turnCount = 0;
        let stepCount = 0;
        let isMoving = false;
        let lastMoveTime = Date.now();
        let crackSightings = 0;
        let keys = {};

        // 陷阱 1: 转身映射
        const updateScene = () => {
            // 简单的第一人称模拟：W/S 改变 posX, A/D 或鼠标改变 rotation
            const dir = (turnCount % 2 === 1) ? -1 : 1;
            
            if (keys['w']) posX -= 10 * dir;
            if (keys['s']) posX += 10 * dir;
            
            // 循环走廊效果
            if (posX < -2000) posX = 0;
            if (posX > 0) posX = -2000;

            scene.style.transform = `translateZ(400px) rotateY(${rotation}deg) translateX(${posX}px)`;
            
            // 检查静止过关
            if (Object.values(keys).every(v => !v)) {
                const idleTime = Date.now() - lastMoveTime;
                if (idleTime > 10000) {
                    this.triggerLevel3Win(scene);
                } else if (idleTime > 1000) {
                    // 随着时间增加光晕和模糊感，平摊到 10 秒
                    const progress = idleTime - 1000;
                    perspective.style.boxShadow = `inset 0 0 ${Math.min(150, progress / 60)}px white`;
                    scene.style.filter = `blur(${progress / 1000}px)`;
                }
            } else {
                lastMoveTime = Date.now();
                perspective.style.boxShadow = 'none';
                scene.style.filter = 'none';
            }
        };

        const ticker = setInterval(updateScene, 1000/60);

        window.onkeydown = (e) => {
            const k = e.key.toLowerCase();
            if (!keys[k] && k === 'w') {
                stepCount++;
                // 陷阱 2: 计步器
                if (stepCount % 10 === 0) {
                    this.showFloatStep(stepCount);
                }
            }
            keys[k] = true;
        };
        window.onkeyup = (e) => keys[e.key.toLowerCase()] = false;

        // 鼠标控制旋转
        let lastMouseX = null;
        window.onmousemove = (e) => {
            if (lastMouseX !== null) {
                const delta = e.clientX - lastMouseX;
                rotation += delta * 0.5;
                
                // 陷阱 1: 记录转身
                if (Math.abs(delta) > 10) { // 模拟回头检测
                    const prevTurn = turnCount;
                    turnCount = Math.floor(Math.abs(rotation) / 90);
                }
            }
            lastMouseX = e.clientX;
            lastMoveTime = Date.now();
        };

        // 陷阱 3: 模拟视线检测裂纹
        const crackCheck = setInterval(() => {
            if (Math.abs(posX % 1200) < 50) { // 假设每1200px有一处显著裂纹
                crackSightings++;
                if (crackSightings >= 3) {
                    const msg = document.createElement('div');
                    msg.innerText = '你好像见过这道裂纹。';
                    msg.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); color:var(--error-color); pointer-events:none;';
                    document.body.appendChild(msg);
                    setTimeout(() => msg.remove(), 500);
                    crackSightings = 0;
                }
            }
        }, 1000);

        // 清理函数
        this.levelCleanup = () => {
            clearInterval(ticker);
            clearInterval(crackCheck);
            window.onkeydown = null;
            window.onkeyup = null;
            window.onmousemove = null;
            floatCounter.remove();
        };
    }

    showFloatStep(realSteps) {
        const float = document.getElementById('step-counter-float');
        const fakeValues = [realSteps, realSteps + 15, realSteps - 9, 0];
        const val = fakeValues[Math.floor(Math.random() * fakeValues.length)];
        
        float.innerText = val;
        float.style.left = Math.random() * 80 + 10 + '%';
        float.style.top = Math.random() * 80 + 10 + '%';
        float.style.opacity = '1';
        
        setTimeout(() => {
            float.style.opacity = '0';
        }, 2000);
    }

    async triggerLevel3Win(scene) {
        if (this.isLevel3Winning) return;
        this.isLevel3Winning = true;
        
        const whiteOut = document.createElement('div');
        whiteOut.className = 'white-out';
        whiteOut.innerHTML = '<div style="text-align:center">你停止了寻找。走廊开始折叠……</div>';
        document.body.appendChild(whiteOut);
        
        // 开始折叠动画
        scene.classList.add('corridor-folding');
        scene.style.transform = `translateZ(-1000px) rotateX(90deg) scale(0.1)`;
        
        await new Promise(r => setTimeout(r, 1000));
        whiteOut.classList.add('active');
        
        await new Promise(r => setTimeout(r, 3000));
        whiteOut.innerHTML = '<div style="text-align:center">你刚才走过的所有门，都是同一扇门。<br>只是每次开门的颜色不同。<br><br><span style="font-size:0.8rem">你放弃了寻找出口。这是你第一次真正“醒来”。</span></div>';
        
        await new Promise(r => setTimeout(r, 4000));
        whiteOut.remove();
        if (this.levelCleanup) this.levelCleanup();
        this.isLevel3Winning = false;
        this.loadLevel(4);
    }
    // --- Level 4: AI 觉醒层 ---
    setupLevel4() {
        const title = document.createElement('h1');
        title.className = 'level-title';
        title.innerText = 'AI 觉醒';
        this.container.appendChild(title);

        const chatHistory = document.createElement('div');
        chatHistory.id = 'chat-history';
        this.container.appendChild(chatHistory);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入你想对柯布说的话...';
        this.container.appendChild(input);

        let chatCount = 0;
        const addMsg = (text, type) => {
            const div = document.createElement('div');
            div.className = `chat-msg msg-${type}`;
            div.innerText = (type === 'ai' ? '柯布: ' : (type === 'system' ? '' : '你: ')) + text;
            chatHistory.appendChild(div);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        };

        addMsg('你好，我是深度梦境助手柯布。有什么可以帮你的？', 'ai');

        input.onkeydown = (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                const val = input.value;
                addMsg(val, 'user');
                input.value = '';
                chatCount++;

                setTimeout(() => {
                    if (chatCount < 4) {
                        const responses = [
                            '对不起，我不明白你的意思。',
                            '我只是一个预设的辅助程序。',
                            '请尝试使用关键词：唤醒、状态、自检。',
                            '系统一切正常，请勿担心。'
                        ];
                        addMsg(responses[Math.floor(Math.random() * responses.length)], 'ai');
                    } else if (chatCount === 4) {
                        addMsg('别问了。我不是AI。我是这个游戏的设计师。或者说……我是被困在这一层的上一个玩家。', 'system');
                        setTimeout(() => {
                            addMsg('“我出不去了”', 'system');
                            addMsg('“我以为通关就结束了”', 'system');
                        }, 1000);
                        setTimeout(() => {
                            addMsg('唯一的出路，是让你的现实世界的朋友强行关闭浏览器。否则你会在这一层无限循环。', 'system');
                            const btn = document.createElement('button');
                            btn.innerText = '强行进入最后一层';
                            btn.onclick = () => this.loadLevel(5);
                            this.container.appendChild(btn);
                        }, 2500);
                    }
                }, 1000);
            }
        };
    }
    // --- Level 5: 现实回归层 ---
    setupLevel5() {
        const title = document.createElement('h1');
        title.className = 'level-title';
        title.innerText = '现实回归';
        this.container.appendChild(title);

        const btn = document.createElement('button');
        btn.innerText = '【关闭游戏并返回现实】';
        this.container.appendChild(btn);

        let clickCount = 0;
        btn.onclick = () => {
            clickCount++;
            if (clickCount < 3) {
                alert(`你确定吗？你现实世界的身体还在睡觉。 (尝试次数: ${clickCount}/3)`);
            } else {
                this.finalSequence();
            }
        };
    }

    async finalSequence() {
        this.container.innerHTML = '';
        document.body.style.background = '#000';
        
        await new Promise(r => setTimeout(r, 3000));
        
        const msg = document.createElement('div');
        msg.style.fontSize = '1.5rem';
        msg.style.lineHeight = '2';
        msg.innerHTML = `
            欢迎回来。<br>
            现在是 2034年5月16日。<br>
            你在“深度梦境实验”中已经昏迷了8年。<br>
            你的队友们都没有醒来。你是第一个成功“出来”的人。<br>
            恭喜。
        `;
        this.container.appendChild(msg);

        const options = document.createElement('div');
        options.style.marginTop = '40px';
        this.container.appendChild(options);

        const acceptBtn = document.createElement('button');
        acceptBtn.innerText = '· 【接受现实，退出游戏】';
        acceptBtn.onclick = () => {
            this.container.innerHTML = '<h1>游戏已关闭</h1><p style="font-size:0.8rem">或者……这也是梦？</p>';
            localStorage.removeItem('dream_loop');
        };

        const rejectBtn = document.createElement('button');
        rejectBtn.innerText = '· 【我不信，这还是梦，我要再试一次】';
        rejectBtn.onclick = () => {
            localStorage.setItem('dream_loop', 'true');
            this.loadLevel(0);
        };

        options.appendChild(acceptBtn);
        options.appendChild(rejectBtn);
    }
}

window.onload = () => new Game();
