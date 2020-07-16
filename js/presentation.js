//
var ball;

//jQuery Entry

$(function(){

    // 기요미 진석 초기화
        ball = new floatingBall('#floating_ball');
        $('#floating_ball').on('mouseenter',function(){
            ball.flag= false;
        })
        $('#floating_ball').on('mouseleave',function(){
            ball.flag= true;
        })
    //Interval
        ball.timer = setInterval(function(){
            if(ball.flag === true){
                ball.move();
            }
        }, 12);
    //resize Event
        $(window).on('resize',function(){
            ball.vwMax = $(window).width() * (65 /100);
            ball.vhMax = $(window).height();
        })

    //슬라이드 초기화
        var slide = new slideObj('ul.section_lists');
        slide.reset();
        $('ul.section_lists').children().eq(slide.slideNow).addClass('show');
    
    //스파이스크롤 초기화
        addSpyScroll(slide);

    //.main-nav .onclick
        $('.main_nav > ul > li > a').on('click',function(){
            var index = $(this).parent().index();
            slide.slideBefore = slide.slideNow;
            slide.go(index);
            slide.flag = false;
            $('.main_nav > ul > li').removeClass('on');

            $('ul.section_lists').children().eq(slide.slideNow).addClass('show').removeClass('wait');
            $('ul.section_lists').children().eq(slide.slideBefore).addClass('hide').removeClass('show').one('transitionend', function(){
                $(this).attr({'class' : ''}).addClass('wait');
                slide.flag = true;
                $('.main_nav > ul > li').eq(slide.slideNow).addClass('on')
            });

            clearInterval(ball.timer);
            if(slide.slideNow === 0){
                ball.timer = setInterval(function(){
                    if(ball.flag === true){
                        ball.move();
                    }
                }, 12);
            }
        });
        
        //video .onclick
            $('video').on('click', function(e){
                e.stopPropagation();
                $(this).toggleClass('on');
                $('img').toggleClass('off');
            })
})

//floatingBall Obj
function floatingBall(selector){

    this.flag = true;
    this.coordX = $(selector).position().left;
    this.coordY = $(selector).position().top;
    this.vwMax = $(window).width() * (65 /100);
    this.vhMax = $(window).height();
    this.x_direction = 1;
    this.y_direction = -1;
    this.diffX = Math.ceil(Math.random() * 3);
    this.diffY = Math.ceil(Math.random() * 3);
    this.timer = null;


    this.move = function(){

        if(this.coordX <= 0){
            this.x_direction = 1;
            this.diffX = Math.ceil(Math.random() * 3);
            this.coordX = this.x_direction * this.diffX + this.coordX;
        }else if(this.coordX >= this.vwMax){
            this.x_direction = -1;
            this.diffX = Math.ceil(Math.random() * 3);
            this.coordX = this.x_direction * this.diffX + this.coordX;
        }else{
            this.coordX = this.x_direction * this.diffX + this.coordX;
        }

        if(this.coordY <= 0){
            this.y_direction = 1;
            this.diffY = Math.ceil(Math.random() * 3);
            this.coordY = this.y_direction * this.diffY + this.coordY;
        }else if(this.coordY >= this.vhMax){
            this.y_direction = -1;
            this.diffY = Math.ceil(Math.random() * 3);
            this.coordY = this.y_direction * this.diffY + this.coordY;
        }else{
            this.coordY = this.y_direction * this.diffY + this.coordY;
        }

        $(selector).css({
            'top' : this.coordY + 'px',
            'left' : this.coordX + 'px'
        })
    }
}

//slideObj
function slideObj(selector){

    this.selector = selector;
    this.slideNow = 0;
    this.slideNext = 0;
    this.slidePrev = 0;
    this.slideBefore = 0;
    this.slideNum = $(selector).children().length;
    this.flag = true;

    this.reset = function(){
        if(this.slideNow === 0){
            this.slideNext = 1;
            this.slidePrev = this.slideNum - 1;
        }else if(this.slideNow === (this.slideNum - 1)){
            this.slideNext = 0;
            this.slidePrev = this.slideNow - 1;
        }else{
            this.slidePrev = this.slideNow - 1;
            this.slideNext = this.slideNow + 1;
        }
    }

    this.next = function(){
        if(this.flag===true){
            this.slideNow = this.slideNext;
            this.reset();
        }
    }

    this.prev = function(){
        if(this.flag === true)
        {
            this.slideNow = this.slidePrev;
            this.reset();
        }  
    }

    this.go = function(n){
        if(this.flag === true)
        {
            this.slideNow = n;
            this.reset();
        }
    }
}

//spyScroll Obj
var addSpyScroll = function(slide){
    this.eventScroll = ('onmousewheel' in window) ? 'mousewheel' : 'DOMMouseScroll';
    this.delta = 0;

    window.addEventListener(this.eventScroll, function(e){
        e.preventDefault();
        if(this.eventScroll === 'mousewheel'){
            delta = e.wheelDelta / -120;
        }else{
            delta = e.detail / 3;
        }
        console.log(slide.flag)

        if(delta > 0 && slide.flag === true){  

            clearInterval(ball.timer);

            $('.main_nav > ul > li').removeClass('on')
            //페럴렉스 NEXT
            slide.slideBefore = slide.slideNow;
            slide.next();
            slide.flag = false;

            $('ul.section_lists').children().eq(slide.slideNow).addClass('show').removeClass('wait');
            $('ul.section_lists').children().eq(slide.slideBefore).addClass('hide').removeClass('show').one('transitionend', function(){
                $(this).attr({'class' : ''}).addClass('wait');
                $('.main_nav > ul > li').eq(slide.slideNow).addClass('on')
                slide.flag = true;
            });

            
        

            if(slide.slideNow === 0){
                ball.timer = setInterval(function(){
                    if(ball.flag === true){
                        ball.move();
                    }
                }, 12);
            }
        }else if(delta < 0 && slide.flag === true){ 
            clearInterval(ball.timer);

            $('.main_nav > ul > li').removeClass('on')

            //페럴렉스 PREV
            slide.slideBefore = slide.slideNow;
            slide.prev();
            slide.flag = false;

            $('ul.section_lists').children().eq(slide.slideNow).addClass('show').removeClass('wait');
            $('ul.section_lists').children().eq(slide.slideBefore).addClass('hide').removeClass('show').one('transitionend', function(){
                $(this).attr({'class' : ''}).addClass('wait');
                $('.main_nav > ul > li').eq(slide.slideNow).addClass('on')
                slide.flag = true;    
            });

            if(slide.slideNow === 0){
                ball.timer = setInterval(function(){
                    if(ball.flag === true){
                        ball.move();
                    }
                }, 12);
            }
        }
    }, {passive : false})
}

    