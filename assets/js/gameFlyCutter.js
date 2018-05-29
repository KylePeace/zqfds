
cc.Class({
    extends: cc.Component,

    properties: {
        // 暂存 Game 对象的引用,由于在星星生成时，将game组件作为属性传入，所以代表的是game组件
        game: {
            default: null,
            serializable: false
        },
        // 暂存 target 对象引用
        target:{
            default:null,
            serializable: false
        },
        // 预制撞击击飞粒子资源
        liZi:{
            default:null,
            type:cc.Prefab,
        },
        // 通过一关时的声音
        audio2:{
            url:cc.AudioClip,
            default:null
        },
        // 飞刀撞到西瓜时的声音
        audio1:{
            url:cc.AudioClip,
            default:null
        },
        // 飞刀撞到飞刀后掉下来时的音效
        audio3:{
            url:cc.AudioClip,
            default:null
        },
    },
    onLoad () {

        // 获得碰撞检测系统
        var colliderManager = cc.director.getCollisionManager();
        // 碰撞检测系统默认是禁用的，需要自行开启
        colliderManager.enabled = true;
        // // debug绘制默认禁用，需要自行开启
        // colliderManager.enabledDebugDraw = true;
        // // 显示碰撞组件的包围盒
        // colliderManager.enabledDrawBoundingBox = true;
    },

    // 碰撞检测
    // 当碰撞产生时调用
    onCollisionEnter(other,self){
        // console.log(self);
        // console.log(other);
        let otherNodeGroup = other.node.group;
        // console.log(otherNodeGroup);
        if(otherNodeGroup == 'flyCutterEnd' && self.node.y<-56){
            // 使用下列方式不行
            // // 判断是否已经触碰过了西瓜，如果是，则即使触碰到飞刀也不再激活-有可能在插入后触碰到飞刀
            // if(self.node.y>-56){
            //     console.log('已经插入西瓜，不再进行飞刀之间的碰撞处理');
            //     return;
            // }
            // console.log('撞到了飞刀');
            // console.log(otherNodeGroup);
            // 撞上飞刀时的处理函数
            this.colliderFlyCutter(self);
            return;
        }
        // 如果other时target，则将self的父节点改成target
        if(otherNodeGroup == 'target'){
            // console.log('撞到了西瓜');
            // console.log(otherNodeGroup);
            // 产生击飞粒子
            this.createColliderLizi();
            // 撞上西瓜时的处理函数
            this.colliderTarget(other);
            return;
        }
        
    },

    // 当飞刀成功插入到西瓜上时，生成下一把飞刀-如果还有
    setNextFlyCutter(){
        // 
        let game = this.game;
        if(game.flyCutterAllNum > game.useFlyCutterNum){
            game.createFlyCutter();
        }else{
            this.scheduleOnce(()=>{
                // 通过一关时的播放声音
            cc.audioEngine.play(this.audio2,false,1);
            },0.1);

            // 0.2S后开启下一关
            this.scheduleOnce(()=>{
                this.getNextStep();
            },0.4);
            
        }
    },

    // 通过一关后生成下一关
    getNextStep(){
        let game = this.game;
        // 重置飞刀数
        game.gameInit();
        // 将插在target上的飞刀全部清除
        this.target.removeAllChildren();
        // 生成一飞刀
        game.createFlyCutter();

    },

    // 党费到碰触到西瓜时的处理函数
    colliderTarget(other){
        // 保存节点
        let newNode = this.node;
        // 然后去除原先的飞刀
        this.node.removeFromParent();
        // 生成下一个飞刀
        this.setNextFlyCutter();
        // 分数加1然后显示出来
        this.game.score++;
        this.game.showScore();
        // 播放撞击声音
        cc.audioEngine.play(this.audio1,false,1);

        // 获得target旋转参数
        let rotation = other.node.rotation;
        // 将角度转换为弧度
        let rotation1 = rotation*2*Math.PI/360;
        let px = 60*Math.sin(rotation1); //53
        let py = 60*-Math.cos(rotation1);    //-30;
        // 删除节点上的动画组件和碰撞组件
        newNode.removeComponent(cc.Animation);
        // 将当前飞刀的组更改
        newNode.group = 'flyCutterEnd';
        // 将生成的飞刀放到当前游戏中
        this.target.addChild(newNode);
        // 让飞刀的层级变低,即会被同级覆盖
        newNode.setLocalZOrder(-2);
        newNode.y = py;   //y轴距离
        newNode.x = px;
        newNode.rotation = -rotation;
        // console.log('西瓜上的飞刀：');
        // console.log(newNode);
    },

    // 当飞刀碰到飞刀时的处理函数
    colliderFlyCutter(){
        // 获得画布的高度
        let cH = this.game.node.height;
        // 不再产生飞刀，设置已用飞刀为最大值即可
        this.game.useFlyCutterNum = this.game.flyCutterAllNum; 
        // 删除碰撞组件
        this.node.removeComponent(cc.PolygonCollider);
        
        // 开启掉下来的动画
        // 1.让飞镖上升到触碰西瓜，
        // this.node.runAction(cc.moveTo(0.1,0,-60));
        // 2.发出碰撞的声音
        cc.audioEngine.play(this.audio1,false,1);
        // 3.发出撞击飞刀的声音和掉下来的动作同时进行
        cc.audioEngine.play(this.audio3,false,1)
        // 只对发起碰撞的飞刀进行处理,不对被碰撞的飞刀处理
        if(this.node.group == 'flyCutter'){
            // 将锚点改到中心点
            this.node.anchorX = 0.5;
            this.node.anchorY = 0.5;
            let spawn = cc.spawn(   
            // cc.audioEngine.play(this.audio3,false,1),   //撞击飞刀的声音
            cc.moveBy(1,30,-cH/2-100),    //掉下来的距离
            cc.rotateBy(2,400),  //掉下来的旋转角度
            // cc.fadeOut(),   //渐隐效果
            );
            this.node.runAction(spawn);
        }
        // 4.删除该节点
        console.log('游戏结束');
    },
    // 撞到西瓜时的产生粒子函数
    createColliderLizi(){
    	// console.log('生成撞击粒子');
    	// 用预制粒子资源生成节点
    	let lizi = cc.instantiate(this.liZi);
    	// 将粒子节点放到game节点下
    	this.game.node.addChild(lizi);
    	// 生成的位置
    	lizi.x = 0;
    	lizi.y = -56;
    	// 生成随机数
    	let ranNum = Math.ceil(Math.random()*3);
    	// console.log(ranNum);
    	// 激活抛物线动画
    	let anim = lizi.getComponent(cc.Animation);
    	anim.play('liziR'+ranNum);

    	// this.liziRun(lizi);
    },
    // 粒子运动轨迹
    liziRun(lizi){
    	// 设置重力加速度
    	let gH = this.game.node.height;
    	// let action = cc.moveBy(2,100,-gH/2+10);
    	// action.easing(cc.easeCircleActionIn());
    	// let action = cc.spawn(
    	// 	cc.moveBy(1.5,100,0),
    	// 	cc.moveBy(2,100,-gH/2+10)
    	// 	); [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)]
    	let action = cc.bezierBy(2,[cc.p(0,-56), cc.p(200, -400), cc.p(300, -700)]);
    	lizi.runAction(action);
    },

    start () {

    },

    update (dt) {
    },

});
