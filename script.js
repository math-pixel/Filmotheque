"use strict"

//* ####################
//* variable declaration
//* ####################

let onlineMode = false;

let PEGI18 = false; 

let arrayImgPegi18 = ["https://www.editionsmilan.com/wp-content/uploads/sites/3/2022/04/kirikou-debout.gif",
    "https://www.babelio.com/users/QUIZ_Oui-Oui-_1866.jpeg",
    "https://i.pinimg.com/564x/8d/c4/11/8dc41172d6352590e24ac42e43bac92d.jpg",
    "https://i.pinimg.com/564x/e4/c5/52/e4c552ef5de4926aace7040f17363f0d.jpg",
    "https://i.pinimg.com/564x/73/20/93/732093d29e78c8f1e05026bd12dea690.jpg",
    "https://i.pinimg.com/564x/09/ee/55/09ee55ce76ea94bac642b33dee778345.jpg",
    "https://i.pinimg.com/564x/e0/6a/d9/e06ad9d18c09847e136be64ef46e8649.jpg",
    "https://i.pinimg.com/236x/81/4b/39/814b39a7e0b46f2010a9e5b7db1ce9b7.jpg",
    "https://i.pinimg.com/564x/74/da/fe/74dafefa58a4285baf38948fb9724423.jpg",
    "https://i.pinimg.com/564x/08/84/76/088476204174d022696a2c63443509cd.jpg",
    "https://i.pinimg.com/564x/61/3e/40/613e40d8a57c4c2ee388d1ddaa048692.jpg",
    "https://i.pinimg.com/564x/b4/ed/0a/b4ed0a46161264bb4aecb48184406e1b.jpg",
    "https://img.freepik.com/photos-premium/mignon-petit-chaton-britannique-bleu-gris-dormant-enveloppe-dans-couverture-carreaux-blanche-concept-adorables-animaux-compagnie_106368-4291.jpg?w=2000",
    "https://i.ytimg.com/vi/Q6amwKTI9VY/maxresdefault.jpg",
    "https://chatfaitdubien.fr/wp-content/uploads/2016/11/97acaf70f8a793887f41604c3e7e7633.jpg",
    "https://chatfaitdubien.fr/wp-content/uploads/2016/11/97acaf70f8a793887f41604c3e7e7633.jpg",
    "https://chatfaitdubien.fr/wp-content/uploads/2016/11/97acaf70f8a793887f41604c3e7e7633.jpg"];
let image_back;
let Url;

let arrayMovies = [];
let arrayMoviesClone = [];
let arrayCategories = [];

let currentIndexSelected;

let parentContainerFilm = document.getElementById("container");

let nbCardByPage;
if (window.innerHeight > window.innerWidth) {
    nbCardByPage = 4;
}else{
    nbCardByPage = 14;
}

let tabIndexMin = 0;
let tabIndexMax = tabIndexMin + nbCardByPage;

let selecteurPage = document.getElementById("select");

let search_bar = document.getElementById("search_bar");



let panel_background = document.getElementById("panel_background");
let cover = document.getElementById("cover");
let titreFilm = document.getElementById("titreFilm");
let ratioLike = document.getElementById("ratioLike");
let autheur = document.getElementById("autheur");
let description = document.getElementById("description");
let categorie = document.getElementById("categorie");
let video = document.getElementById("video");



let filterSection = document.getElementById("filterSection");


//* ####################
//* END variable declaration
//* ####################


//*#####################
//* CREATE GRID
//*#####################


function deleteChildren(parent){
    parent.innerHTML = "";
}

function createGridFilm(arrayFilm, arrayCategories){
    deleteChildren(parentContainerFilm);
    displayArrow();
    arrayFilm.forEach(element => {

        //set current index for like
        

        // console.log(element.category)
        let CategorieName = nameCategorie(element.category);
        //console.log(CategorieName)

        let miniContainer = document.createElement("div");
        // miniContainer.style.height =100/(maxItems/3) +"%";
        // miniContainer.style.width = 100/(maxItems/1.2) +"%";
        miniContainer.classList.add("container_card")
        miniContainer.style.position = "relative";

        parentContainerFilm.appendChild(miniContainer);

        let dislikes = element.dislikes;
        let likes = element.likes;
        let ratio = likes/(dislikes+likes)*100;

        //console.log(ratio)

        let RatioLike = document.createElement("div");
        RatioLike.classList.add("ratioLike");
        RatioLike.style.backgroundImage = `linear-gradient(90deg, #f9f871 ${ratio - 20}%, #f9f87110 ${ratio + 5}%)`
        miniContainer.appendChild(RatioLike);


        
        if (element.category === "R7njrf6DPHVvNRLpz4P0" && PEGI18 ) {//horreur
            image_back = `url(${arrayImgPegi18[Math.floor(Math.random() * arrayImgPegi18.length)]})`;
        }else{
            image_back = `url(${element.img})`;
        }

        let image = document.createElement("div");
        image.style.backgroundImage = image_back ;
        image.classList.add("imageTile");
        image.style.height = "100%";
        image.style.width = "100%";

        miniContainer.appendChild(image);

        let Titre = document.createElement("h2");
        Titre.classList.add("Titre")
        Titre.innerHTML = element.name;


        miniContainer.appendChild(Titre);

        let OverlayTile = document.createElement("div");
        OverlayTile.classList.add("OverlayTile");

        image.appendChild(OverlayTile);

        miniContainer.addEventListener("click", (e) => {
            currentIndexSelected = element
            openPanel(element, CategorieName);
        });

    });
}

//*#####################
//* END CREATE GRID
//*#####################


//*#####################
//* GET DATA
//*#####################
//#region 

let getData = () => {

    let arrayPromise = [];

    //console.log("getDATA");

    // movies
    if (onlineMode) {

        arrayPromise.push(axios.get('https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies'))

    }else{

        arrayPromise.push(axios.get("./movies.json"));
    
    }

    // categories
    if (onlineMode) {

        arrayPromise.push(axios.get('https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories'))

    }else{

        arrayPromise.push(axios.get("./categories.json"))
        
    }

    return Promise.all(arrayPromise)

}

const feth_data = () => {
    getData()
    .then((value) => {
        let [Movies, categories] = value;
        arrayMovies =  [...Movies.data];
        arrayMoviesClone = [...arrayMovies];
        arrayCategories =  categories.data.map(x => x);

        if (localStorage.getItem("arrayMovies") === null || onlineMode) {
            saveOfflineData();
        }else{
            if (!onlineMode) {
                arrayMovies = [...JSON.parse(localStorage.getItem("arrayMovies"))];
                arrayMoviesClone = [...arrayMovies];
                arrayCategories = [...JSON.parse(localStorage.getItem("arrayCategories"))];
            }
            
        }
    })
    .then((e) => { 
        //console.log(arrayCategories);
        createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax), arrayCategories);
        DisplayNumberFilm();
        DisplayFilter();
        initSelecteInput();
    })
    .catch((error) => {
        console.log(error);

        //if online but not api try local
        if(onlineMode){
            onlineMode = false;
            document.getElementById("ChangeOnlineMode").checked = true;
            feth_data();

        }

    });
}

feth_data();


//#endregion
//*#####################
//* END GET DATA
//*#####################



//* ##################
//* EVENT LISTENER
//* ##################
//#region

// selecteurPage.addEventListener('change', (e)=>{
//     nbCardByPage = selecteurPage.value;
//     tabIndexMin +=  nbCardByPage
//     tabIndexMax = tabIndexMin + nbCardByPage;
//     createGridFilm(arrayMovies.slice(tabIndexMin, tabIndexMax));
// })


document.getElementById('right').addEventListener("click", (e) => {
    if (tabIndexMax < arrayMoviesClone.length) {
        tabIndexMin +=  nbCardByPage;
        tabIndexMax = tabIndexMin + nbCardByPage;
        createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax));
    }
});

document.getElementById('left').addEventListener("click", (e) => {
if (tabIndexMin > 0) {
    tabIndexMin -=  nbCardByPage;
    tabIndexMax = tabIndexMin + nbCardByPage;
    createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax));
}
});

document.getElementById("parametre").addEventListener("click", () => {
    document.getElementById("Panel_Parameter").style.display = "flex";
});

document.getElementById("filter_button").addEventListener("click", () => {
    console.log("a")
    if (document.getElementById("filterSection").classList.contains("openFilter")) {

        document.getElementById("filterSection").classList.add("closeFilter");
        document.getElementById("filterSection").classList.remove("openFilter");

    }else{

        document.getElementById("filterSection").classList.add("openFilter");
        document.getElementById("filterSection").classList.remove("closeFilter");
        
    }
   
});

document.getElementById("crossEdit").addEventListener("click", () => {
    closePanel();
});

document.getElementById("crossCate").addEventListener("click", () => {
    closePanel();
});

document.getElementById("crossParameter").addEventListener("click", () => {
    closePanel();
});

document.getElementById("crossPanel").addEventListener("click", () => {
    closePanel();
});

document.getElementById("addButton").addEventListener("click", () => {
    closePanel();
    initPanelEdit("add"); 
});

document.getElementById("addCate_button").addEventListener("click", () => {
    closePanel();
    document.getElementById("panel_background_AddCate").style.display = "block";
    document.getElementsByClassName("submitCate")[0].value = "Ajouter La Categorie";
});

document.getElementById("ModifCate_button").addEventListener("click", () => {
    closePanel();
    document.getElementById("panel_background_AddCate").style.display = "block";
    addselectCate("Modifier La Categorie")
});

document.getElementById("SuprCate_button").addEventListener("click", () => {
    closePanel();
    document.getElementById("panel_background_AddCate").style.display = "block";
    document.querySelector(".nameCate").removeAttribute("required");
    document.querySelector(".nameCate").style.display = "none";
    addselectCate("Suprimer La Categorie");

});

document.getElementById("ChangePegiMode").addEventListener(("change"), (elm) =>{
    if (elm.target.checked === true) {
        PEGI18 = true;
        createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax), arrayCategories);
    }else{
        PEGI18 = false;
        createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax), arrayCategories);
    }
});
document.getElementById("ChangeOnlineMode").addEventListener(("change"), (elm) =>{
    if (elm.target.checked === true) {
        onlineMode = true;
        feth_data()
    }else{
        onlineMode = false;
        feth_data()
    }
});


//#endregion
//* ##################
//* END EVENT LISTENER
//* ##################






//* #########
//* function
//* #########
//#region 


function displayArrow(){
    if (tabIndexMin === 0) {
        document.getElementById('left').style.display = "none";
    }else{
        document.getElementById('left').style.display = "block";
    }

    if (tabIndexMax >= arrayMoviesClone.length) {
        document.getElementById('right').style.display = "none";
    }else{
        document.getElementById('right').style.display = "block";
    }
}

function addselectCate(NameButton){
    let select = document.getElementById("select_cate").cloneNode(true);
    select.id = "newSelect";
    let parent = document.querySelector("#panel_background_AddCate form")
    parent.insertBefore(select, parent.children[1]);

    document.getElementsByClassName("submitCate")[0].value = NameButton;
    
}


function openPanel(Film, CategorieName){

    //* set info of film in panel
    panel_background.style.display = "block";

    if (Film.category === "R7njrf6DPHVvNRLpz4P0" && PEGI18 ) {//horreur
        image_back =    arrayImgPegi18[Math.floor(Math.random() * arrayImgPegi18.length)];
        Url = "G1IbRujko-A"
    }else{
        image_back = Film.img;
        Url = Film.video.slice(Film.video.length-11,Film.video.length);
    }

    cover.src = image_back;
    titreFilm.innerHTML = Film.name;
    autheur.innerHTML = Film.author;
    description.innerHTML = Film.description;
    categorie.innerHTML = CategorieName;  
    video.src = "https://www.youtube.com/embed/" + Url;




    createButtonDisike(Film)
    createButtonLike(Film);
    createButtonEdit(Film);
    createButtonDelete(Film)

}


function closePanel(){
    document.getElementById("panel_background_FilmEdit").style.display = "none";
    document.getElementById("panel_background").style.display = "none";
    document.getElementById("panel_background_AddCate").style.display = "none";
    document.getElementById("Panel_Parameter").style.display = "none";

    if (document.body.contains(document.getElementById("newSelect"))) {
        document.getElementById("newSelect").remove();
    }

    
    document.querySelector(".nameCate").style.display = "block";
    document.querySelector(".nameCate").setAttribute("required",true);
}


function initPanelEdit(type, Film){
    document.getElementById("panel_background_FilmEdit").style.display = "block";
    if (type === "add") {
        clearInputForm()
        document.getElementById("submitForm").value = "Ajouter Le Film";
    }
    else if (type === "change") {


        document.getElementById("submitForm").value = "Modifier Le Film";


        document.getElementById("name").value = Film.name
        document.getElementById("description_input").value = Film.description
        document.getElementById("author").value = Film.author
        document.getElementById("imageURL").value = Film.img
        document.getElementById("Trailer").value = Film.video
        document.getElementById("select_cate").value = Film.category
        document.getElementById("idFilm").value = Film.id
        
        //console.log(nameCategorie(Film.category))
    }
}

function createButtonEdit(Film){
    //* creation du button edit
    let edit = document.createElement("img");
    edit.classList.add("edit_button");
    // edit.src = "https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png";

    edit.addEventListener("click", () => {
        initPanelEdit("change", Film);
    });

    panel_background.firstElementChild.appendChild(edit);
}

function createButtonDelete(Film){
    //* creation du button delete
    let trash = document.createElement("img");
    trash.classList.add("trash_button");
    // trash.src = "https://uxwing.com/wp-content/themes/uxwing/download/user-interface/trash-icon.png";

    trash.addEventListener("click", () => {
        deleteFilm(Film.id);
    });

    panel_background.firstElementChild.appendChild(trash);
}

function createButtonLike(Film){
    //* creation du button delete
    let like = document.createElement("div");
    like.classList.add("like");
    like.style.backgroundImage = "url('./images/like.png')";

    like.addEventListener("click", () => {
        patchLike(Film.id);  
    });

    panel_background.firstElementChild.appendChild(like);
}

function createButtonDisike(Film){
    //* creation du button delete
    let dislike = document.createElement("div");
    dislike.classList.add("dislike");


    dislike.addEventListener("click", () => {
        patchDislike(Film.id);  
    });

    panel_background.firstElementChild.appendChild(dislike);
}


function nameCategorie(idCate){
    let x = "";
    arrayCategories.forEach((OBJcate) => {
        if (OBJcate.id === idCate) {
            x = OBJcate.name;
        }
    })
    return x;
}


function DisplayNumberFilm(){
    document.getElementById("resultSearch").innerHTML = `${arrayMoviesClone.length} results`;
}

//* ###########
//* Filter Part
//* ###########
//#region 
//create button
function createButtonFilterName(){
    let nom = document.createElement("button");
    nom.classList.add("nom");
    nom.innerText = "Name";

    let witdh = calculateWidthButton();
    nom.style.width =  witdh + "vw";

    nom.addEventListener("click", () => {
        FilterName();
    });

    filterSection.appendChild(nom);
}
function createButtonFilterAuthor(){
    let authorFilter = document.createElement("button");
    authorFilter.classList.add("authorFilter");
    authorFilter.innerText = "Autheur";

    let witdh = calculateWidthButton();
    authorFilter.style.width =  witdh + "vw";

    authorFilter.addEventListener("click", () => {
        FilterAuthor();
    });

    filterSection.appendChild(authorFilter);
}
function createButtonFilterLike(){
    let FilterLikeButton = document.createElement("button");
    FilterLikeButton.classList.add("FilterLikeButton");
    FilterLikeButton.innerText = "Like";

    let witdh = calculateWidthButton();
    FilterLikeButton.style.width =  witdh + "vw";

    FilterLikeButton.addEventListener("click", () => {
        FilterLike();
    });

    filterSection.appendChild(FilterLikeButton);
}
function createButtonFilterClear(){
    let FilterClearButton = document.createElement("button");
    FilterClearButton.classList.add("FilterClearButton");
    FilterClearButton.innerText = "Clear";

    let witdh = calculateWidthButton();
    FilterClearButton.style.width =  witdh + "vw";

    FilterClearButton.addEventListener("click", () => {
        FilterClear();
    });

    filterSection.appendChild(FilterClearButton);
}

//filter on array
function FilterCate(idCate){
    tabIndexMin = 0;
    tabIndexMax = tabIndexMin + nbCardByPage;

    arrayMoviesClone = arrayMovies.filter(Cate => Cate.category === idCate);
    console.log(arrayMoviesClone);
    createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax));
}
function FilterName(){
    tabIndexMin = 0;
    tabIndexMax = tabIndexMin + nbCardByPage;

    arrayMoviesClone.sort(
        (p1, p2) => (p1.name > p2.name) ? 1 : (p1.name < p2.name) ? -1 : 0);

    createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax))
}
function FilterAuthor(){
    tabIndexMin = 0;
    tabIndexMax = tabIndexMin + nbCardByPage;

    arrayMoviesClone.sort(
        (p1, p2) => (p1.author > p2.author) ? 1 : (p1.author < p2.author) ? -1 : 0);

    createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax))
}
function FilterLike(){
    tabIndexMin = 0;
    tabIndexMax = tabIndexMin + nbCardByPage;

    arrayMoviesClone.sort(
        (p1, p2) => {
            //console.log(p1);
            return (p1.likes < p2.likes) ? 1 : (p1.likes > p2.likes) ? -1 : 0;
        });

    createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax))
}
function FilterClear(){
    tabIndexMin = 0;
    tabIndexMax = tabIndexMin + nbCardByPage;

    arrayMoviesClone = [...arrayMovies];

    createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax))
}

function DisplayFilter(){
    filterSection.innerHTML = "";

    // filterSection
    createButtonFilterName();
    createButtonFilterAuthor();

    //create button Filter for Categorie
    arrayCategories.forEach((elm)=>{
        //console.log(elm)
        let CateButton = document.createElement("button");

        CateButton.innerHTML = elm.name;
        CateButton.classList.add("CateButton");

        let witdh = calculateWidthButton();
        CateButton.style.width =  witdh + "vw";
    
        CateButton.addEventListener("click", () => {
            FilterCate(elm.id);
        });
    
        filterSection.appendChild(CateButton);
    });

    createButtonFilterLike();
    createButtonFilterClear();
}

function calculateWidthButton(){
    if (window.innerHeight > window.innerWidth) {
        return 90 / (4 + arrayCategories.length) * 2; //4 car jai 4 autre possibiliter de filtre
    }else{
        return 90 / (4 + arrayCategories.length); //4 car jai 4 autre possibiliter de filtre
    }
    
}
//#endregion
//* ###########
//* END Filter Part
//* ###########

function initSelecteInput(){
    let select = document.getElementById("select_cate");
    select.innerHTML="";
    arrayCategories.forEach((elm)=>{
        let option = document.createElement("option");
        option.value = elm.id;
        option.innerHTML = elm.name;

        select.appendChild(option);
    })
}

function clearInputForm(){
    let inputs = document.querySelectorAll("form input[type=text]")
    inputs.forEach((elm) => {
        //console.log(elm)
        elm.value = "";
    })
}


function saveOfflineData(){
    localStorage.setItem("arrayMovies", JSON.stringify(arrayMovies));
    localStorage.setItem("arrayCategories", JSON.stringify(arrayCategories));
}


//?###########
//?request api
//?###########
//#region 
let patchLike = async(movieID) => {
    
        if (localStorage.getItem(movieID) === null) {
            if(onlineMode){

                const res = await axios.patch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/${movieID}/like`).then(() => {
                    feth_data();
                    alert("liked")
                });
                localStorage.setItem(movieID, 'used');
            
            }else{
                let tempArrayLike = JSON.parse(localStorage.getItem("arrayMovies"));

                let index = tempArrayLike.find((elm) => elm.id === movieID);
                index = tempArrayLike.indexOf(index)
                
                
                tempArrayLike[index].likes += 1;

                arrayMovies = [...tempArrayLike];
                
                saveOfflineData();
                feth_data();
                alert("liked local");

            }
        }else{
            alert("already used")
        }
        
};

let patchDislike = async(movieID) => {
    
        if (localStorage.getItem(movieID) === null) {
            
            if(onlineMode){
                const res = await axios.patch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/${movieID}/dislike`).then(() => {
                    feth_data();
                    alert("disliked")
                });
                localStorage.setItem(movieID, 'used');
            }else{
                let tempArrayLike = JSON.parse(localStorage.getItem("arrayMovies"));

                let index = tempArrayLike.find((elm) => elm.id === movieID);
                index = tempArrayLike.indexOf(index)
                
                
                tempArrayLike[index].dislikes += 1;
                
                saveOfflineData();
                feth_data();
                alert("disliked in local");
            }
            
        }else{
            alert("already uses")
        }
    
};

let addFilm = (Film) => {

    if (onlineMode) {
        axios.post('https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies', Film)
      .then(function (response) {
        //console.log(response);
        alert("Film Ajouter");
        clearInputForm();
        closePanel();
        feth_data();
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
        

        arrayMovies.push(Film);
        
        saveOfflineData();
        alert("Film Ajouter en local");
        clearInputForm();
        closePanel();
        feth_data();
    }
    
}


let modifyFilm = (Film, idFilm) => {

    if (onlineMode) {
        axios.patch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/${idFilm}`, Film)
      .then(function (response) {
        console.log(response);
        closePanel();
        feth_data();
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
        let tempArrayLike = JSON.parse(localStorage.getItem("arrayMovies"));

        let index = tempArrayLike.find((elm) => elm.id === idFilm);
        index = tempArrayLike.indexOf(index)
        
        
        tempArrayLike[index].name = Film.name;
        tempArrayLike[index].img = Film.img;
        tempArrayLike[index].category = Film.category;
        tempArrayLike[index].description = Film.description;
        tempArrayLike[index].video = Film.video;

        arrayMovies = [...tempArrayLike];
        
        closePanel();
        saveOfflineData();
        feth_data();
    }
    
}

let deleteFilm  = (idFilm) => {

    if (confirm('Are you sure you want to delete this Film ?')) {

        if (onlineMode) {
            axios.delete(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/${idFilm}`)
            .then(function (response) {
                //console.log(response);
                closePanel();
                feth_data();
            })
            .catch(function (error) {
                console.log(error);
            });
        }else{
            let tempArrayLike = JSON.parse(localStorage.getItem("arrayMovies"));

            let index = tempArrayLike.find((elm) => elm.id === idFilm);
            index = tempArrayLike.indexOf(index)
            
            
            arrayMovies.splice(index, 1);

            // arrayMovies = [...tempArrayLike];
            
            saveOfflineData();
            feth_data();
            closePanel();
            alert("deleted film local");
        }
        
      } else {
        // Do nothing!
        console.log('Film non supprimer');
      }  
}


let addCategory = (nameCate) => {

    if (onlineMode) {
        alert("add")
        axios.post(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories`, {name:nameCate})
            .then(function (response) {
                console.log(response);
                closePanel();
                feth_data();
            })
            .catch(function (error) {
                console.log(error);
            });
    }else{
        let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomNumber = "";
        for (let index = 0; index < 20; index++) {
            let element = characters[Math.floor(Math.random() * characters.length)];
            
            randomNumber += element;
        }
        arrayCategories.push({id:randomNumber, name:nameCate});
        saveOfflineData();
        alert("Cate Ajouter en local");
        clearInputForm();
        closePanel();
        feth_data();
    }
    
}

let modifyCategory = (nameCate) => {
    let Cateid = document.getElementById("newSelect").value;
    
    if (onlineMode) {
        axios.put(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories/${Cateid}`, {name:nameCate})
        .then(function (response) {
            //console.log(response);
            closePanel();
            feth_data();
        })
        .catch(function (error) {
            console.log(error);
            alert(error);
            closePanel();
        });
    }else{
        let tempArrayCate = JSON.parse(localStorage.getItem("arrayCategories"));

        console.log(Cateid)

        let index = tempArrayCate.find((elm) => elm.id === Cateid);
        console.log(index)
        index = tempArrayCate.indexOf(index);
        console.log(index)
        tempArrayCate[index].name = nameCate;
        console.log(tempArrayCate)

        arrayCategories = [...tempArrayCate];

        saveOfflineData();
        alert("Cate modifier en local");
        clearInputForm();
        closePanel();
        feth_data();
    }  
}

let deleteCategory = () => {
    let Cateid = document.getElementById("newSelect").value;
    let canDelete  = true;

    arrayMovies.find((element)=>{
        if (element.category === Cateid) {
            canDelete = false;
        }
    })

    if (canDelete) {
        if (onlineMode) {
            axios.delete(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories/${Cateid}`)
            .then(function (response) {
                //console.log(response);
                closePanel();
                feth_data();
            })
            .catch(function (error) {
                console.log(error);
            });
        }else{
            let tempArrayCate = JSON.parse(localStorage.getItem("arrayCategories"));

            let index = tempArrayCate.find((elm) => elm.id === idFilm);
            index = tempArrayCate.indexOf(index)
            
            
            arrayCategories.splice(index, 1);


            saveOfflineData();
            feth_data();
            closePanel();
            alert("deleted Cate local");
        }
        
    }else{
        alert("categorie deja attribuer");
    }
}


//#endregion
//?###########
//? end request api
//?###########


//#endregion
//* #########
//* END function
//* #########
//#region 

document.querySelectorAll('form').forEach((form)=>{

    form.addEventListener('submit', (e) => {
        
        e.preventDefault();
        //console.log("aaaa")
        const formData = new FormData(e.target);
    
        const name=formData.get("name");
        const description=formData.get("description");
        const author=formData.get("author");
        const imgUrl=formData.get("imageURL");
        const Trailer=formData.get("Trailer");
        const cate=formData.get("select");
        const idFilm=formData.get("idFilm");
    


        let FilmObj = {
            name:name,
            author:author,
            img:imgUrl,
            category:cate,
            description:description,
            video:Trailer
        };
    

        console.log(cate)
        let tempArray = [...e.target.children]

        tempArray.forEach((elm)=>{

            if (elm.id === "submitForm") {
                if (elm.value === "Ajouter Le Film") {
                    console.log("Ajouter La Film")
                    addFilm(FilmObj);
                }if (elm.value === "Modifier Le Film"){
                    console.log("Modifier Le Film")
                    modifyFilm(FilmObj, idFilm)
                }if (elm.value === "Ajouter La Categorie"){
                    console.log("Ajouter La Categore")
                    addCategory(name);
                }if (elm.value === "Modifier La Categorie"){
                    console.log("Modifier La Categorie")
                    modifyCategory(name);
                }if (elm.value === "Suprimer La Categorie"){
                    console.log("Suprimer La Categorie")
                    deleteCategory();
                }
            }
        });      
        
    })

})


//* ############
//* search bar
//* ############


document.addEventListener("keyup", (key) =>{
    
    if (document.activeElement === search_bar) {
        if (search_bar.value === "") { 
            // nbCardByPage = 14;
            // tabIndexMin = 0; 
            //? trouver un moyen de renvoyer le tableau de base si pas de string
            search();
        }else{
            search();
        }
    }
})


function search(){
    tabIndexMin = 0;
    tabIndexMax = tabIndexMin + nbCardByPage;



    

    let arrayMoviesName = arrayMovies.filter(movie => movie.name.toUpperCase().includes(search_bar.value.toUpperCase()) === true);

    // arrayMoviesName.forEach((elm) => {
        
    //     // elm.name = "<mark>" + elm.name.slice(0,search_bar.value.length) + "</mark>" + elm.name.slice(search_bar.value.length);
    // });



    let arrayMoviesDescription = arrayMovies.filter(movie => 
        movie.description.toUpperCase().includes(search_bar.value.toUpperCase()) === true
    );

    let arrayMoviesAuthor = arrayMovies.filter(movie => 
        search_bar.value.toUpperCase()  === movie.author.substring(0, search_bar.value.length).toUpperCase()
    );

    
    //concat array without duplicates
    arrayMoviesClone = [...new Set([...arrayMoviesName,...arrayMoviesDescription,...arrayMoviesAuthor])]  //
    //TODO search en fonction de check box pour description et autheur


    //console.log("arrayMovies", arrayMovies)
    //console.log("arrayMoviesName", arrayMoviesName)


    //* afficher les resultat
    DisplayNumberFilm();


    askCreateFilm();
    
    createGridFilm(arrayMoviesClone.slice(tabIndexMin, tabIndexMax));

    // markText(document.getElementById("container"));

}

function markText(parentNode){

    let text = parentNode.innerText.toUpperCase();

    let newArray = text.match(search_bar.value.toUpperCase())

    console.log(newArray)

}


function askCreateFilm(){


    //* demander de creer un film
    if (arrayMoviesClone.length === 0) {
        if (document.getElementById("main_container").contains(document.getElementById("adding_button")) === false) {
            const parent = document.getElementById("main_container");

            let button_add = document.createElement("input");
            button_add.value = "ajouter un film ?";
            button_add.type = "button";
            button_add.classList.add("adding_button");
            button_add.id = "adding_button";

            button_add.addEventListener("click", () => {
                initPanelEdit("add"); 
            });


            let Message = document.createElement("h1");
            Message.innerHTML = "Aucun film trouvé";
            Message.classList.add("Message");
            Message.id = "Message";

            parent.appendChild(Message);
            parent.appendChild(button_add);
        }
        
    }else{
        if (document.getElementById("main_container").contains(document.getElementById("adding_button"))) {
            document.getElementById("adding_button").remove();
            document.getElementById("Message").remove();
        }
    }
}

//#endregion
//* ############
//* search bar
//* ############


  

