
cc.Class({
    extends: cc.Component,

    properties: {
        // 预制飞刀资源
        flyCutter:{
            default:null,
            type:cc.Prefab,
        },
        // 飞刀撞到西瓜时的声音
        audio1:{
            url:cc.AudioClip,
            default:null
        },
        // 西瓜旋转速度改变时的减速度
        speedChange:0.1, 
        
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

        //获得当前动画状态对象
        this.anim = this.node.getComponent(cc.Animation);

    },


    // 碰撞检测
    // 当碰撞产生时调用
    onCollisionEnter(other,self){
        // console.log('西瓜产生振动');
        // 西瓜产生振动
        var seq = cc.sequence(cc.moveBy(0.02, 0,20), cc.moveBy(0.02, 0, -20));
        this.node.runAction(seq);
    },

    start () {

    },

    update (dt) {
        // console.log(dt);
        // 不断获取随机数
        // let ran = Math.random();
        // // 如果
        // if(ran>0.9){
        //     // 进行减速
        //    let speed = this.anim._nameToState.gameTarget.speed;

        // }


    },
    // 当碰撞发生时，

});
