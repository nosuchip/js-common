this.common = this.common || {};

common.Modal = function Modal(config) {
    var self = this;

    var defaultConfig = {
        modalId: null,
        appendTo: 'body',
        modalOptions: {},
        renderOnDemand: true,
        destroyOnHide: true,
        templates: {
            //Templates to replace corresponding nodes
            modal: '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal-header-text">' +
                     '<div class="modal-dialog" role="document">' +
                       '<div class="modal-content">' +
                         '<div class="modal-header">' +
                           '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                               '<span aria-hidden="true">&times;</span>' +
                           '</button>' +
                           '<h4 class="modal-title" id="modal-header-text">Modal title</h4>' +
                         '</div>' +
                         '<div class="modal-body">' +
                         '</div>' +
                         '<div class="modal-footer">' +
                           '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                           '<button type="button" class="btn btn-primary">Save changes</button>' +
                         '</div>' +
                       '</div>' +
                     '</div>' +
                   '</div>',
            header: null,
            body: null,
            footer: null
        },
        classes: {
            // Classes to be added to corresponding nodes
            modal: '',
            header: '',
            body: '',
            footer: ''
        },
        selectors: {
            // Selectors to access corresponding nodes
            header: '.modal-header',
            body: '.modal-body',
            footer: '.modal-footer'
        },
        handlers: {
            show: null,
            shown: null,
            hide: null,
            hidden: null,
            buttons: [/*{selector: .ok-button, handler: $.noop}*/]
        },
        buttons: [
        /*  { template: null, selector: .ok-button, handler: $.noop }, { template: null, handler: $.noop }, ... */
        ]
    };

    var config = $.extend(true, defaultConfig, config);
    var isRendered = false;
    var $root = null;

    // Public members
    self.modalId = config.modalId ? config.modalId : ('modal-' + common.uuid());

    function getTemplate(template) {
        return $.isFunction(template) ? template() : template;
    }

    // Public methods

    self.render = function() {
        if (!config.templates.modal) {
            return;
        }

        if (!$root) {
            $root = $(getTemplate(config.templates.modal))
            $root.css('display', 'none');
            $root.appendTo(config.appendTo);
            $root.hide();
        }

        if (!config.modalId || !$root.attr('id') || $root.attr('id').indexOf(config.modalId) === -1 ) {
            $root.attr('id', self.modalId);
        }

        if (!$root.data('dynamic-modal')) {
            $root.data('dynamic-modal', self);
        }

        ['header', 'body', 'footer'].forEach(function(item) {
            if (config.templates[item]) {
                $(config.selectors[item], $root).html(
                    getTemplate(confin.templates[item])
                );
            }

            if (config.classes[item]) {
                $(config.selectors[item], $root).addClass(config.classes[item]);
            }
        });

        if (config.handlers) {
            ['show', 'shown', 'hide', 'hidden'].forEach(function(item) {
                $root.off(item + '.bs.modal').on(item + '.bs.modal', config.handlers[item]);
            });

            if (config.handlers.buttons.length && !config.buttons.length) {
                config.handlers.buttons.forEach(function(item) {
                    (config.selectors.footer, $root).find(item.selector).on('click', item.handler);
                })
            }
        }

        if (config.destroyOnHide) {
            $root.on('hidden.bs.modal', self.destroy);
        }

        if (config.buttons.length) {
            $(config.selectors.footer, $root).html('');

            config.buttons.forEach(function(item) {
                $(config.selectors.footer, $root).append(getTemplate(item));

                if (item.selectors) {
                    $(config.selectors.footer, $root).childred().last().find(item.selector)
                        .on('click', item.handler);
                } else {
                    $(config.selectors.footer, $root).childred().last().on('click', item.handler);
                }
            });
        }

        isRendered = true;
    };

    self.show = function(e) {
        if (!isRendered) {
            self.render();
        }

        $('#' + self.modalId).modal(config.modalOptions);
    };

    self.hide = function(e) {
        $('#' + self.modalId).modal('hide');
    };

    self.destroy = function() {
        self.hide();
        $root.data('modal', null);
        $root.data('dynamic-modal', null);
        $root.remove();
    }

    self.init = function() {
        if (!config.renderOnDemand) {
            self.render();
        }
    };
};
