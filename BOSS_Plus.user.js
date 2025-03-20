// ==UserScript==
// @name         BOSS Plus
// @namespace    https://www.boss.tu-dortmund.de/
// @version      1.0
// @description  Enables filtering in BOSS.
// @author       Lukas Lerche <lukas.lerche@tu-dortmund.de>
// @match        https://www.boss.tu-dortmund.de/*
// @match        https://www2.zul.tu-dortmund.de/*
// @updateURL    https://raw.githubusercontent.com/lukaslerche/bossplus/main/BOSS_Plus.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukaslerche/bossplus/main/BOSS_Plus.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to insert element after another element
    function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }

    // Filter array for unique values
    function unique(arr) {
        var u = {}, a = [];
        for(var i = 0, l = arr.length; i < l; ++i){
            if(!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }

    // Filter button click handler
    function bossPlusButtonClick() {
        var e = document.getElementById("plusNames");
        var strNames = e.options[e.selectedIndex].value;
        var e2 = document.getElementById("plusDates");
        var strDates = e2.options[e2.selectedIndex].value;

        var liArray = document.getElementsByTagName("li");
        
        for (var i = 0; i < liArray.length; i++) { 
            var li = liArray[i];
            if(li.innerHTML.indexOf("<li>") == -1
               && (li.innerHTML.indexOf("Datum:") != -1 || li.innerHTML.indexOf("(kein Prüfungsdatum)") != -1)) {
                
                var einblenden = 0;
                if (strDates == "all" || li.innerHTML.indexOf(strDates) != -1){
                    if(strNames == "all" || li.innerHTML.indexOf(strNames) != -1){
                        einblenden = 1;
                    }
                }
                
                if (einblenden){
                    li.style.display = "list-item";
                } else {
                    li.style.display = "none";
                }
            }
        }
    }

    // Main initialization function
    function initBossPlus() {
        // Checking page title
        var titleArray = document.getElementsByTagName("h1");

        if (titleArray.length == 1) { // we might be on the right page
            var pageTitle = titleArray[0].innerHTML;
            if (pageTitle == "Prüfungsansicht" ||
                pageTitle == "Notenverbuchung" ||
                pageTitle == "Leistungsverbuchung") { // we are on the right page
                
                var theDivider = document.getElementsByTagName("hr")[0];
                var filterDiv = document.createElement('div');
                var selectDate = document.createElement('select');
                var selectName = document.createElement('select');
                selectDate.setAttribute("id","plusDates");
                selectName.setAttribute("id","plusNames");
                
                var allDates = document.createElement('option');
                allDates.innerHTML = "(beliebiger Tag)";
                allDates.setAttribute("value","all");
                
                selectDate.appendChild(allDates);
                
                var allNames = document.createElement('option');
                allNames.innerHTML = "(beliebiger Prüfer)";
                allNames.setAttribute("value","all");
                
                selectName.appendChild(allNames);
                
                // all the li-elements of a page
                var liArray = document.getElementsByTagName("li");
                
                var datesArray = [];
                var namesArray = [];
                
                for (var i = 0; i < liArray.length; i++) { 
                    var li = liArray[i];
                    if(li.innerHTML.indexOf("<li>") == -1
                       && (li.innerHTML.indexOf("Datum:") != -1 || li.innerHTML.indexOf("(kein Prüfungsdatum)") != -1)) {
                    
                        var matchDate = li.innerHTML.match(/\d{1,2}\.\d{1,2}\.\d{4}|kein Prüfungsdatum/g);
                
                        var myRegexp = /(fer:&nbsp;)(.+)(;\n)/g;
                        var match = myRegexp.exec(li.innerHTML);
                
                        var datum = matchDate;
                        var name = "ohne";
                        if (match != null && match.length >= 3){
                            name = match[2];
                            namesArray.push(name);
                        }
            
                        datesArray.push(datum);
                    }
                }
            
                var uniqueDates = unique(datesArray);
                var uniqueNames = unique(namesArray);

                for (var i = 0; i < uniqueDates.length; i++){
                    var newDate = document.createElement('option');
                    newDate.innerHTML = uniqueDates[i];
                    newDate.setAttribute("value", uniqueDates[i]);
                    selectDate.appendChild(newDate);
                }

                for (var i = 0; i < uniqueNames.length; i++){
                    var newName = document.createElement('option');
                    newName.innerHTML = uniqueNames[i];
                    newName.setAttribute("value", uniqueNames[i]);
                    selectName.appendChild(newName);
                }

                var filterButton = document.createElement('button');
                filterButton.innerHTML = "filtern";
                filterButton.addEventListener('click', bossPlusButtonClick);
                
                filterDiv.appendChild(selectDate);
                filterDiv.appendChild(selectName);
                filterDiv.appendChild(filterButton);
                
                insertAfter(filterDiv, theDivider);
            }
        }
    }

    // Run the initialization
    initBossPlus();
})();
