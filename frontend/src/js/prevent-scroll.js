document.querySelector('.aside-left').addEventListener('wheel', preventScroll);

function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    return false;
}