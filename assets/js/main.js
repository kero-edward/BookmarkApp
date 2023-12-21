var siteNameInput = document.getElementById('bookmarkName');
var siteUrlInput = document.getElementById('bookmarkUrl');
var buttonName = document.getElementById('buttonNameChange');
var tableBody = document.getElementById('tableBody');
buttonName.innerHTML = 'add';
var siteArray = [];
var siteObject = {};
var allSitesContainer = '';
var updateIndex;
var searchArray = [];

if (localStorage.getItem('myBookmarkSites') !== null) {
    displayBookmark();
}

/* 
add and update function. it takes two arguments, buttonWorn to set button text if update or add as a default, 
and doAction to take the action if only the form button is clicked.
*/
function addOrUpdateBookmark(buttonWord, doAction) {

    // we check here that the button clicked is the form button, otherwise we check the  innerHTML of the button to make the right action.
    if (doAction === true && buttonName.innerHTML === 'add') {

        if (siteNameValidations().test(siteNameInput.value) === false && siteUrlValidations().test(siteUrlInput.value) === true) {
            alert('The site name is not valid, It should start with a character and minimum 3 characters.');
        } else if (siteUrlValidations().test(siteUrlInput.value) === false && siteNameValidations().test(siteNameInput.value) === true) {
            alert('The site URL is not valid, You can try again as the following example: \'https://www.google.com\', either you can write \'http\' or start direct with \'www\' with minimum 3 characters as a name with the end of any domain \'.com, .org, .edu...\'.');
        } else if (siteNameValidations().test(siteNameInput.value) === false && siteUrlValidations().test(siteUrlInput.value) === false) {
            alert('Both site URL and name is not valid, You can try again as the following example: \'https://www.google.com\', either you can write \'http\' or start direct with \'www\' with minimum 3 characters as a name with the end of any domain \'.com, .org, .edu...\'. and the site name should start with a character and minimum 3 characters.');
        } else if (siteNameValidations().test(siteNameInput.value) === true && siteUrlValidations().test(siteUrlInput.value) === true) {
            // we check if the any of site inputs are added before to avoid duplicates.
            if (localStorage.getItem('myBookmarkSites') !== null) {
                siteArray = JSON.parse(localStorage.getItem('myBookmarkSites'));

                for (var i = 0; i < siteArray.length; i++) {
                    if (siteArray[i].siteName.toLowerCase() === siteNameInput.value.toLowerCase()) {
                        alert('Site name seems entered before!');
                        break;
                    } else if (siteArray[i].siteURL.toLowerCase() === siteUrlInput.value.toLowerCase()) {
                        alert('Site url seems entered before!');
                        break;
                    }

                    if (i == siteArray.length - 1) {
                        siteObject = {
                            siteName: siteNameInput.value,
                            siteURL: siteUrlInput.value
                        }
                        siteArray.push(siteObject);
                        localStorage.setItem('myBookmarkSites', JSON.stringify(siteArray));
                        alert('Site Bookmarked successfully');
                        break;
                    }
                }

            } else {
                siteObject = {
                    siteName: siteNameInput.value,
                    siteURL: siteUrlInput.value
                }
                siteArray.push(siteObject);
                localStorage.setItem('myBookmarkSites', JSON.stringify(siteArray));
                alert('Site Bookmarked successfully');
            }
        }

    } else if (doAction === true && buttonName.innerHTML === 'update') {
        updateBookmark();
    }

    // after checking with the old innerHTML value, we update the innerHTML with the new value. 
    buttonName.innerHTML = buttonWord;

    displayBookmark();
}

function updateBookmark() {
    for (var i = 0; i < siteArray.length; i++) {
        if (updateIndex == i) {
            siteArray[i].siteName = siteNameInput.value;
            siteArray[i].siteURL = siteUrlInput.value;
            localStorage.setItem('myBookmarkSites', JSON.stringify(siteArray));
            break;
        }
    }

    siteNameInput.value = '';
    siteUrlInput.value = '';
}

function getDataToUpdate(index) {

    var siteData;

    for (var i = 0; i < siteArray.length; i++) {
        if (index == i) {
            siteData = siteArray[i];
            updateIndex = i;
            break;
        }
    }

    siteNameInput.value = siteData.siteName;
    siteUrlInput.value = siteData.siteURL;

    addOrUpdateBookmark('update', false);
}

function displayBookmark(isSearch) {
    if (isSearch !== true) {
        siteArray = JSON.parse(localStorage.getItem('myBookmarkSites'));
    }

    allSitesContainer = '';

    for (var i = 0; i < siteArray.length; i++) {
        allSitesContainer += `<tr>
            <th scope="row">${siteArray[i].siteName}</th>
            <td>
                <a href="${siteArray[i].siteURL}" class="text-decoration-none" target="_blank" alt="${siteArray[i].siteName}">
                    ${siteArray[i].siteURL}
                </a>
            </td>
            <td>
                <button type="button" class="btn btn-warning text-capitalize" onclick="getDataToUpdate(${i})">update</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger text-capitalize" onclick="deleteBookmark(${i})">delete</button>
            </td>
        </tr>`
    }

    tableBody.innerHTML = allSitesContainer;
}

function deleteBookmark(index) {
    siteArray.splice(index, 1);
    localStorage.setItem('myBookmarkSites', JSON.stringify(siteArray));
    displayBookmark();
    alert('Site Deleted Successfully');
}

function searchBookmark(searchTerm) {
    searchArray = [];
    siteArray = JSON.parse(localStorage.getItem('myBookmarkSites'));

    for (var i = 0; i < siteArray.length; i++) {
        if (siteArray[i].siteName.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchArray.push(siteArray[i]);
            console.log('searchArray: ', searchArray);
        }
    }

    if (searchArray.length == 0) {
        siteArray = [];
        console.log('searchArray: ', searchArray);
        console.log('siteArray: ', siteArray);
        displayBookmark(true);
    } else {
        siteArray = searchArray;
        console.log('searchArray: ', searchArray);
        console.log('siteArray: ', siteArray);
        displayBookmark(true);
    }

}

function siteNameValidations() {
    var urlValidate = /^[a-zA-Z][a-zA-Z0-9]{2,}/;
    return urlValidate;
}

function siteUrlValidations() {
    var urlValidate = /^(https:\/\/www\.|http:\/\/www\.|www\.)[a-zA-Z0-9]{2,}\.(com|net|org|gov|edu)$/;
    return urlValidate;
}