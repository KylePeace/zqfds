
cc.Class({
    extends: cc.Component,

    properties: {
        // 按钮节点
        btn:{
            default:null,
            type:cc.Node
        },
        // label分享群节点
        share:{
            default:null,
            type:cc.Node,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 添加群分享显示信息
        // wx.showShareMenu({
        //     withShareTicket:true,
        // })

        // 创建关于btn点击的动画
        this.btnAnim = this.btn.getComponent(cc.Animation);

        // 监听群分享
        this.shareGroup();
    },

    start () {

    },

    // 开始游戏按钮点击事件
    toGameScene(){
        // console.log('跳转到游戏页面');
        // 执行动画
        // this.btnAnim.play();
        //
        // // 动画200ms，之后跳转场景，使用了计时器
        // this.scheduleOnce(()=>{
            // 场景切换动画
            // this.node.runAction(cc.fadeOut(2.0));
            // this.node.runAction(cc.moveBy(2,cc.p(-640,0)));
            cc.director.loadScene('game');
        // },0.4);
    },
    // 群分享
    shareGroup(){
        /*// 点击监听事件,微信小游戏中无法监听到cocos的鼠标事件
        this.share.on('mouseup',()=>{
            console.log('点击松开时');
            // 微信分享--主动拉起的转发
            wx.shareAppMessage({
                title:'来自按钮的转发',
                success:(res)=>{
                    console.log('转发成功：');
                    console.log(res);
                }
            })
        });

        // 使用触摸事件,微信小游戏可用
        this.share.on('touchend',()=>{
            console.log('触摸松开时');
            // 微信分享--主动拉起的转发
            wx.shareAppMessage({
                title:'来自按钮的转发',
                success:(res)=>{
                    console.log('转发成功：');
                    console.log(res);
                }
            })
        });*/
    }

    // update (dt) {},
});
