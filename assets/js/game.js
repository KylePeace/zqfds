
cc.Class({
    extends: cc.Component,

    properties: {
        // 预制飞刀资源
        flyCutter:{
            default:null,
            type:cc.Prefab,
        },
        // 预制撞击击飞粒子资源
        lizi:{
            default:null,
            type:cc.Prefab,
        },
        // target节点
        target:{
            default:null,
            type:cc.Node,
        },

        // 头部分数显示
        topLabel:{
            default:null,
            type:cc.Label,
        },

        // 底部飞刀数显示
        bomLabel:{
            default:null,
            type:cc.Label,
        },
        // 得分
        score:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 场景切换动画
        this.node.runAction(cc.fadeIn(2.0));
        //  // 游戏初始化
        this.gameInit();
        // 生成飞刀
        this.createFlyCutter();

        // 监听game节点点击事件
        this.onClickGame();
    },

    start () {

    },
    // 生成飞刀
    createFlyCutter(){
        // 从Prefab中实例化出飞刀节点
        var newFlyCutter = cc.instantiate(this.flyCutter);
        // 将生成的飞刀放到当前游戏中
        this.node.addChild(newFlyCutter);
        // 让飞刀的层级变低,即会被同级覆盖
        // newFlyCutter.setLocalZOrder(-1);
        // 创建的同时，将game对象传入gameFlyCutter.js中
        newFlyCutter.getComponent('gameFlyCutter').game = this;
        // 将target对象传入
        newFlyCutter.getComponent('gameFlyCutter').target = this.target;
        // 获得飞刀的动画组件
        this.flyCutterAnim = newFlyCutter.getComponent(cc.Animation);
    },
    // 游戏初始化
    gameInit(){
        // 飞刀总数,使用随机数生成飞刀总数，在4~9
        this.flyCutterAllNum = Math.floor(Math.random()*6)+4;
        // 已用飞刀数目
        this.useFlyCutterNum = 0;
        this.showBomLabel();
    },
    // 监听游戏节点点击事件
    onClickGame(){
        // 使用触摸监听
        this.node.on('touchstart',(res)=>{
            // 激活飞刀的动画
            // 判断是否还有未发出的飞刀
            if(this.useFlyCutterNum >= this.flyCutterAllNum){
                return;
            }
            // 已用飞刀数+1，总飞刀数不变
            this.useFlyCutterNum++;
            this.flyCutterAnim.play();
            this.showBomLabel();
        })
    },
    // 对下方飞刀数进行显示
    showBomLabel(){
        this.bomLabel.string = this.useFlyCutterNum+' / '+this.flyCutterAllNum;
    },
    // 上方分数显示
    showScore(){
        this.topLabel.string = this.score;
    },

    update (dt) {

    },
});