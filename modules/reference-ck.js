/*globals javascripture, bible, worker*/javascripture.modules.reference={load:function(e){var t=this,n=e.book,r=e.chapter,i=e.verse;"undefined"==typeof i&&(e.verse=1);e.rightVersion=$("#versionSelectorRight").val();if(e.rightVersion==="original"){e.rightVersion="kjv";localStorage.rightVersion&&(e.rightVersion=localStorage.rightVersion)}e.leftVersion=$("#versionSelectorLeft").val();if(e.leftVersion==="original"){e.leftVersion="kjv";localStorage.leftVersion&&(e.leftVersion=localStorage.leftVersion)}worker.postMessage({task:"reference",parameters:e});return this},scrollToVerse:function(e,t){undefined===t&&(t=0);$(document).scrollTop(0);t-=$("#dock").height();$("html").hasClass("reading-mode")&&(t-=50);e.length>0&&$(document).scrollTo(e,{offset:t});$(document).trigger("createWayPoint")},getAnchoringData:function(e){var t="#current",n=0,r=$(document).scrollTop(),i;if(e){e==="prev"&&(i=$(".reference:first-child ol.wrapper li:first-child"));e==="next"&&(i=$(".reference:last-child ol.wrapper li:last-child"));t="#"+i.attr("id");n=r-i.offset().top+$("#dock").height()}return[n,t]},anchorReference:function(e){var t=e[1],n=e[0],r=$(t),i;t===".current-verse"&&(i=r.height(),n=-$(window).height()/2+i);if(r.length===0){r=$("#"+e.currentId);n=-$("[data-role=header]").height()}this.scrollToVerse(r,n)},getReferenceFromCurrentUrl:function(){return this.getReferenceFromUrl(window.location.hash)},getReferenceFromUrl:function(e){var t=e.split("&"),n={};if(t.length>1){n.book=t[0].split("=")[1],n.chapter=parseInt(t[1].split("=")[1],10),n.verse=1;t[2]&&(n.verse=parseInt(t[2].split("=")[1],10))}return n},loadReferenceFromHash:function(){var e=window.location.hash;if(e.indexOf("search")>-1){var t=e.split("=")[1];setTimeout(function(){createSearchReferencesPanel({lemma:t})})}else if(e.indexOf("reference")>-1){var n=this.getReferenceFromHash();localStorage&&(localStorage.reference=JSON.stringify(n));n.anchoringData=javascripture.modules.reference.getAnchoringData(null);javascripture.modules.reference.load(n)}},getReferenceFromHash:function(){var e=window.location.hash.split("=")[1].split(":"),t=e[0],n=parseInt(e[1],10),r=1;e[2]&&(r=parseInt(e[2],10));return{book:t,chapter:n,verse:r}},createReferenceLink:function(e){return"reference="+e.book+":"+e.chapter+":"+e.verse},getChapterText:function(e,t,n){var r=this,i=e.book,s=e.chapter,o=e.verse,u=s-1,a=o-1,f=!1,l='<div class="reference frequencyAnalysis" data-book="'+i+'" data-chapter="'+s+'"><h1>'+i+" "+s+"</h1>";l+='<ol class="wrapper">';t&&t.right&&t.right.forEach(function(o,u){l+='<li id="'+i.replace(/ /gi,"_")+"_"+s+"_"+(u+1)+'"';u===a&&(l+=' class="current"');l+='data-verse="'+(u+1)+'">';l+='<div class="wrapper"';u===a&&(l+=' id="current"');if(u===a-5){l+=' id="context"';f=!0}l+=">";l+='<div class="english">';e.rightVersion==="lc"?t.left[u].forEach(function(t,i){t&&(l+=r.createWordString(t,"english",n,e.rightVersion))}):t.right[u].forEach(function(t,i){t&&(l+=r.createWordString(t,"english",n,e.rightVersion))});l+="</div>";if(t.left[u]){l+="<div class='original "+n+"'>";t.left[u].forEach(function(e,t){e&&(l+=r.createWordString(e,n,n))});l+="</div>"}l+="</div>";l+="</li>"});l+="</ol>";l+="</div>";return l},createWordString:function(e,t,n,r){var i=this,s="",o=[];if(typeof e[1]=="undefined")return"<span>"+e[0]+"</span> ";lemma=e[1];if(lemma){lemmaArray=lemma.split(" ");lemmaArray.forEach(function(e,t){o.push(javascripture.api.word.getFamily(e))})}s+="<span";s+=' class="'+o.join(" ")+"-family "+lemma+'"';s+=' title="'+lemma;e[2]&&(s+=" "+e[2]);s+='"';s+=' data-word="'+e[0]+'"';s+=' data-lemma="'+e[1]+'"';s+=' data-language="'+n+'"';s+=' data-range="verse"';s+=' data-family="'+o.join(" ")+'"';e[2]&&(s+=' data-morph="'+e[2]+'"');s+=">";r==="lc"&&t==="english"?s+=javascripture.modules.translateLiterally.getWord(e):s+=e[0];s+="</span> ";return s}};(function(e){var t=javascripture.data.english;e.fn.scrollStopped=function(t){e(this).scroll(function(){var n=this,r=e(n);r.data("scrollTimeout")&&clearTimeout(r.data("scrollTimeout"));r.data("scrollTimeout",setTimeout(t,250,n))})};javascripture.modules.reference.loadReferenceFromHash();e(window).bind("hashchange",function(){var e=new Date;javascripture.modules.reference.loadReferenceFromHash();var t=new Date;timer(e,t)});e(window).scrollStopped(function(){var t=e(document).scrollTop(),n=e(".referencePanel").height()-e(window).height(),r;if(t<=0){var i=e(".three-references").data("prev");if(i){i.anchoringData=javascripture.modules.reference.getAnchoringData("prev");javascripture.modules.reference.load(i)}}if(t>=n){var s=e(".three-references").data("next");if(s){s.anchoringData=javascripture.modules.reference.getAnchoringData("next");javascripture.modules.reference.load(s)}}});e(".goToReference").submit(function(t){t.preventDefault();var n=bible.parseReference(e("#goToReference").val()),r="book="+bible.Data.books[n.bookID-1][0]+"&chapter="+n.chapter+"&verse="+n.verse;window.location.hash=r;e(this).closest(".popup").popup("close");e("#goToReference").blur();e("html").hasClass("reading-mode")&&hideDock();return!1});worker.addEventListener("message",function(t){if(t.data.task==="reference"){var n=t.data.result.reference;console.log(n);var r='<div class="three-references"';t.data.result.prev&&(r+=" data-prev='"+JSON.stringify(t.data.result.prev)+"'");t.data.result.next&&(r+=" data-next='"+JSON.stringify(t.data.result.next)+"'");r+=">";if(t.data.result.prev){r+=javascripture.modules.reference.getChapterText(t.data.result.prev,t.data.result.chapters[0],t.data.result.testament);r+=javascripture.modules.reference.getChapterText(n,t.data.result.chapters[1],t.data.result.testament);t.data.result.next&&(r+=javascripture.modules.reference.getChapterText(t.data.result.next,t.data.result.chapters[2],t.data.result.testament))}else{r+=javascripture.modules.reference.getChapterText(n,t.data.result.chapters[0],t.data.result.testament);t.data.result.next&&(r+=javascripture.modules.reference.getChapterText(t.data.result.next,t.data.result.chapters[1],t.data.result.testament))}r+="</div>";e("#verse").html(r);var i=n.book;typeof n.chapter!="undefined"&&(i+=" "+n.chapter);typeof n.verse!="undefined"&&(i+=":"+n.verse);e("head title").text(i);e.fn.waypoint&&e(".reference").waypoint("destroy");javascripture.modules.reference.anchorReference(t.data.parameters.anchoringData);maintainState(n)}});worker.addEventListener("message",function(t){t.data.task==="loading"&&e(".loading").html(t.data.html)})})(jQuery);