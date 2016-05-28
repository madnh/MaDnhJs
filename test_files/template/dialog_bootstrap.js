function dialogWithoutHeader() {
    _.M.Dialog.alert('Ahihi', {
        template: {
            has_header: false
        }
    });
}

function dialogRightButton() {
    _.M.Dialog.alert('Ahihi', {
        template: {
            buttons_align: 'left'
        }
    });
}

function dialogWithPendingInfo() {
    _.M.Dialog.alert('Ahihi', {
        template: {
            pending_info: 'Ahihihi'
        }
    });
}

function dialogiFramteWithoutPadding(normal, has_footer) {
    _.M.Dialog.iFrame('https://www.youtube.com/embed/oofSnsGkops?autoplay=1', {
        attributes: {
            allowfullscreen: true
        },
        template: {
            padding: _.isUndefined(normal) || normal,
            has_footer: _.isUndefined(has_footer) || has_footer
        }
    });
}