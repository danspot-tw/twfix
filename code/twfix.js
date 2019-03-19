// This script borrows heavily (basically copies) from "Drumpfinator"
// h/t to Mark Monteiro
// please see "LICENSE-mit-drumpfinator.txt"

// Wait for document ready before executing main function
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        main();
    }
}, 10);

function main() {
    // Replace page title text
    document.title = chtpeFixText(document.title);
    document.title = twchFixText(document.title);
    document.title = chtwFixText(document.title);
    document.title = charTradFixText(document.title);


    // Replace all initial text and images on page
    twFixMain(document.body);

    // Create a mutation observer to monitor the DOM for changes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            Array.prototype.slice.call(mutation.addedNodes).forEach(twFixMain);
        });
    });

    // Configure and start the observer
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}

function twFixMain(node) {

    // Do nothing for nodes contained in a Google Docs editor (sorry I.E. no support for you)
    if(node.closest && node.closest('.kix-appview')) return;

    // Create a tree walker to traverse all text nodes
    var walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Reject contentEditable nodes
                return (node.parentElement && node.parentElement.isContentEditable) ?
                    NodeFilter.FILTER_SKIP :
                    NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    // Replace all text nodes
    var textNode;
    while(textNode = walker.nextNode()) {
        textNode.nodeValue = chtpeFixText(textNode.nodeValue);
        textNode.nodeValue = twchFixText(textNode.nodeValue);
        textNode.nodeValue = chtwFixText(textNode.nodeValue);
        textNode.nodeValue = charTradFixText(textNode.nodeValue);
    }


    var twFlagImage = "https://i.imgur.com/ofpBsof.png";

    // regex for images
    const imgRegex = /chinese\w*taipei\w*\.(png|gif|jpg)/gi;
// list all images
// for each src
// edit and update
    var images = document.images;
    for (var i = 0, l = images.length; i < l; i++) {
        if (images[i].src.match(imgRegex)) {
            images[i].src = twFlagImage;
        }
    }
}

function chtpeFixText(text) {
    const chtpeRegex = /Chinese\s+Taipei\s*(region)*/gi;
    return text.replace(chtpeRegex, "Taiwan");
}

function twchFixText (text) {
    const twchRegex = /Taiwan\s*,*\s*(Province of|Province)*\s*,*\s*China/gi;
//    const twchRegex = /Taiwan\s*region,?\s*China/gi;
    return text.replace(twchRegex, "Taiwan");
}

function chtwFixText (text) {
    const chtwRegex = /China\s+Taiwan\s*region*/gi;
    return text.replace(chtwRegex, "Taiwan");
}

function charTradFixText (text) {
    const charTradRegex = /中國台灣|中国台湾|中國臺灣省|中國臺灣|中国台湾省|中国台湾/g;
    return text.replace(charTradRegex, "台灣");
}
