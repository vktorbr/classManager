const currentPage = location.pathname;
const links = document.querySelectorAll('.links a');

for (const link of links) {
    if(currentPage.includes(link.getAttribute('href'))){
        link.classList.add('active');
    }
}

//[1, 2, ..., 14, (15), 16, ..., 19, 20]

function paginate(selectedPage, total){
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= total; currentPage++) {
        const firstsAndLastsPage = currentPage == 1 || currentPage == 2 || currentPage == total || currentPage == total - 1; 
        const beforePage = currentPage >= selectedPage - 1;
        const afterPage = currentPage <= selectedPage + 1;

        if(firstsAndLastsPage || (beforePage && afterPage)){

            if(oldPage && (currentPage - oldPage) > 2){
                pages.push("...");
            }

            if(oldPage && (currentPage - oldPage == 2)){
                pages.push(currentPage - 1);
            }

            pages.push(currentPage);
            oldPage = currentPage;
        }
    }

    return pages;
}

function createPagination(pagination){
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.page;
    const filter = pagination.dataset.filter;
    const pages = paginate(page, total);

    let elements = "";

    for (const page of pages) {
        if(String(page).includes("...")){
            elements += `<span>${page}</span>`;
        }else{
            if(filter){
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
            }else{
                elements += `<a href="?page=${page}">${page}</a>`;
            }
        }
    }

    pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");

if(pagination){
    createPagination(pagination);
}

