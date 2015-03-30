(function (window) {
    var win = window,   //全局变量
        Timer = null;   //定时器

    /**
     * @param {function} func 定时器要执行的回调函数。
     * @param {number} time 定时器延迟的时间。
     * @param {boolean} autostart 是否开始执行定时器。
     * @return {Timer} Timer构造函数的实例对象。
     * */
    Timer = function (func, time, autostart) {
        //set主要作用是初始化操作
        this.set = function (func, time, autostart) {
            this.init = true;   //init表示是否是初始化状态.
            //执行这个分支的形式如下: new Timer.set({'autostart':true,'time': 2000});
            if (typeof func == 'object') {
                var paramList = ['autostart', 'time'];
                for (var arg in paramList) {
                    //console.log(arg); 对于数组的迭代输出的是下标号.
                    if (func[paramList[arg]] != undefined) {
                        eval(paramList[arg] + " = func[paramList[arg]]");   //循环赋值
                        //console.log(paramList[arg] + " = func[paramList[arg]]");
                    }
                }

                func = func.action;
            }
            //如果func传入的是个函数,那么赋值给实例对象的action属性.
            if (typeof func == 'function') {
                this.action = func;
            }
            //如果传入的time是个数字,那么赋值给实例对象的intervalTime属性.
            if (!isNaN(time)) {
                this.intervalTime = time;
            }
            //如果设置了要执行定时器,并且当前定时器没有被激活的话，那么立即执行该定时器，并且将激活状态置为true.表示定时器已经被激活了。
            console.log(autostart);
            if (autostart && !this.isActive) {
                //console.log("active...");
                this.isActive = true;
                this.setTimer();
            }
            //返回定时器的实例对象.
            return this;
        };

        /**
         * 该函数的作用是只执行一次定时器,
         * @param time 执行所需的时间.
         * */
        this.once = function (time) {
            var timer = this;
            if (isNaN(time)) {
                time = 0;
            }
            window.setTimeout(function () {
                timer.action();
            }, time);
            return this;
        };
        /**
         * 该函数的作用是启动定时器,让其继续执行.
         * @param reset 是否重置定时器.
         * */
        this.play = function (reset) {
            //如果当前定时器处于非激活状态.
            if (!this.isActive) {
                if (reset) {
                    this.setTimer();
                }
                else {
                    this.setTimer(this.remaining);
                }
                this.isActive = true;
            }
            return this;
        };
        /**
         * 该函数的作用是暂停定时器.
         * */
        this.pause = function () {
            //如果定时器处于激活状态.
            if (this.isActive) {
                this.isActive = false;
                this.remaining -= (new Date() - this.last); //暂停后,到执行下一个定时器所剩下的时间.
                this.clearTimer();
            }
            return this;
        };
        /**
         * 该函数的作用是停止定时器.所有参数恢复到初始化状态.
         * */
        this.stop = function () {
            this.isActive = false;
            this.remaining = this.intervalTime;
            this.clearTimer();
            return this;
        };
        /**
         * 该函数的作用是提供一个开关，用来控制定时器的执行和停止.
         * @pram reset 表示是否重置该定时器.
         * */
        this.toggle = function (reset) {
            if (this.isActive) {
                this.pause();
            }
            else if (reset) {
                this.play(true);
            }
            else {
                this.play();
            }
            return this;
        };
        /**
         * 重置定时器.
         * */
        this.reset = function () {
            this.isActive = false;
            this.play(true);
            return this;
        };
        /**
         * 清除定时器.
         * */
        this.clearTimer = function () {
            window.clearTimeout(this.timeoutObject);
        };
        /**
         * 设置定时器,核心函数.
         * @param time 定时器执行所需的时间.
         * */
        this.setTimer = function (time) {
            var timer = this;
            if (typeof this.action != 'function') {
                return;
            }
            if (isNaN(time)) {
                time = this.intervalTime;
            }
            this.remaining = time;
            this.last = new Date();
            this.clearTimer();
            //定时器的句柄
            this.timeoutObject = window.setTimeout(function () {
                timer.go();
            }, time);
        };
        /**
         * 该函数的作用是执行定时器,私有函数.
         * */
        this.go = function () {
            if (this.isActive) {
                try {
                    this.action();
                }
                finally {
                    this.setTimer();
                }
            }
        };

        if (this.init) {
            return new Timer(func, time, autostart);
        } else {
            return this.set(func, time, autostart);
            //return this;
        }

    };

    win.Timer = Timer;  //把定时器暴露给全局变量
})(window);