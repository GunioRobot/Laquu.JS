/**
 * ピックメニュープラグイン
 *
 * オプション
 *   showSize: 画像が大きい時のサイズ
 *   hideSize: 画像が小さい時のサイズ
 *   speed: 画像の拡大・縮小時のアニメーション速度
 *   duration: 自動スクロール時のインターバル
 *   easing: イージング（jQuery.easingプラグインが必要）
 *   auto: 自動アニメーションの指定
 *   isVertical: 縦もしくは横スライドの指定
 *   current: 初期表示画像の指定
 */
(function($l){
    var defaults = {
        showSize: 240,
        hideSize: 90,
        speed: 400,
        duration: 2000,
        easing: "swing",
        auto: false,
        isVertical: false,
        current: 0
    };

    $l.fn.picMenu = function(settings) {
        return this.each(function(){
            var o = $l.extend({}, defaults, settings || {}),
                self = $l(this), items = null, current = 0;

            function startTimer() {
                timer = setInterval(function(){
                    autoRotate();
                }, o.duration + o.speed);
            }

            function stopTimer() {
                clearInterval(timer);
                timer = null;
            }

            function autoRotate() {
                if(current >= items.size()) {
                    current = 0;
                }

                var prev = (current === 0) ? items.size() : current;
                $l(items.get(current)).trigger("mouseover");
                $l(items.get(prev - 1)).trigger("mouseout");
                ++current;
            }

            function showImage(ev) {
	            items.not(ev.currentTarget).trigger("mouseout");
                $l(this).addClass("active").stop().animate( o.isVertical ? { height: o.showSize }: { width: o.showSize }, {
                    easing: o.easing,
                    queue: false,
                    duration: o.speed,
                    complete: o.complete
                });
            }

            function hideImage(ev) {
                $l(this).removeClass("active").stop().animate( o.isVertical ? { height: o.hideSize }: { width: o.hideSize }, {
                    easing: o.easing,
                    queue: false,
                    duration: o.speed - 100,
                    complete: o.complete
                });
            }

            items = self.find("a").css("overflow", "hidden");
            items.bind("mouseover", showImage).bind("mouseout", hideImage);
            items.trigger("mouseout");

            if(o.auto) {
                startTimer();
                self.find("img").bind("mouseover", stopTimer).bind("mouseout", startTimer)
            }
			else if (o.current >= 1 && items.size() > 1) {
				o.current = (o.current > items.size() ? items.size(): o.current);
				$l(items.get(o.current - 1)).trigger("mouseover");
			}
        });
    };
})(laquu);