var fbPhotosInfScroll = (function() {
    var url = 'https://graph.facebook.com/v2.5/me/photos?access_token=';
    var accessToken, imgWidth, containerEl;
    var inProcess = false;
    function render(response) {
        var list = response.data;
		console.log(list);
        for (var i = 0; i < list.length;i++) {
            var img_el = document.createElement('img');
			console.log(list[i].picture);
            img_el.setAttribute('src', list[i].picture);
			console.log(list[i].id);
			img_el.setAttribute('alt', list[i].id)
            containerEl.appendChild(img_el);
        }
        console.log(response.paging);
        url = response.paging.next || null;
        inProcess = false;
    }

    function sendRequest() {
        if (url === null) {
            var el = document.createElement('div');
            el.innerHTML = 'You have seen all your photos! Thank you!';
            containerEl.appendChild(el);
            return;
        }
        var xmlobj = new XMLHttpRequest();
        xmlobj.open('GET',url,true);
        xmlobj.responseType = 'json';
        inProcess = true;
        xmlobj.onreadystatechange = function() {
            if (this.readyState == 4) {
                render(this.response);
            }
        }
        xmlobj.send();
    }

    function onScroll() {
        if (window.scrollY + window.innerHeight >= document.documentElement.offsetHeight && inProcess === false) {
            sendRequest();
        }
    }

    return {
        init : function(config) {
            if (config.access_token === undefined || config.id === undefined) {
                console.log("Please provide access_token and id of the conatiner");
                return;
            }
            containerEl = document.getElementById(config.id);
            if (!containerEl) {
                console.log('Container Element is not present');
                return;
            }
            accessToken = config.access_token;
            imgWidth = config.image_width || 200;
            url = url+accessToken+"&fields=id,name,picture";
			console.log(url);
            sendRequest();
            window.addEventListener('scroll', onScroll);
        }
    };
})();
