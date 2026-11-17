(function () {
  "use strict";
  var app = angular.module("wedwiseApp", []);
  app.controller("MainCtrl", ["$scope", function ($scope) {
    var vm = this;
    var categories = ["Venue", "Catering", "Photography", "Decor", "Outfits & Jewelry", "Invitations", "Miscellaneous"];
    var defaults = {
      weddingDate: "2027-02-14", budget: 1500000,
      galleryItems: [
        {id:1,title:"A garden ceremony",category:"Ceremony",image:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",favorite:true},
        {id:2,title:"The floral mandap",category:"Decor",image:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85",favorite:false},
        {id:3,title:"An intimate table setting",category:"Reception",image:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",favorite:false},
        {id:4,title:"A timeless venue",category:"Venues",image:"https://images.unsplash.com/photo-1519225421980-715cb0215edd?auto=format&fit=crop&w=1000&q=85",favorite:true},
        {id:5,title:"Golden-hour details",category:"Details",image:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85",favorite:false},
        {id:6,title:"A romantic garden setting",category:"Venues",image:"https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1000&q=85",favorite:false}
      ],
      categoryBudgets: {"Venue":300000,"Catering":450000,"Photography":100000,"Decor":150000,"Outfits & Jewelry":250000,"Invitations":50000,"Miscellaneous":200000},
      guests: [], expenses: [], events: [], tasks: [], vendors: [], venues: [
        {id:1,name:"The Grand Palace",city:"Hyderabad",type:"Luxury",capacity:800,price:250000,image:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",description:"An elegant celebration space with grand interiors and landscaped gardens.",saved:false},
        {id:2,name:"Mango Meadows",city:"Hyderabad",type:"Garden",capacity:500,price:175000,image:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",description:"A beautiful outdoor venue for intimate and traditional celebrations.",saved:false},
        {id:3,name:"The Heritage Courtyard",city:"Vijayawada",type:"Heritage",capacity:650,price:210000,image:"https://images.unsplash.com/photo-1519225421980-715cb0215edd?auto=format&fit=crop&w=900&q=80",description:"A warm heritage-inspired venue with a timeless atmosphere.",saved:false},
        {id:4,name:"Olive Convention",city:"Bengaluru",type:"Convention",capacity:1200,price:300000,image:"https://images.unsplash.com/photo-1507504031003-b417219a0?auto=format&fit=crop&w=900&q=80",description:"A spacious modern venue for large wedding gatherings.",saved:false},
        {id:5,name:"Lakeview Gardens",city:"Chennai",type:"Garden",capacity:400,price:140000,image:"https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=900&q=80",description:"A relaxed garden setting for a memorable outdoor ceremony.",saved:false},
        {id:6,name:"Pearl Convention Hall",city:"Hyderabad",type:"Convention",capacity:1000,price:275000,image:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",description:"A contemporary hall with flexible event arrangements.",saved:false}
      ]
    };
    function asDate(value) {
      if (!value) return null;
      if (value instanceof Date) return value;
      var s = String(value).slice(0,10).split("-");
      return s.length === 3 ? new Date(Number(s[0]), Number(s[1])-1, Number(s[2])) : null;
    }
    function dateKey(value) {
      if (!value) return "";
      var d = asDate(value);
      if (!d || isNaN(d.getTime())) return "";
      return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    }
    function load() {
      try {
        var saved = JSON.parse(localStorage.getItem("wedwiseData") || "null") || {};
        var data = Object.assign({}, angular.copy(defaults), saved);
        data.categoryBudgets = Object.assign({}, defaults.categoryBudgets, saved.categoryBudgets || {});
        data.weddingDate = asDate(data.weddingDate) || asDate(defaults.weddingDate);
        data.events = (data.events || []).map(function(x){x.date=asDate(x.date);if(x.date && x.date.getFullYear()<2000)x.date=null;return x;});
        data.tasks = (data.tasks || []).map(function(x){x.due=asDate(x.due);x.reminder=asDate(x.reminder);return x;});
        data.expenses = (data.expenses || []).map(function(x){
          if (x.actual === undefined) x.actual = Number(x.amount || 0);
          if (x.estimated === undefined) x.estimated = Number(x.amount || x.actual || 0);
          delete x.amount; return x;
        });
        return data;
      } catch(e) { return angular.copy(defaults); }
    }
    Object.assign(vm, load());
    vm.categories = categories;
    vm.invite = {names:"Aarav & Ananya",date:"2027-02-14",venue:"",message:"With love and blessings, we invite you to share in our joy."};
    vm.guestForm={}; vm.expenseForm={category:"Venue"}; vm.eventForm={}; vm.taskForm={category:"Planning",priority:"Medium"}; vm.vendorForm={};
    vm.venueSearch=""; vm.venueCity=""; vm.selectedVenue=null;
    vm.cityFilter=function(v){return !vm.venueCity || v.city===vm.venueCity;};
    vm.save=function(){
      var payload={};
      ["weddingDate","budget","categoryBudgets","guests","expenses","events","tasks","vendors","venues","galleryItems"].forEach(function(k){payload[k]=vm[k];});
      localStorage.setItem("wedwiseData",JSON.stringify(payload));
      vm.daysToGo=calculateDays();
    };
    vm.money=function(n){return "₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});};
    vm.totalSpent=function(){return vm.expenses.reduce(function(s,e){return s+Number(e.actual||0);},0);};
    vm.totalEstimated=function(){return vm.expenses.reduce(function(s,e){return s+Number(e.estimated||0);},0);};
    vm.remaining=function(){return Number(vm.budget||0)-vm.totalSpent();};
    vm.budgetPercent=function(){return vm.budget>0?vm.totalSpent()/vm.budget*100:0;};
    vm.categorySpent=function(cat){return vm.expenses.filter(function(e){return e.category===cat;}).reduce(function(s,e){return s+Number(e.actual||0);},0);};
    vm.categoryEstimated=function(cat){return vm.expenses.filter(function(e){return e.category===cat;}).reduce(function(s,e){return s+Number(e.estimated||0);},0);};
    vm.categoryPercent=function(cat){var cap=Number(vm.categoryBudgets[cat]||0);return cap?vm.categorySpent(cat)/cap*100:0;};
    vm.categoryOver=function(cat){return Number(vm.categoryBudgets[cat]||0)>0 && vm.categorySpent(cat)>Number(vm.categoryBudgets[cat]);};
    vm.overBudget=function(){return vm.totalSpent()>Number(vm.budget||0);};
    vm.completedTasks=function(){return vm.tasks.filter(function(t){return t.done;}).length;};
    vm.taskProgress=function(){return vm.tasks.length?Math.round(vm.completedTasks()/vm.tasks.length*100):0;};
    function calculateDays(){var target=asDate(vm.weddingDate);if(!target)return 0;var today=new Date();today=new Date(today.getFullYear(),today.getMonth(),today.getDate());return Math.ceil((target-today)/86400000);}
    vm.daysToGo=Math.max(0,calculateDays());
    vm.dateDay=function(d){var x=asDate(d);return x?x.getDate():"—";};
    vm.dateMonth=function(d){var x=asDate(d);return x?x.toLocaleString("en",{month:"short"}):"";};
    vm.dateText=function(d){var x=asDate(d);return x?x.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"No date";};
    function nextId(arr){return arr.reduce(function(m,x){return Math.max(m,Number(x.id)||0);},0)+1;}
    vm.addGuest=function(){if(!vm.guestForm.name)return;vm.guests.push(Object.assign({id:nextId(vm.guests),status:"Not sent"},vm.guestForm));vm.guestForm={};vm.save();};
    vm.removeGuest=function(id){vm.guests=vm.guests.filter(function(x){return x.id!==id;});vm.save();};
    vm.addExpense=function(){var f=vm.expenseForm;if(!f.title||Number(f.estimated)<0||Number(f.actual)<0)return;vm.expenses.push({id:nextId(vm.expenses),title:f.title,category:f.category||"Miscellaneous",estimated:Number(f.estimated||0),actual:Number(f.actual||0)});vm.expenseForm={category:"Venue"};vm.save();};
    vm.removeExpense=function(id){vm.expenses=vm.expenses.filter(function(x){return x.id!==id;});vm.save();};
    vm.addEvent=function(){var f=vm.eventForm;if(!f.name||!f.date)return;vm.events.push(Object.assign({id:nextId(vm.events)},f));if(f.isWeddingDate){vm.weddingDate=dateKey(f.date);}vm.eventForm={};vm.save();};
    vm.setWeddingDate=function(){if(vm.weddingDate)vm.save();};
    vm.removeEvent=function(id){vm.events=vm.events.filter(function(x){return x.id!==id;});vm.save();};
    vm.addTask=function(){var f=vm.taskForm;if(!f.name)return;vm.tasks.push(Object.assign({id:nextId(vm.tasks),done:false,priority:"Medium"},f));vm.taskForm={category:"Planning",priority:"Medium"};vm.save();};
    vm.removeTask=function(id){vm.tasks=vm.tasks.filter(function(x){return x.id!==id;});vm.save();};
    vm.taskReminder=function(t){var d=asDate(t.reminder)||asDate(t.due);if(!d)return "No reminder set";var today=new Date();today=new Date(today.getFullYear(),today.getMonth(),today.getDate());var diff=Math.ceil((d-today)/86400000);return diff<0?"Overdue by "+Math.abs(diff)+" days":diff===0?"Due today": "Reminder in "+diff+" days";};
    vm.taskNeedsAttention=function(t){if(t.done)return false;var d=asDate(t.reminder)||asDate(t.due);if(!d)return false;var today=new Date();today=new Date(today.getFullYear(),today.getMonth(),today.getDate());return d<=today;};
    vm.taskMilestone=function(t){var due=asDate(t.due), wedding=asDate(vm.weddingDate);if(!due||!wedding)return "Unscheduled";var days=Math.ceil((wedding-due)/86400000);return days>=90?"90+ days before":days>=30?"30–89 days before":days>=7?"7–29 days before":days>=0?"Final week":"After wedding";};
    vm.addVendor=function(){if(!vm.vendorForm.name)return;vm.vendors.push(Object.assign({id:nextId(vm.vendors)},vm.vendorForm));vm.vendorForm={};vm.save();};
    vm.removeVendor=function(id){vm.vendors=vm.vendors.filter(function(x){return x.id!==id;});vm.save();};
    vm.toggleVenue=function(v){v.saved=!v.saved;vm.save();};vm.selectVenue=function(v){vm.selectedVenue=v;};
    vm.addVenueExpense=function(v){vm.expenses.push({id:nextId(vm.expenses),title:v.name+" booking",category:"Venue",estimated:Number(v.price||0),actual:0});vm.save();vm.selectedVenue=null;};
    vm.vendorIcon=function(type){return ({Photographer:"◉",Caterer:"♨",Decorator:"✿","Makeup artist":"✧",Florist:"❀","DJ / Music":"♫"})[type]||"✦";};

    // Inspiration gallery: users can save their own reference image URLs.
    vm.galleryCategories=["All","Ceremony","Decor","Reception","Venues","Details","Bridal"];
    vm.galleryFilter="All";
    vm.galleryForm={category:"Details"};
    vm.galleryMatches=function(photo){return vm.galleryFilter==="All" || photo.category===vm.galleryFilter;};
    vm.galleryFavorites=function(){return vm.galleryItems.filter(function(photo){return photo.favorite;}).length;};
    vm.addGalleryItem=function(){
      var f=vm.galleryForm;
      if(!f.title || !f.image || !/^https?:\/\//i.test(f.image)) return;
      vm.galleryItems.unshift({id:nextId(vm.galleryItems),title:f.title,category:f.category||"Details",image:f.image,favorite:false});
      vm.galleryForm={category:"Details"}; vm.save();
    };
    vm.toggleGalleryFavorite=function(photo){photo.favorite=!photo.favorite;vm.save();};
    vm.removeGalleryItem=function(id){vm.galleryItems=vm.galleryItems.filter(function(photo){return photo.id!==id;});vm.save();};

    // Three coordinated classic palettes, remembered on this browser.
    vm.themes=["classic","sage","rose"];
    vm.theme=localStorage.getItem("wedwiseTheme")||"classic";
    if(vm.themes.indexOf(vm.theme)<0) vm.theme="classic";
    function applyTheme(){document.documentElement.setAttribute("data-theme",vm.theme);}
    vm.cycleTheme=function(){var i=vm.themes.indexOf(vm.theme);vm.theme=vm.themes[(i+1)%vm.themes.length];localStorage.setItem("wedwiseTheme",vm.theme);applyTheme();};
    vm.themeLabel=function(){return vm.theme==="sage"?"Sage palette":vm.theme==="rose"?"Rose palette":"Classic palette";};
    applyTheme();

    // Download a portable backup of the planner's LocalStorage data.
    vm.exportBackup=function(){
      var payload={};
      ["weddingDate","budget","categoryBudgets","guests","expenses","events","tasks","vendors","venues","galleryItems"].forEach(function(k){payload[k]=vm[k];});
      var blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
      var url=URL.createObjectURL(blob);var link=document.createElement("a");
      link.href=url;link.download="wedwise-planner-backup.json";document.body.appendChild(link);link.click();
      document.body.removeChild(link);URL.revokeObjectURL(url);
    };
    vm.save();
    $scope.$watch(function(){return vm.weddingDate;},function(n,o){if(n!==o)vm.save();});
    setInterval(function(){var n=Math.max(0,calculateDays());if(n!==vm.daysToGo){$scope.$applyAsync(function(){vm.daysToGo=n;});}},60000);
  }]);
  $(function(){$(".menu-toggle").on("click",function(){$(".nav-links").toggleClass("open");});$(document).on("click",".nav-links a",function(){$(".nav-links").removeClass("open");});});
})();
