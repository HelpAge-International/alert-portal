"use strict";

function country_removed() {
    var countries = $("#countries_parent select");
    if (countries.length <= 1) {
        $(".remove_field").hide();
    } else {
        $(".remove_field").show();
    }
}

function gpaActionChanged(element) {
    var addActionButton = $("#add-action-btn");
    if (element.checked) {
        addActionButton.removeClass("disabled");
        $(element).parent().parent().find(".gpa_action_department").show();
    } else {
        $(element).parent().parent().find(".gpa_action_department").hide();
        var i = 0;
        $("input[name=gpa_action]:checked").each(function() {
            i++;
        });
        if (i < 1) {
            addActionButton.addClass("disabled");
        }
    }
}

function addDepartmentModal(select, modal_id) {
    if ($(select).find(":selected").hasClass("add-department")) {
        $(modal_id).modal("show");
    }
}

"use strict";

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $(".Agency-details__logo__preview").css("background-image", "url(" + e.target.result + ")");
            $(".Agency-details__logo__preview").addClass("Selected");
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function previewLogo(logoImage) {
    readURL(logoImage);
    $("#select-logo").hide();
    $("#replace-logo").show();
    $("#remove-logo").show();
}

function triggerPreviewLogo(e) {
    e.preventDefault();
    $("#imgInp").trigger("click");
}

function removeLogoPreview(e) {
    e.preventDefault();
    $("#replace-logo").hide();
    $("#remove-logo").hide();
    $("#select-logo").show();
    $(".Agency-details__logo__preview").css("background-image", "none");
    $(".Agency-details__logo__preview").removeClass("Selected");
}

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");

+function(t) {
    var e = t.fn.jquery.split(" ")[0].split(".");
    if (e[0] < 2 && e[1] < 9 || 1 == e[0] && 9 == e[1] && e[2] < 1 || e[0] >= 4) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0");
}(jQuery), +function() {
    function t(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }
    function e(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));
        t.prototype = Object.create(e && e.prototype, {
            constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }
    function n(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }
    var i = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
        return typeof t === "undefined" ? "undefined" : _typeof(t);
    } : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
    }, o = function() {
        function t(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), 
                Object.defineProperty(t, i.key, i);
            }
        }
        return function(e, n, i) {
            return n && t(e.prototype, n), i && t(e, i), e;
        };
    }(), r = function(t) {
        function e(t) {
            return {}.toString.call(t).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        }
        function n(t) {
            return (t[0] || t).nodeType;
        }
        function i() {
            return {
                bindType: a.end,
                delegateType: a.end,
                handle: function handle(e) {
                    if (t(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
                }
            };
        }
        function o() {
            if (window.QUnit) return !1;
            var t = document.createElement("bootstrap");
            for (var e in h) {
                if (void 0 !== t.style[e]) return {
                    end: h[e]
                };
            }
            return !1;
        }
        function r(e) {
            var n = this, i = !1;
            return t(this).one(c.TRANSITION_END, function() {
                i = !0;
            }), setTimeout(function() {
                i || c.triggerTransitionEnd(n);
            }, e), this;
        }
        function s() {
            a = o(), t.fn.emulateTransitionEnd = r, c.supportsTransitionEnd() && (t.event.special[c.TRANSITION_END] = i());
        }
        var a = !1, l = 1e6, h = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        }, c = {
            TRANSITION_END: "bsTransitionEnd",
            getUID: function getUID(t) {
                do {
                    t += ~~(Math.random() * l);
                } while (document.getElementById(t));
                return t;
            },
            getSelectorFromElement: function getSelectorFromElement(t) {
                var e = t.getAttribute("data-target");
                return e || (e = t.getAttribute("href") || "", e = /^#[a-z]/i.test(e) ? e : null), 
                e;
            },
            reflow: function reflow(t) {
                return t.offsetHeight;
            },
            triggerTransitionEnd: function triggerTransitionEnd(e) {
                t(e).trigger(a.end);
            },
            supportsTransitionEnd: function supportsTransitionEnd() {
                return Boolean(a);
            },
            typeCheckConfig: function typeCheckConfig(t, i, o) {
                for (var r in o) {
                    if (o.hasOwnProperty(r)) {
                        var s = o[r], a = i[r], l = a && n(a) ? "element" : e(a);
                        if (!new RegExp(s).test(l)) throw new Error(t.toUpperCase() + ": " + ('Option "' + r + '" provided type "' + l + '" ') + ('but expected type "' + s + '".'));
                    }
                }
            }
        };
        return s(), c;
    }(jQuery), s = (function(t) {
        var e = "alert", i = "4.0.0-alpha.6", s = "bs.alert", a = "." + s, l = ".data-api", h = t.fn[e], c = 150, u = {
            DISMISS: '[data-dismiss="alert"]'
        }, d = {
            CLOSE: "close" + a,
            CLOSED: "closed" + a,
            CLICK_DATA_API: "click" + a + l
        }, f = {
            ALERT: "alert",
            FADE: "fade",
            SHOW: "show"
        }, _ = function() {
            function e(t) {
                n(this, e), this._element = t;
            }
            return e.prototype.close = function(t) {
                t = t || this._element;
                var e = this._getRootElement(t), n = this._triggerCloseEvent(e);
                n.isDefaultPrevented() || this._removeElement(e);
            }, e.prototype.dispose = function() {
                t.removeData(this._element, s), this._element = null;
            }, e.prototype._getRootElement = function(e) {
                var n = r.getSelectorFromElement(e), i = !1;
                return n && (i = t(n)[0]), i || (i = t(e).closest("." + f.ALERT)[0]), i;
            }, e.prototype._triggerCloseEvent = function(e) {
                var n = t.Event(d.CLOSE);
                return t(e).trigger(n), n;
            }, e.prototype._removeElement = function(e) {
                var n = this;
                return t(e).removeClass(f.SHOW), r.supportsTransitionEnd() && t(e).hasClass(f.FADE) ? void t(e).one(r.TRANSITION_END, function(t) {
                    return n._destroyElement(e, t);
                }).emulateTransitionEnd(c) : void this._destroyElement(e);
            }, e.prototype._destroyElement = function(e) {
                t(e).detach().trigger(d.CLOSED).remove();
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this), o = i.data(s);
                    o || (o = new e(this), i.data(s, o)), "close" === n && o[n](this);
                });
            }, e._handleDismiss = function(t) {
                return function(e) {
                    e && e.preventDefault(), t.close(this);
                };
            }, o(e, null, [ {
                key: "VERSION",
                get: function get() {
                    return i;
                }
            } ]), e;
        }();
        return t(document).on(d.CLICK_DATA_API, u.DISMISS, _._handleDismiss(new _())), t.fn[e] = _._jQueryInterface, 
        t.fn[e].Constructor = _, t.fn[e].noConflict = function() {
            return t.fn[e] = h, _._jQueryInterface;
        }, _;
    }(jQuery), function(t) {
        var e = "button", i = "4.0.0-alpha.6", r = "bs.button", s = "." + r, a = ".data-api", l = t.fn[e], h = {
            ACTIVE: "active",
            BUTTON: "btn",
            FOCUS: "focus"
        }, c = {
            DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
            DATA_TOGGLE: '[data-toggle="buttons"]',
            INPUT: "input",
            ACTIVE: ".active",
            BUTTON: ".btn"
        }, u = {
            CLICK_DATA_API: "click" + s + a,
            FOCUS_BLUR_DATA_API: "focus" + s + a + " " + ("blur" + s + a)
        }, d = function() {
            function e(t) {
                n(this, e), this._element = t;
            }
            return e.prototype.toggle = function() {
                var e = !0, n = t(this._element).closest(c.DATA_TOGGLE)[0];
                if (n) {
                    var i = t(this._element).find(c.INPUT)[0];
                    if (i) {
                        if ("radio" === i.type) if (i.checked && t(this._element).hasClass(h.ACTIVE)) e = !1; else {
                            var o = t(n).find(c.ACTIVE)[0];
                            o && t(o).removeClass(h.ACTIVE);
                        }
                        e && (i.checked = !t(this._element).hasClass(h.ACTIVE), t(i).trigger("change")), 
                        i.focus();
                    }
                }
                this._element.setAttribute("aria-pressed", !t(this._element).hasClass(h.ACTIVE)), 
                e && t(this._element).toggleClass(h.ACTIVE);
            }, e.prototype.dispose = function() {
                t.removeData(this._element, r), this._element = null;
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this).data(r);
                    i || (i = new e(this), t(this).data(r, i)), "toggle" === n && i[n]();
                });
            }, o(e, null, [ {
                key: "VERSION",
                get: function get() {
                    return i;
                }
            } ]), e;
        }();
        return t(document).on(u.CLICK_DATA_API, c.DATA_TOGGLE_CARROT, function(e) {
            e.preventDefault();
            var n = e.target;
            t(n).hasClass(h.BUTTON) || (n = t(n).closest(c.BUTTON)), d._jQueryInterface.call(t(n), "toggle");
        }).on(u.FOCUS_BLUR_DATA_API, c.DATA_TOGGLE_CARROT, function(e) {
            var n = t(e.target).closest(c.BUTTON)[0];
            t(n).toggleClass(h.FOCUS, /^focus(in)?$/.test(e.type));
        }), t.fn[e] = d._jQueryInterface, t.fn[e].Constructor = d, t.fn[e].noConflict = function() {
            return t.fn[e] = l, d._jQueryInterface;
        }, d;
    }(jQuery), function(t) {
        var e = "carousel", s = "4.0.0-alpha.6", a = "bs.carousel", l = "." + a, h = ".data-api", c = t.fn[e], u = 600, d = 37, f = 39, _ = {
            interval: 5e3,
            keyboard: !0,
            slide: !1,
            pause: "hover",
            wrap: !0
        }, g = {
            interval: "(number|boolean)",
            keyboard: "boolean",
            slide: "(boolean|string)",
            pause: "(string|boolean)",
            wrap: "boolean"
        }, p = {
            NEXT: "next",
            PREV: "prev",
            LEFT: "left",
            RIGHT: "right"
        }, m = {
            SLIDE: "slide" + l,
            SLID: "slid" + l,
            KEYDOWN: "keydown" + l,
            MOUSEENTER: "mouseenter" + l,
            MOUSELEAVE: "mouseleave" + l,
            LOAD_DATA_API: "load" + l + h,
            CLICK_DATA_API: "click" + l + h
        }, E = {
            CAROUSEL: "carousel",
            ACTIVE: "active",
            SLIDE: "slide",
            RIGHT: "carousel-item-right",
            LEFT: "carousel-item-left",
            NEXT: "carousel-item-next",
            PREV: "carousel-item-prev",
            ITEM: "carousel-item"
        }, v = {
            ACTIVE: ".active",
            ACTIVE_ITEM: ".active.carousel-item",
            ITEM: ".carousel-item",
            NEXT_PREV: ".carousel-item-next, .carousel-item-prev",
            INDICATORS: ".carousel-indicators",
            DATA_SLIDE: "[data-slide], [data-slide-to]",
            DATA_RIDE: '[data-ride="carousel"]'
        }, T = function() {
            function h(e, i) {
                n(this, h), this._items = null, this._interval = null, this._activeElement = null, 
                this._isPaused = !1, this._isSliding = !1, this._config = this._getConfig(i), this._element = t(e)[0], 
                this._indicatorsElement = t(this._element).find(v.INDICATORS)[0], this._addEventListeners();
            }
            return h.prototype.next = function() {
                if (this._isSliding) throw new Error("Carousel is sliding");
                this._slide(p.NEXT);
            }, h.prototype.nextWhenVisible = function() {
                document.hidden || this.next();
            }, h.prototype.prev = function() {
                if (this._isSliding) throw new Error("Carousel is sliding");
                this._slide(p.PREVIOUS);
            }, h.prototype.pause = function(e) {
                e || (this._isPaused = !0), t(this._element).find(v.NEXT_PREV)[0] && r.supportsTransitionEnd() && (r.triggerTransitionEnd(this._element), 
                this.cycle(!0)), clearInterval(this._interval), this._interval = null;
            }, h.prototype.cycle = function(t) {
                t || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), 
                this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval));
            }, h.prototype.to = function(e) {
                var n = this;
                this._activeElement = t(this._element).find(v.ACTIVE_ITEM)[0];
                var i = this._getItemIndex(this._activeElement);
                if (!(e > this._items.length - 1 || e < 0)) {
                    if (this._isSliding) return void t(this._element).one(m.SLID, function() {
                        return n.to(e);
                    });
                    if (i === e) return this.pause(), void this.cycle();
                    var o = e > i ? p.NEXT : p.PREVIOUS;
                    this._slide(o, this._items[e]);
                }
            }, h.prototype.dispose = function() {
                t(this._element).off(l), t.removeData(this._element, a), this._items = null, this._config = null, 
                this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, 
                this._activeElement = null, this._indicatorsElement = null;
            }, h.prototype._getConfig = function(n) {
                return n = t.extend({}, _, n), r.typeCheckConfig(e, n, g), n;
            }, h.prototype._addEventListeners = function() {
                var e = this;
                this._config.keyboard && t(this._element).on(m.KEYDOWN, function(t) {
                    return e._keydown(t);
                }), "hover" !== this._config.pause || "ontouchstart" in document.documentElement || t(this._element).on(m.MOUSEENTER, function(t) {
                    return e.pause(t);
                }).on(m.MOUSELEAVE, function(t) {
                    return e.cycle(t);
                });
            }, h.prototype._keydown = function(t) {
                if (!/input|textarea/i.test(t.target.tagName)) switch (t.which) {
                  case d:
                    t.preventDefault(), this.prev();
                    break;

                  case f:
                    t.preventDefault(), this.next();
                    break;

                  default:
                    return;
                }
            }, h.prototype._getItemIndex = function(e) {
                return this._items = t.makeArray(t(e).parent().find(v.ITEM)), this._items.indexOf(e);
            }, h.prototype._getItemByDirection = function(t, e) {
                var n = t === p.NEXT, i = t === p.PREVIOUS, o = this._getItemIndex(e), r = this._items.length - 1, s = i && 0 === o || n && o === r;
                if (s && !this._config.wrap) return e;
                var a = t === p.PREVIOUS ? -1 : 1, l = (o + a) % this._items.length;
                return l === -1 ? this._items[this._items.length - 1] : this._items[l];
            }, h.prototype._triggerSlideEvent = function(e, n) {
                var i = t.Event(m.SLIDE, {
                    relatedTarget: e,
                    direction: n
                });
                return t(this._element).trigger(i), i;
            }, h.prototype._setActiveIndicatorElement = function(e) {
                if (this._indicatorsElement) {
                    t(this._indicatorsElement).find(v.ACTIVE).removeClass(E.ACTIVE);
                    var n = this._indicatorsElement.children[this._getItemIndex(e)];
                    n && t(n).addClass(E.ACTIVE);
                }
            }, h.prototype._slide = function(e, n) {
                var i = this, o = t(this._element).find(v.ACTIVE_ITEM)[0], s = n || o && this._getItemByDirection(e, o), a = Boolean(this._interval), l = void 0, h = void 0, c = void 0;
                if (e === p.NEXT ? (l = E.LEFT, h = E.NEXT, c = p.LEFT) : (l = E.RIGHT, h = E.PREV, 
                c = p.RIGHT), s && t(s).hasClass(E.ACTIVE)) return void (this._isSliding = !1);
                var d = this._triggerSlideEvent(s, c);
                if (!d.isDefaultPrevented() && o && s) {
                    this._isSliding = !0, a && this.pause(), this._setActiveIndicatorElement(s);
                    var f = t.Event(m.SLID, {
                        relatedTarget: s,
                        direction: c
                    });
                    r.supportsTransitionEnd() && t(this._element).hasClass(E.SLIDE) ? (t(s).addClass(h), 
                    r.reflow(s), t(o).addClass(l), t(s).addClass(l), t(o).one(r.TRANSITION_END, function() {
                        t(s).removeClass(l + " " + h).addClass(E.ACTIVE), t(o).removeClass(E.ACTIVE + " " + h + " " + l), 
                        i._isSliding = !1, setTimeout(function() {
                            return t(i._element).trigger(f);
                        }, 0);
                    }).emulateTransitionEnd(u)) : (t(o).removeClass(E.ACTIVE), t(s).addClass(E.ACTIVE), 
                    this._isSliding = !1, t(this._element).trigger(f)), a && this.cycle();
                }
            }, h._jQueryInterface = function(e) {
                return this.each(function() {
                    var n = t(this).data(a), o = t.extend({}, _, t(this).data());
                    "object" === ("undefined" == typeof e ? "undefined" : i(e)) && t.extend(o, e);
                    var r = "string" == typeof e ? e : o.slide;
                    if (n || (n = new h(this, o), t(this).data(a, n)), "number" == typeof e) n.to(e); else if ("string" == typeof r) {
                        if (void 0 === n[r]) throw new Error('No method named "' + r + '"');
                        n[r]();
                    } else o.interval && (n.pause(), n.cycle());
                });
            }, h._dataApiClickHandler = function(e) {
                var n = r.getSelectorFromElement(this);
                if (n) {
                    var i = t(n)[0];
                    if (i && t(i).hasClass(E.CAROUSEL)) {
                        var o = t.extend({}, t(i).data(), t(this).data()), s = this.getAttribute("data-slide-to");
                        s && (o.interval = !1), h._jQueryInterface.call(t(i), o), s && t(i).data(a).to(s), 
                        e.preventDefault();
                    }
                }
            }, o(h, null, [ {
                key: "VERSION",
                get: function get() {
                    return s;
                }
            }, {
                key: "Default",
                get: function get() {
                    return _;
                }
            } ]), h;
        }();
        return t(document).on(m.CLICK_DATA_API, v.DATA_SLIDE, T._dataApiClickHandler), t(window).on(m.LOAD_DATA_API, function() {
            t(v.DATA_RIDE).each(function() {
                var e = t(this);
                T._jQueryInterface.call(e, e.data());
            });
        }), t.fn[e] = T._jQueryInterface, t.fn[e].Constructor = T, t.fn[e].noConflict = function() {
            return t.fn[e] = c, T._jQueryInterface;
        }, T;
    }(jQuery), function(t) {
        var e = "collapse", s = "4.0.0-alpha.6", a = "bs.collapse", l = "." + a, h = ".data-api", c = t.fn[e], u = 600, d = {
            toggle: !0,
            parent: ""
        }, f = {
            toggle: "boolean",
            parent: "string"
        }, _ = {
            SHOW: "show" + l,
            SHOWN: "shown" + l,
            HIDE: "hide" + l,
            HIDDEN: "hidden" + l,
            CLICK_DATA_API: "click" + l + h
        }, g = {
            SHOW: "show",
            COLLAPSE: "collapse",
            COLLAPSING: "collapsing",
            COLLAPSED: "collapsed"
        }, p = {
            WIDTH: "width",
            HEIGHT: "height"
        }, m = {
            ACTIVES: ".card > .show, .card > .collapsing",
            DATA_TOGGLE: '[data-toggle="collapse"]'
        }, E = function() {
            function l(e, i) {
                n(this, l), this._isTransitioning = !1, this._element = e, this._config = this._getConfig(i), 
                this._triggerArray = t.makeArray(t('[data-toggle="collapse"][href="#' + e.id + '"],' + ('[data-toggle="collapse"][data-target="#' + e.id + '"]'))), 
                this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), 
                this._config.toggle && this.toggle();
            }
            return l.prototype.toggle = function() {
                t(this._element).hasClass(g.SHOW) ? this.hide() : this.show();
            }, l.prototype.show = function() {
                var e = this;
                if (this._isTransitioning) throw new Error("Collapse is transitioning");
                if (!t(this._element).hasClass(g.SHOW)) {
                    var n = void 0, i = void 0;
                    if (this._parent && (n = t.makeArray(t(this._parent).find(m.ACTIVES)), n.length || (n = null)), 
                    !(n && (i = t(n).data(a), i && i._isTransitioning))) {
                        var o = t.Event(_.SHOW);
                        if (t(this._element).trigger(o), !o.isDefaultPrevented()) {
                            n && (l._jQueryInterface.call(t(n), "hide"), i || t(n).data(a, null));
                            var s = this._getDimension();
                            t(this._element).removeClass(g.COLLAPSE).addClass(g.COLLAPSING), this._element.style[s] = 0, 
                            this._element.setAttribute("aria-expanded", !0), this._triggerArray.length && t(this._triggerArray).removeClass(g.COLLAPSED).attr("aria-expanded", !0), 
                            this.setTransitioning(!0);
                            var h = function h() {
                                t(e._element).removeClass(g.COLLAPSING).addClass(g.COLLAPSE).addClass(g.SHOW), e._element.style[s] = "", 
                                e.setTransitioning(!1), t(e._element).trigger(_.SHOWN);
                            };
                            if (!r.supportsTransitionEnd()) return void h();
                            var c = s[0].toUpperCase() + s.slice(1), d = "scroll" + c;
                            t(this._element).one(r.TRANSITION_END, h).emulateTransitionEnd(u), this._element.style[s] = this._element[d] + "px";
                        }
                    }
                }
            }, l.prototype.hide = function() {
                var e = this;
                if (this._isTransitioning) throw new Error("Collapse is transitioning");
                if (t(this._element).hasClass(g.SHOW)) {
                    var n = t.Event(_.HIDE);
                    if (t(this._element).trigger(n), !n.isDefaultPrevented()) {
                        var i = this._getDimension(), o = i === p.WIDTH ? "offsetWidth" : "offsetHeight";
                        this._element.style[i] = this._element[o] + "px", r.reflow(this._element), t(this._element).addClass(g.COLLAPSING).removeClass(g.COLLAPSE).removeClass(g.SHOW), 
                        this._element.setAttribute("aria-expanded", !1), this._triggerArray.length && t(this._triggerArray).addClass(g.COLLAPSED).attr("aria-expanded", !1), 
                        this.setTransitioning(!0);
                        var s = function s() {
                            e.setTransitioning(!1), t(e._element).removeClass(g.COLLAPSING).addClass(g.COLLAPSE).trigger(_.HIDDEN);
                        };
                        return this._element.style[i] = "", r.supportsTransitionEnd() ? void t(this._element).one(r.TRANSITION_END, s).emulateTransitionEnd(u) : void s();
                    }
                }
            }, l.prototype.setTransitioning = function(t) {
                this._isTransitioning = t;
            }, l.prototype.dispose = function() {
                t.removeData(this._element, a), this._config = null, this._parent = null, this._element = null, 
                this._triggerArray = null, this._isTransitioning = null;
            }, l.prototype._getConfig = function(n) {
                return n = t.extend({}, d, n), n.toggle = Boolean(n.toggle), r.typeCheckConfig(e, n, f), 
                n;
            }, l.prototype._getDimension = function() {
                var e = t(this._element).hasClass(p.WIDTH);
                return e ? p.WIDTH : p.HEIGHT;
            }, l.prototype._getParent = function() {
                var e = this, n = t(this._config.parent)[0], i = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]';
                return t(n).find(i).each(function(t, n) {
                    e._addAriaAndCollapsedClass(l._getTargetFromElement(n), [ n ]);
                }), n;
            }, l.prototype._addAriaAndCollapsedClass = function(e, n) {
                if (e) {
                    var i = t(e).hasClass(g.SHOW);
                    e.setAttribute("aria-expanded", i), n.length && t(n).toggleClass(g.COLLAPSED, !i).attr("aria-expanded", i);
                }
            }, l._getTargetFromElement = function(e) {
                var n = r.getSelectorFromElement(e);
                return n ? t(n)[0] : null;
            }, l._jQueryInterface = function(e) {
                return this.each(function() {
                    var n = t(this), o = n.data(a), r = t.extend({}, d, n.data(), "object" === ("undefined" == typeof e ? "undefined" : i(e)) && e);
                    if (!o && r.toggle && /show|hide/.test(e) && (r.toggle = !1), o || (o = new l(this, r), 
                    n.data(a, o)), "string" == typeof e) {
                        if (void 0 === o[e]) throw new Error('No method named "' + e + '"');
                        o[e]();
                    }
                });
            }, o(l, null, [ {
                key: "VERSION",
                get: function get() {
                    return s;
                }
            }, {
                key: "Default",
                get: function get() {
                    return d;
                }
            } ]), l;
        }();
        return t(document).on(_.CLICK_DATA_API, m.DATA_TOGGLE, function(e) {
            e.preventDefault();
            var n = E._getTargetFromElement(this), i = t(n).data(a), o = i ? "toggle" : t(this).data();
            E._jQueryInterface.call(t(n), o);
        }), t.fn[e] = E._jQueryInterface, t.fn[e].Constructor = E, t.fn[e].noConflict = function() {
            return t.fn[e] = c, E._jQueryInterface;
        }, E;
    }(jQuery), function(t) {
        var e = "dropdown", i = "4.0.0-alpha.6", s = "bs.dropdown", a = "." + s, l = ".data-api", h = t.fn[e], c = 27, u = 38, d = 40, f = 3, _ = {
            HIDE: "hide" + a,
            HIDDEN: "hidden" + a,
            SHOW: "show" + a,
            SHOWN: "shown" + a,
            CLICK: "click" + a,
            CLICK_DATA_API: "click" + a + l,
            FOCUSIN_DATA_API: "focusin" + a + l,
            KEYDOWN_DATA_API: "keydown" + a + l
        }, g = {
            BACKDROP: "dropdown-backdrop",
            DISABLED: "disabled",
            SHOW: "show"
        }, p = {
            BACKDROP: ".dropdown-backdrop",
            DATA_TOGGLE: '[data-toggle="dropdown"]',
            FORM_CHILD: ".dropdown form",
            ROLE_MENU: '[role="menu"]',
            ROLE_LISTBOX: '[role="listbox"]',
            NAVBAR_NAV: ".navbar-nav",
            VISIBLE_ITEMS: '[role="menu"] li:not(.disabled) a, [role="listbox"] li:not(.disabled) a'
        }, m = function() {
            function e(t) {
                n(this, e), this._element = t, this._addEventListeners();
            }
            return e.prototype.toggle = function() {
                if (this.disabled || t(this).hasClass(g.DISABLED)) return !1;
                var n = e._getParentFromElement(this), i = t(n).hasClass(g.SHOW);
                if (e._clearMenus(), i) return !1;
                if ("ontouchstart" in document.documentElement && !t(n).closest(p.NAVBAR_NAV).length) {
                    var o = document.createElement("div");
                    o.className = g.BACKDROP, t(o).insertBefore(this), t(o).on("click", e._clearMenus);
                }
                var r = {
                    relatedTarget: this
                }, s = t.Event(_.SHOW, r);
                return t(n).trigger(s), !s.isDefaultPrevented() && (this.focus(), this.setAttribute("aria-expanded", !0), 
                t(n).toggleClass(g.SHOW), t(n).trigger(t.Event(_.SHOWN, r)), !1);
            }, e.prototype.dispose = function() {
                t.removeData(this._element, s), t(this._element).off(a), this._element = null;
            }, e.prototype._addEventListeners = function() {
                t(this._element).on(_.CLICK, this.toggle);
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this).data(s);
                    if (i || (i = new e(this), t(this).data(s, i)), "string" == typeof n) {
                        if (void 0 === i[n]) throw new Error('No method named "' + n + '"');
                        i[n].call(this);
                    }
                });
            }, e._clearMenus = function(n) {
                if (!n || n.which !== f) {
                    var i = t(p.BACKDROP)[0];
                    i && i.parentNode.removeChild(i);
                    for (var o = t.makeArray(t(p.DATA_TOGGLE)), r = 0; r < o.length; r++) {
                        var s = e._getParentFromElement(o[r]), a = {
                            relatedTarget: o[r]
                        };
                        if (t(s).hasClass(g.SHOW) && !(n && ("click" === n.type && /input|textarea/i.test(n.target.tagName) || "focusin" === n.type) && t.contains(s, n.target))) {
                            var l = t.Event(_.HIDE, a);
                            t(s).trigger(l), l.isDefaultPrevented() || (o[r].setAttribute("aria-expanded", "false"), 
                            t(s).removeClass(g.SHOW).trigger(t.Event(_.HIDDEN, a)));
                        }
                    }
                }
            }, e._getParentFromElement = function(e) {
                var n = void 0, i = r.getSelectorFromElement(e);
                return i && (n = t(i)[0]), n || e.parentNode;
            }, e._dataApiKeydownHandler = function(n) {
                if (/(38|40|27|32)/.test(n.which) && !/input|textarea/i.test(n.target.tagName) && (n.preventDefault(), 
                n.stopPropagation(), !this.disabled && !t(this).hasClass(g.DISABLED))) {
                    var i = e._getParentFromElement(this), o = t(i).hasClass(g.SHOW);
                    if (!o && n.which !== c || o && n.which === c) {
                        if (n.which === c) {
                            var r = t(i).find(p.DATA_TOGGLE)[0];
                            t(r).trigger("focus");
                        }
                        return void t(this).trigger("click");
                    }
                    var s = t(i).find(p.VISIBLE_ITEMS).get();
                    if (s.length) {
                        var a = s.indexOf(n.target);
                        n.which === u && a > 0 && a--, n.which === d && a < s.length - 1 && a++, a < 0 && (a = 0), 
                        s[a].focus();
                    }
                }
            }, o(e, null, [ {
                key: "VERSION",
                get: function get() {
                    return i;
                }
            } ]), e;
        }();
        return t(document).on(_.KEYDOWN_DATA_API, p.DATA_TOGGLE, m._dataApiKeydownHandler).on(_.KEYDOWN_DATA_API, p.ROLE_MENU, m._dataApiKeydownHandler).on(_.KEYDOWN_DATA_API, p.ROLE_LISTBOX, m._dataApiKeydownHandler).on(_.CLICK_DATA_API + " " + _.FOCUSIN_DATA_API, m._clearMenus).on(_.CLICK_DATA_API, p.DATA_TOGGLE, m.prototype.toggle).on(_.CLICK_DATA_API, p.FORM_CHILD, function(t) {
            t.stopPropagation();
        }), t.fn[e] = m._jQueryInterface, t.fn[e].Constructor = m, t.fn[e].noConflict = function() {
            return t.fn[e] = h, m._jQueryInterface;
        }, m;
    }(jQuery), function(t) {
        var e = "modal", s = "4.0.0-alpha.6", a = "bs.modal", l = "." + a, h = ".data-api", c = t.fn[e], u = 300, d = 150, f = 27, _ = {
            backdrop: !0,
            keyboard: !0,
            focus: !0,
            show: !0
        }, g = {
            backdrop: "(boolean|string)",
            keyboard: "boolean",
            focus: "boolean",
            show: "boolean"
        }, p = {
            HIDE: "hide" + l,
            HIDDEN: "hidden" + l,
            SHOW: "show" + l,
            SHOWN: "shown" + l,
            FOCUSIN: "focusin" + l,
            RESIZE: "resize" + l,
            CLICK_DISMISS: "click.dismiss" + l,
            KEYDOWN_DISMISS: "keydown.dismiss" + l,
            MOUSEUP_DISMISS: "mouseup.dismiss" + l,
            MOUSEDOWN_DISMISS: "mousedown.dismiss" + l,
            CLICK_DATA_API: "click" + l + h
        }, m = {
            SCROLLBAR_MEASURER: "modal-scrollbar-measure",
            BACKDROP: "modal-backdrop",
            OPEN: "modal-open",
            FADE: "fade",
            SHOW: "show"
        }, E = {
            DIALOG: ".modal-dialog",
            DATA_TOGGLE: '[data-toggle="modal"]',
            DATA_DISMISS: '[data-dismiss="modal"]',
            FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top"
        }, v = function() {
            function h(e, i) {
                n(this, h), this._config = this._getConfig(i), this._element = e, this._dialog = t(e).find(E.DIALOG)[0], 
                this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, 
                this._isTransitioning = !1, this._originalBodyPadding = 0, this._scrollbarWidth = 0;
            }
            return h.prototype.toggle = function(t) {
                return this._isShown ? this.hide() : this.show(t);
            }, h.prototype.show = function(e) {
                var n = this;
                if (this._isTransitioning) throw new Error("Modal is transitioning");
                r.supportsTransitionEnd() && t(this._element).hasClass(m.FADE) && (this._isTransitioning = !0);
                var i = t.Event(p.SHOW, {
                    relatedTarget: e
                });
                t(this._element).trigger(i), this._isShown || i.isDefaultPrevented() || (this._isShown = !0, 
                this._checkScrollbar(), this._setScrollbar(), t(document.body).addClass(m.OPEN), 
                this._setEscapeEvent(), this._setResizeEvent(), t(this._element).on(p.CLICK_DISMISS, E.DATA_DISMISS, function(t) {
                    return n.hide(t);
                }), t(this._dialog).on(p.MOUSEDOWN_DISMISS, function() {
                    t(n._element).one(p.MOUSEUP_DISMISS, function(e) {
                        t(e.target).is(n._element) && (n._ignoreBackdropClick = !0);
                    });
                }), this._showBackdrop(function() {
                    return n._showElement(e);
                }));
            }, h.prototype.hide = function(e) {
                var n = this;
                if (e && e.preventDefault(), this._isTransitioning) throw new Error("Modal is transitioning");
                var i = r.supportsTransitionEnd() && t(this._element).hasClass(m.FADE);
                i && (this._isTransitioning = !0);
                var o = t.Event(p.HIDE);
                t(this._element).trigger(o), this._isShown && !o.isDefaultPrevented() && (this._isShown = !1, 
                this._setEscapeEvent(), this._setResizeEvent(), t(document).off(p.FOCUSIN), t(this._element).removeClass(m.SHOW), 
                t(this._element).off(p.CLICK_DISMISS), t(this._dialog).off(p.MOUSEDOWN_DISMISS), 
                i ? t(this._element).one(r.TRANSITION_END, function(t) {
                    return n._hideModal(t);
                }).emulateTransitionEnd(u) : this._hideModal());
            }, h.prototype.dispose = function() {
                t.removeData(this._element, a), t(window, document, this._element, this._backdrop).off(l), 
                this._config = null, this._element = null, this._dialog = null, this._backdrop = null, 
                this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, 
                this._originalBodyPadding = null, this._scrollbarWidth = null;
            }, h.prototype._getConfig = function(n) {
                return n = t.extend({}, _, n), r.typeCheckConfig(e, n, g), n;
            }, h.prototype._showElement = function(e) {
                var n = this, i = r.supportsTransitionEnd() && t(this._element).hasClass(m.FADE);
                this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), 
                this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), 
                this._element.scrollTop = 0, i && r.reflow(this._element), t(this._element).addClass(m.SHOW), 
                this._config.focus && this._enforceFocus();
                var o = t.Event(p.SHOWN, {
                    relatedTarget: e
                }), s = function s() {
                    n._config.focus && n._element.focus(), n._isTransitioning = !1, t(n._element).trigger(o);
                };
                i ? t(this._dialog).one(r.TRANSITION_END, s).emulateTransitionEnd(u) : s();
            }, h.prototype._enforceFocus = function() {
                var e = this;
                t(document).off(p.FOCUSIN).on(p.FOCUSIN, function(n) {
                    document === n.target || e._element === n.target || t(e._element).has(n.target).length || e._element.focus();
                });
            }, h.prototype._setEscapeEvent = function() {
                var e = this;
                this._isShown && this._config.keyboard ? t(this._element).on(p.KEYDOWN_DISMISS, function(t) {
                    t.which === f && e.hide();
                }) : this._isShown || t(this._element).off(p.KEYDOWN_DISMISS);
            }, h.prototype._setResizeEvent = function() {
                var e = this;
                this._isShown ? t(window).on(p.RESIZE, function(t) {
                    return e._handleUpdate(t);
                }) : t(window).off(p.RESIZE);
            }, h.prototype._hideModal = function() {
                var e = this;
                this._element.style.display = "none", this._element.setAttribute("aria-hidden", "true"), 
                this._isTransitioning = !1, this._showBackdrop(function() {
                    t(document.body).removeClass(m.OPEN), e._resetAdjustments(), e._resetScrollbar(), 
                    t(e._element).trigger(p.HIDDEN);
                });
            }, h.prototype._removeBackdrop = function() {
                this._backdrop && (t(this._backdrop).remove(), this._backdrop = null);
            }, h.prototype._showBackdrop = function(e) {
                var n = this, i = t(this._element).hasClass(m.FADE) ? m.FADE : "";
                if (this._isShown && this._config.backdrop) {
                    var o = r.supportsTransitionEnd() && i;
                    if (this._backdrop = document.createElement("div"), this._backdrop.className = m.BACKDROP, 
                    i && t(this._backdrop).addClass(i), t(this._backdrop).appendTo(document.body), t(this._element).on(p.CLICK_DISMISS, function(t) {
                        return n._ignoreBackdropClick ? void (n._ignoreBackdropClick = !1) : void (t.target === t.currentTarget && ("static" === n._config.backdrop ? n._element.focus() : n.hide()));
                    }), o && r.reflow(this._backdrop), t(this._backdrop).addClass(m.SHOW), !e) return;
                    if (!o) return void e();
                    t(this._backdrop).one(r.TRANSITION_END, e).emulateTransitionEnd(d);
                } else if (!this._isShown && this._backdrop) {
                    t(this._backdrop).removeClass(m.SHOW);
                    var s = function s() {
                        n._removeBackdrop(), e && e();
                    };
                    r.supportsTransitionEnd() && t(this._element).hasClass(m.FADE) ? t(this._backdrop).one(r.TRANSITION_END, s).emulateTransitionEnd(d) : s();
                } else e && e();
            }, h.prototype._handleUpdate = function() {
                this._adjustDialog();
            }, h.prototype._adjustDialog = function() {
                var t = this._element.scrollHeight > document.documentElement.clientHeight;
                !this._isBodyOverflowing && t && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), 
                this._isBodyOverflowing && !t && (this._element.style.paddingRight = this._scrollbarWidth + "px");
            }, h.prototype._resetAdjustments = function() {
                this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
            }, h.prototype._checkScrollbar = function() {
                this._isBodyOverflowing = document.body.clientWidth < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth();
            }, h.prototype._setScrollbar = function() {
                var e = parseInt(t(E.FIXED_CONTENT).css("padding-right") || 0, 10);
                this._originalBodyPadding = document.body.style.paddingRight || "", this._isBodyOverflowing && (document.body.style.paddingRight = e + this._scrollbarWidth + "px");
            }, h.prototype._resetScrollbar = function() {
                document.body.style.paddingRight = this._originalBodyPadding;
            }, h.prototype._getScrollbarWidth = function() {
                var t = document.createElement("div");
                t.className = m.SCROLLBAR_MEASURER, document.body.appendChild(t);
                var e = t.offsetWidth - t.clientWidth;
                return document.body.removeChild(t), e;
            }, h._jQueryInterface = function(e, n) {
                return this.each(function() {
                    var o = t(this).data(a), r = t.extend({}, h.Default, t(this).data(), "object" === ("undefined" == typeof e ? "undefined" : i(e)) && e);
                    if (o || (o = new h(this, r), t(this).data(a, o)), "string" == typeof e) {
                        if (void 0 === o[e]) throw new Error('No method named "' + e + '"');
                        o[e](n);
                    } else r.show && o.show(n);
                });
            }, o(h, null, [ {
                key: "VERSION",
                get: function get() {
                    return s;
                }
            }, {
                key: "Default",
                get: function get() {
                    return _;
                }
            } ]), h;
        }();
        return t(document).on(p.CLICK_DATA_API, E.DATA_TOGGLE, function(e) {
            var n = this, i = void 0, o = r.getSelectorFromElement(this);
            o && (i = t(o)[0]);
            var s = t(i).data(a) ? "toggle" : t.extend({}, t(i).data(), t(this).data());
            "A" !== this.tagName && "AREA" !== this.tagName || e.preventDefault();
            var l = t(i).one(p.SHOW, function(e) {
                e.isDefaultPrevented() || l.one(p.HIDDEN, function() {
                    t(n).is(":visible") && n.focus();
                });
            });
            v._jQueryInterface.call(t(i), s, this);
        }), t.fn[e] = v._jQueryInterface, t.fn[e].Constructor = v, t.fn[e].noConflict = function() {
            return t.fn[e] = c, v._jQueryInterface;
        }, v;
    }(jQuery), function(t) {
        var e = "scrollspy", s = "4.0.0-alpha.6", a = "bs.scrollspy", l = "." + a, h = ".data-api", c = t.fn[e], u = {
            offset: 10,
            method: "auto",
            target: ""
        }, d = {
            offset: "number",
            method: "string",
            target: "(string|element)"
        }, f = {
            ACTIVATE: "activate" + l,
            SCROLL: "scroll" + l,
            LOAD_DATA_API: "load" + l + h
        }, _ = {
            DROPDOWN_ITEM: "dropdown-item",
            DROPDOWN_MENU: "dropdown-menu",
            NAV_LINK: "nav-link",
            NAV: "nav",
            ACTIVE: "active"
        }, g = {
            DATA_SPY: '[data-spy="scroll"]',
            ACTIVE: ".active",
            LIST_ITEM: ".list-item",
            LI: "li",
            LI_DROPDOWN: "li.dropdown",
            NAV_LINKS: ".nav-link",
            DROPDOWN: ".dropdown",
            DROPDOWN_ITEMS: ".dropdown-item",
            DROPDOWN_TOGGLE: ".dropdown-toggle"
        }, p = {
            OFFSET: "offset",
            POSITION: "position"
        }, m = function() {
            function h(e, i) {
                var o = this;
                n(this, h), this._element = e, this._scrollElement = "BODY" === e.tagName ? window : e, 
                this._config = this._getConfig(i), this._selector = this._config.target + " " + g.NAV_LINKS + "," + (this._config.target + " " + g.DROPDOWN_ITEMS), 
                this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, 
                t(this._scrollElement).on(f.SCROLL, function(t) {
                    return o._process(t);
                }), this.refresh(), this._process();
            }
            return h.prototype.refresh = function() {
                var e = this, n = this._scrollElement !== this._scrollElement.window ? p.POSITION : p.OFFSET, i = "auto" === this._config.method ? n : this._config.method, o = i === p.POSITION ? this._getScrollTop() : 0;
                this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight();
                var s = t.makeArray(t(this._selector));
                s.map(function(e) {
                    var n = void 0, s = r.getSelectorFromElement(e);
                    return s && (n = t(s)[0]), n && (n.offsetWidth || n.offsetHeight) ? [ t(n)[i]().top + o, s ] : null;
                }).filter(function(t) {
                    return t;
                }).sort(function(t, e) {
                    return t[0] - e[0];
                }).forEach(function(t) {
                    e._offsets.push(t[0]), e._targets.push(t[1]);
                });
            }, h.prototype.dispose = function() {
                t.removeData(this._element, a), t(this._scrollElement).off(l), this._element = null, 
                this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, 
                this._targets = null, this._activeTarget = null, this._scrollHeight = null;
            }, h.prototype._getConfig = function(n) {
                if (n = t.extend({}, u, n), "string" != typeof n.target) {
                    var i = t(n.target).attr("id");
                    i || (i = r.getUID(e), t(n.target).attr("id", i)), n.target = "#" + i;
                }
                return r.typeCheckConfig(e, n, d), n;
            }, h.prototype._getScrollTop = function() {
                return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
            }, h.prototype._getScrollHeight = function() {
                return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            }, h.prototype._getOffsetHeight = function() {
                return this._scrollElement === window ? window.innerHeight : this._scrollElement.offsetHeight;
            }, h.prototype._process = function() {
                var t = this._getScrollTop() + this._config.offset, e = this._getScrollHeight(), n = this._config.offset + e - this._getOffsetHeight();
                if (this._scrollHeight !== e && this.refresh(), t >= n) {
                    var i = this._targets[this._targets.length - 1];
                    return void (this._activeTarget !== i && this._activate(i));
                }
                if (this._activeTarget && t < this._offsets[0] && this._offsets[0] > 0) return this._activeTarget = null, 
                void this._clear();
                for (var o = this._offsets.length; o--; ) {
                    var r = this._activeTarget !== this._targets[o] && t >= this._offsets[o] && (void 0 === this._offsets[o + 1] || t < this._offsets[o + 1]);
                    r && this._activate(this._targets[o]);
                }
            }, h.prototype._activate = function(e) {
                this._activeTarget = e, this._clear();
                var n = this._selector.split(",");
                n = n.map(function(t) {
                    return t + '[data-target="' + e + '"],' + (t + '[href="' + e + '"]');
                });
                var i = t(n.join(","));
                i.hasClass(_.DROPDOWN_ITEM) ? (i.closest(g.DROPDOWN).find(g.DROPDOWN_TOGGLE).addClass(_.ACTIVE), 
                i.addClass(_.ACTIVE)) : i.parents(g.LI).find("> " + g.NAV_LINKS).addClass(_.ACTIVE), 
                t(this._scrollElement).trigger(f.ACTIVATE, {
                    relatedTarget: e
                });
            }, h.prototype._clear = function() {
                t(this._selector).filter(g.ACTIVE).removeClass(_.ACTIVE);
            }, h._jQueryInterface = function(e) {
                return this.each(function() {
                    var n = t(this).data(a), o = "object" === ("undefined" == typeof e ? "undefined" : i(e)) && e;
                    if (n || (n = new h(this, o), t(this).data(a, n)), "string" == typeof e) {
                        if (void 0 === n[e]) throw new Error('No method named "' + e + '"');
                        n[e]();
                    }
                });
            }, o(h, null, [ {
                key: "VERSION",
                get: function get() {
                    return s;
                }
            }, {
                key: "Default",
                get: function get() {
                    return u;
                }
            } ]), h;
        }();
        return t(window).on(f.LOAD_DATA_API, function() {
            for (var e = t.makeArray(t(g.DATA_SPY)), n = e.length; n--; ) {
                var i = t(e[n]);
                m._jQueryInterface.call(i, i.data());
            }
        }), t.fn[e] = m._jQueryInterface, t.fn[e].Constructor = m, t.fn[e].noConflict = function() {
            return t.fn[e] = c, m._jQueryInterface;
        }, m;
    }(jQuery), function(t) {
        var e = "tab", i = "4.0.0-alpha.6", s = "bs.tab", a = "." + s, l = ".data-api", h = t.fn[e], c = 150, u = {
            HIDE: "hide" + a,
            HIDDEN: "hidden" + a,
            SHOW: "show" + a,
            SHOWN: "shown" + a,
            CLICK_DATA_API: "click" + a + l
        }, d = {
            DROPDOWN_MENU: "dropdown-menu",
            ACTIVE: "active",
            DISABLED: "disabled",
            FADE: "fade",
            SHOW: "show"
        }, f = {
            A: "a",
            LI: "li",
            DROPDOWN: ".dropdown",
            LIST: "ul:not(.dropdown-menu), ol:not(.dropdown-menu), nav:not(.dropdown-menu)",
            FADE_CHILD: "> .nav-item .fade, > .fade",
            ACTIVE: ".active",
            ACTIVE_CHILD: "> .nav-item > .active, > .active",
            DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"]',
            DROPDOWN_TOGGLE: ".dropdown-toggle",
            DROPDOWN_ACTIVE_CHILD: "> .dropdown-menu .active"
        }, _ = function() {
            function e(t) {
                n(this, e), this._element = t;
            }
            return e.prototype.show = function() {
                var e = this;
                if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && t(this._element).hasClass(d.ACTIVE) || t(this._element).hasClass(d.DISABLED))) {
                    var n = void 0, i = void 0, o = t(this._element).closest(f.LIST)[0], s = r.getSelectorFromElement(this._element);
                    o && (i = t.makeArray(t(o).find(f.ACTIVE)), i = i[i.length - 1]);
                    var a = t.Event(u.HIDE, {
                        relatedTarget: this._element
                    }), l = t.Event(u.SHOW, {
                        relatedTarget: i
                    });
                    if (i && t(i).trigger(a), t(this._element).trigger(l), !l.isDefaultPrevented() && !a.isDefaultPrevented()) {
                        s && (n = t(s)[0]), this._activate(this._element, o);
                        var h = function h() {
                            var n = t.Event(u.HIDDEN, {
                                relatedTarget: e._element
                            }), o = t.Event(u.SHOWN, {
                                relatedTarget: i
                            });
                            t(i).trigger(n), t(e._element).trigger(o);
                        };
                        n ? this._activate(n, n.parentNode, h) : h();
                    }
                }
            }, e.prototype.dispose = function() {
                t.removeClass(this._element, s), this._element = null;
            }, e.prototype._activate = function(e, n, i) {
                var o = this, s = t(n).find(f.ACTIVE_CHILD)[0], a = i && r.supportsTransitionEnd() && (s && t(s).hasClass(d.FADE) || Boolean(t(n).find(f.FADE_CHILD)[0])), l = function l() {
                    return o._transitionComplete(e, s, a, i);
                };
                s && a ? t(s).one(r.TRANSITION_END, l).emulateTransitionEnd(c) : l(), s && t(s).removeClass(d.SHOW);
            }, e.prototype._transitionComplete = function(e, n, i, o) {
                if (n) {
                    t(n).removeClass(d.ACTIVE);
                    var s = t(n.parentNode).find(f.DROPDOWN_ACTIVE_CHILD)[0];
                    s && t(s).removeClass(d.ACTIVE), n.setAttribute("aria-expanded", !1);
                }
                if (t(e).addClass(d.ACTIVE), e.setAttribute("aria-expanded", !0), i ? (r.reflow(e), 
                t(e).addClass(d.SHOW)) : t(e).removeClass(d.FADE), e.parentNode && t(e.parentNode).hasClass(d.DROPDOWN_MENU)) {
                    var a = t(e).closest(f.DROPDOWN)[0];
                    a && t(a).find(f.DROPDOWN_TOGGLE).addClass(d.ACTIVE), e.setAttribute("aria-expanded", !0);
                }
                o && o();
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this), o = i.data(s);
                    if (o || (o = new e(this), i.data(s, o)), "string" == typeof n) {
                        if (void 0 === o[n]) throw new Error('No method named "' + n + '"');
                        o[n]();
                    }
                });
            }, o(e, null, [ {
                key: "VERSION",
                get: function get() {
                    return i;
                }
            } ]), e;
        }();
        return t(document).on(u.CLICK_DATA_API, f.DATA_TOGGLE, function(e) {
            e.preventDefault(), _._jQueryInterface.call(t(this), "show");
        }), t.fn[e] = _._jQueryInterface, t.fn[e].Constructor = _, t.fn[e].noConflict = function() {
            return t.fn[e] = h, _._jQueryInterface;
        }, _;
    }(jQuery), function(t) {
        if ("undefined" == typeof Tether) throw new Error("Bootstrap tooltips require Tether (http://tether.io/)");
        var e = "tooltip", s = "4.0.0-alpha.6", a = "bs.tooltip", l = "." + a, h = t.fn[e], c = 150, u = "bs-tether", d = {
            animation: !0,
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            selector: !1,
            placement: "top",
            offset: "0 0",
            constraints: [],
            container: !1
        }, f = {
            animation: "boolean",
            template: "string",
            title: "(string|element|function)",
            trigger: "string",
            delay: "(number|object)",
            html: "boolean",
            selector: "(string|boolean)",
            placement: "(string|function)",
            offset: "string",
            constraints: "array",
            container: "(string|element|boolean)"
        }, _ = {
            TOP: "bottom center",
            RIGHT: "middle left",
            BOTTOM: "top center",
            LEFT: "middle right"
        }, g = {
            SHOW: "show",
            OUT: "out"
        }, p = {
            HIDE: "hide" + l,
            HIDDEN: "hidden" + l,
            SHOW: "show" + l,
            SHOWN: "shown" + l,
            INSERTED: "inserted" + l,
            CLICK: "click" + l,
            FOCUSIN: "focusin" + l,
            FOCUSOUT: "focusout" + l,
            MOUSEENTER: "mouseenter" + l,
            MOUSELEAVE: "mouseleave" + l
        }, m = {
            FADE: "fade",
            SHOW: "show"
        }, E = {
            TOOLTIP: ".tooltip",
            TOOLTIP_INNER: ".tooltip-inner"
        }, v = {
            element: !1,
            enabled: !1
        }, T = {
            HOVER: "hover",
            FOCUS: "focus",
            CLICK: "click",
            MANUAL: "manual"
        }, I = function() {
            function h(t, e) {
                n(this, h), this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, 
                this._isTransitioning = !1, this._tether = null, this.element = t, this.config = this._getConfig(e), 
                this.tip = null, this._setListeners();
            }
            return h.prototype.enable = function() {
                this._isEnabled = !0;
            }, h.prototype.disable = function() {
                this._isEnabled = !1;
            }, h.prototype.toggleEnabled = function() {
                this._isEnabled = !this._isEnabled;
            }, h.prototype.toggle = function(e) {
                if (e) {
                    var n = this.constructor.DATA_KEY, i = t(e.currentTarget).data(n);
                    i || (i = new this.constructor(e.currentTarget, this._getDelegateConfig()), t(e.currentTarget).data(n, i)), 
                    i._activeTrigger.click = !i._activeTrigger.click, i._isWithActiveTrigger() ? i._enter(null, i) : i._leave(null, i);
                } else {
                    if (t(this.getTipElement()).hasClass(m.SHOW)) return void this._leave(null, this);
                    this._enter(null, this);
                }
            }, h.prototype.dispose = function() {
                clearTimeout(this._timeout), this.cleanupTether(), t.removeData(this.element, this.constructor.DATA_KEY), 
                t(this.element).off(this.constructor.EVENT_KEY), t(this.element).closest(".modal").off("hide.bs.modal"), 
                this.tip && t(this.tip).remove(), this._isEnabled = null, this._timeout = null, 
                this._hoverState = null, this._activeTrigger = null, this._tether = null, this.element = null, 
                this.config = null, this.tip = null;
            }, h.prototype.show = function() {
                var e = this;
                if ("none" === t(this.element).css("display")) throw new Error("Please use show on visible elements");
                var n = t.Event(this.constructor.Event.SHOW);
                if (this.isWithContent() && this._isEnabled) {
                    if (this._isTransitioning) throw new Error("Tooltip is transitioning");
                    t(this.element).trigger(n);
                    var i = t.contains(this.element.ownerDocument.documentElement, this.element);
                    if (n.isDefaultPrevented() || !i) return;
                    var o = this.getTipElement(), s = r.getUID(this.constructor.NAME);
                    o.setAttribute("id", s), this.element.setAttribute("aria-describedby", s), this.setContent(), 
                    this.config.animation && t(o).addClass(m.FADE);
                    var a = "function" == typeof this.config.placement ? this.config.placement.call(this, o, this.element) : this.config.placement, l = this._getAttachment(a), c = this.config.container === !1 ? document.body : t(this.config.container);
                    t(o).data(this.constructor.DATA_KEY, this).appendTo(c), t(this.element).trigger(this.constructor.Event.INSERTED), 
                    this._tether = new Tether({
                        attachment: l,
                        element: o,
                        target: this.element,
                        classes: v,
                        classPrefix: u,
                        offset: this.config.offset,
                        constraints: this.config.constraints,
                        addTargetClasses: !1
                    }), r.reflow(o), this._tether.position(), t(o).addClass(m.SHOW);
                    var d = function d() {
                        var n = e._hoverState;
                        e._hoverState = null, e._isTransitioning = !1, t(e.element).trigger(e.constructor.Event.SHOWN), 
                        n === g.OUT && e._leave(null, e);
                    };
                    if (r.supportsTransitionEnd() && t(this.tip).hasClass(m.FADE)) return this._isTransitioning = !0, 
                    void t(this.tip).one(r.TRANSITION_END, d).emulateTransitionEnd(h._TRANSITION_DURATION);
                    d();
                }
            }, h.prototype.hide = function(e) {
                var n = this, i = this.getTipElement(), o = t.Event(this.constructor.Event.HIDE);
                if (this._isTransitioning) throw new Error("Tooltip is transitioning");
                var s = function s() {
                    n._hoverState !== g.SHOW && i.parentNode && i.parentNode.removeChild(i), n.element.removeAttribute("aria-describedby"), 
                    t(n.element).trigger(n.constructor.Event.HIDDEN), n._isTransitioning = !1, n.cleanupTether(), 
                    e && e();
                };
                t(this.element).trigger(o), o.isDefaultPrevented() || (t(i).removeClass(m.SHOW), 
                this._activeTrigger[T.CLICK] = !1, this._activeTrigger[T.FOCUS] = !1, this._activeTrigger[T.HOVER] = !1, 
                r.supportsTransitionEnd() && t(this.tip).hasClass(m.FADE) ? (this._isTransitioning = !0, 
                t(i).one(r.TRANSITION_END, s).emulateTransitionEnd(c)) : s(), this._hoverState = "");
            }, h.prototype.isWithContent = function() {
                return Boolean(this.getTitle());
            }, h.prototype.getTipElement = function() {
                return this.tip = this.tip || t(this.config.template)[0];
            }, h.prototype.setContent = function() {
                var e = t(this.getTipElement());
                this.setElementContent(e.find(E.TOOLTIP_INNER), this.getTitle()), e.removeClass(m.FADE + " " + m.SHOW), 
                this.cleanupTether();
            }, h.prototype.setElementContent = function(e, n) {
                var o = this.config.html;
                "object" === ("undefined" == typeof n ? "undefined" : i(n)) && (n.nodeType || n.jquery) ? o ? t(n).parent().is(e) || e.empty().append(n) : e.text(t(n).text()) : e[o ? "html" : "text"](n);
            }, h.prototype.getTitle = function() {
                var t = this.element.getAttribute("data-original-title");
                return t || (t = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), 
                t;
            }, h.prototype.cleanupTether = function() {
                this._tether && this._tether.destroy();
            }, h.prototype._getAttachment = function(t) {
                return _[t.toUpperCase()];
            }, h.prototype._setListeners = function() {
                var e = this, n = this.config.trigger.split(" ");
                n.forEach(function(n) {
                    if ("click" === n) t(e.element).on(e.constructor.Event.CLICK, e.config.selector, function(t) {
                        return e.toggle(t);
                    }); else if (n !== T.MANUAL) {
                        var i = n === T.HOVER ? e.constructor.Event.MOUSEENTER : e.constructor.Event.FOCUSIN, o = n === T.HOVER ? e.constructor.Event.MOUSELEAVE : e.constructor.Event.FOCUSOUT;
                        t(e.element).on(i, e.config.selector, function(t) {
                            return e._enter(t);
                        }).on(o, e.config.selector, function(t) {
                            return e._leave(t);
                        });
                    }
                    t(e.element).closest(".modal").on("hide.bs.modal", function() {
                        return e.hide();
                    });
                }), this.config.selector ? this.config = t.extend({}, this.config, {
                    trigger: "manual",
                    selector: ""
                }) : this._fixTitle();
            }, h.prototype._fixTitle = function() {
                var t = i(this.element.getAttribute("data-original-title"));
                (this.element.getAttribute("title") || "string" !== t) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), 
                this.element.setAttribute("title", ""));
            }, h.prototype._enter = function(e, n) {
                var i = this.constructor.DATA_KEY;
                return n = n || t(e.currentTarget).data(i), n || (n = new this.constructor(e.currentTarget, this._getDelegateConfig()), 
                t(e.currentTarget).data(i, n)), e && (n._activeTrigger["focusin" === e.type ? T.FOCUS : T.HOVER] = !0), 
                t(n.getTipElement()).hasClass(m.SHOW) || n._hoverState === g.SHOW ? void (n._hoverState = g.SHOW) : (clearTimeout(n._timeout), 
                n._hoverState = g.SHOW, n.config.delay && n.config.delay.show ? void (n._timeout = setTimeout(function() {
                    n._hoverState === g.SHOW && n.show();
                }, n.config.delay.show)) : void n.show());
            }, h.prototype._leave = function(e, n) {
                var i = this.constructor.DATA_KEY;
                if (n = n || t(e.currentTarget).data(i), n || (n = new this.constructor(e.currentTarget, this._getDelegateConfig()), 
                t(e.currentTarget).data(i, n)), e && (n._activeTrigger["focusout" === e.type ? T.FOCUS : T.HOVER] = !1), 
                !n._isWithActiveTrigger()) return clearTimeout(n._timeout), n._hoverState = g.OUT, 
                n.config.delay && n.config.delay.hide ? void (n._timeout = setTimeout(function() {
                    n._hoverState === g.OUT && n.hide();
                }, n.config.delay.hide)) : void n.hide();
            }, h.prototype._isWithActiveTrigger = function() {
                for (var t in this._activeTrigger) {
                    if (this._activeTrigger[t]) return !0;
                }
                return !1;
            }, h.prototype._getConfig = function(n) {
                return n = t.extend({}, this.constructor.Default, t(this.element).data(), n), n.delay && "number" == typeof n.delay && (n.delay = {
                    show: n.delay,
                    hide: n.delay
                }), r.typeCheckConfig(e, n, this.constructor.DefaultType), n;
            }, h.prototype._getDelegateConfig = function() {
                var t = {};
                if (this.config) for (var e in this.config) {
                    this.constructor.Default[e] !== this.config[e] && (t[e] = this.config[e]);
                }
                return t;
            }, h._jQueryInterface = function(e) {
                return this.each(function() {
                    var n = t(this).data(a), o = "object" === ("undefined" == typeof e ? "undefined" : i(e)) && e;
                    if ((n || !/dispose|hide/.test(e)) && (n || (n = new h(this, o), t(this).data(a, n)), 
                    "string" == typeof e)) {
                        if (void 0 === n[e]) throw new Error('No method named "' + e + '"');
                        n[e]();
                    }
                });
            }, o(h, null, [ {
                key: "VERSION",
                get: function get() {
                    return s;
                }
            }, {
                key: "Default",
                get: function get() {
                    return d;
                }
            }, {
                key: "NAME",
                get: function get() {
                    return e;
                }
            }, {
                key: "DATA_KEY",
                get: function get() {
                    return a;
                }
            }, {
                key: "Event",
                get: function get() {
                    return p;
                }
            }, {
                key: "EVENT_KEY",
                get: function get() {
                    return l;
                }
            }, {
                key: "DefaultType",
                get: function get() {
                    return f;
                }
            } ]), h;
        }();
        return t.fn[e] = I._jQueryInterface, t.fn[e].Constructor = I, t.fn[e].noConflict = function() {
            return t.fn[e] = h, I._jQueryInterface;
        }, I;
    }(jQuery));
    (function(r) {
        var a = "popover", l = "4.0.0-alpha.6", h = "bs.popover", c = "." + h, u = r.fn[a], d = r.extend({}, s.Default, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        }), f = r.extend({}, s.DefaultType, {
            content: "(string|element|function)"
        }), _ = {
            FADE: "fade",
            SHOW: "show"
        }, g = {
            TITLE: ".popover-title",
            CONTENT: ".popover-content"
        }, p = {
            HIDE: "hide" + c,
            HIDDEN: "hidden" + c,
            SHOW: "show" + c,
            SHOWN: "shown" + c,
            INSERTED: "inserted" + c,
            CLICK: "click" + c,
            FOCUSIN: "focusin" + c,
            FOCUSOUT: "focusout" + c,
            MOUSEENTER: "mouseenter" + c,
            MOUSELEAVE: "mouseleave" + c
        }, m = function(s) {
            function u() {
                return n(this, u), t(this, s.apply(this, arguments));
            }
            return e(u, s), u.prototype.isWithContent = function() {
                return this.getTitle() || this._getContent();
            }, u.prototype.getTipElement = function() {
                return this.tip = this.tip || r(this.config.template)[0];
            }, u.prototype.setContent = function() {
                var t = r(this.getTipElement());
                this.setElementContent(t.find(g.TITLE), this.getTitle()), this.setElementContent(t.find(g.CONTENT), this._getContent()), 
                t.removeClass(_.FADE + " " + _.SHOW), this.cleanupTether();
            }, u.prototype._getContent = function() {
                return this.element.getAttribute("data-content") || ("function" == typeof this.config.content ? this.config.content.call(this.element) : this.config.content);
            }, u._jQueryInterface = function(t) {
                return this.each(function() {
                    var e = r(this).data(h), n = "object" === ("undefined" == typeof t ? "undefined" : i(t)) ? t : null;
                    if ((e || !/destroy|hide/.test(t)) && (e || (e = new u(this, n), r(this).data(h, e)), 
                    "string" == typeof t)) {
                        if (void 0 === e[t]) throw new Error('No method named "' + t + '"');
                        e[t]();
                    }
                });
            }, o(u, null, [ {
                key: "VERSION",
                get: function get() {
                    return l;
                }
            }, {
                key: "Default",
                get: function get() {
                    return d;
                }
            }, {
                key: "NAME",
                get: function get() {
                    return a;
                }
            }, {
                key: "DATA_KEY",
                get: function get() {
                    return h;
                }
            }, {
                key: "Event",
                get: function get() {
                    return p;
                }
            }, {
                key: "EVENT_KEY",
                get: function get() {
                    return c;
                }
            }, {
                key: "DefaultType",
                get: function get() {
                    return f;
                }
            } ]), u;
        }(s);
        return r.fn[a] = m._jQueryInterface, r.fn[a].Constructor = m, r.fn[a].noConflict = function() {
            return r.fn[a] = u, m._jQueryInterface;
        }, m;
    })(jQuery);
}();

"use strict";

function setFocusValue(element, value) {
    if (!$(element).val()) {
        $(element).val(value);
    }
}

function collapseAll(accordion, action) {
    $(accordion).collapse(action);
}

$(".checkAll").click(function() {
    var id = $(this).attr("id");
    $("." + id).prop("checked", this.checked);
});

function editInlineEditable() {
    $(".Inline-editable--enable").toggle();
    $(".Add-new-inline-editable").toggle();
    $(".Edit-inline-action").toggle();
    $(".Editable-check-text input").prop("disabled", function(i, v) {
        return !v;
    });
}

"use strict";

$("select").change(function() {
    if ($(this).val() == "modal-trigger") {
        $("#myModal").modal("show");
    }
});

"use strict";

$(".Hamburger").click(function() {
    $(this).toggleClass("Open");
    $(".Sub-header_bar").toggleClass("Hamburger-open");
    console.log("toggled");
});

"use strict";

$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
        $(".Sub-header_bar").addClass("Sticky-header");
        $(".Header_bar").addClass("Only");
        $("html").addClass("W-Sticky-nav--en");
    } else {
        $(".Sub-header_bar").removeClass("Sticky-header");
        $(".Header_bar").removeClass("Only");
        $("html").removeClass("W-Sticky-nav--en");
    }
});

$(".Header_bar__alert").click(function() {
    $(".Header_bar__alert--notification").hide();
});

"use strict";

function addMarker(map, lat, long, contentString, type) {
    var label = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var marker = new Marker({
        position: new google.maps.LatLng(lat, long),
        map: map,
        icon: "img/markers/" + type + ".svg",
        map_icon_label: label !== null ? '<i class="map-icon Icon--' + label + ' Icon--sm"></i>' : ""
    });
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 480
    });
    marker.addListener("click", function() {
        infowindow.open(map, marker);
    });
}

"use strict";

function multi_select_radioSelected(input) {
    $(input).parent().parent().find(".Selected").removeClass("Selected");
    $(input).parent().toggleClass("Selected");
}

"use strict";

function ribbonClick(element) {
    if ($(element).hasClass("Active")) {
        $(".Ribbon__header__wrap, .Ribbon__response, .Ribbon__header__chevron").removeClass("Active");
        $(".Response__content").slideUp();
    } else {
        $(".Ribbon__header__wrap, .Ribbon__response, .Ribbon__header__chevron").removeClass("Active");
        $(".Response__content").slideUp();
        $(element).parent().addClass("Active");
        $(element).toggleClass("Active");
        $(element).parent().parent().next(".Response__content").slideToggle();
        $(element).parent().parent().toggleClass("Active");
    }
}

function continueToNextRibbon(element) {
    $(".Ribbon__header__wrap, .Ribbon__response, .Ribbon__header__chevron").removeClass("Active");
    $(".Response__content").slideUp();
    $(element).parent().parent().next().next(".Response__content").slideDown();
    $(element).parent().parent().next(".Ribbon__response").addClass("Active");
    $(element).parent().parent().next().find(".Ribbon__header__wrap, .Ribbon__header__chevron").addClass("Active");
}

$(".collapse").on("shown.bs.collapse", function(e) {
    if (!$(e.target).hasClass("prevent_parent_collapse")) {
        $(this).prev().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
        $(this).prev().find(".Hide-all").show();
        $(this).prev().find(".Show-all").hide();
    }
}).on("hidden.bs.collapse", function(e) {
    if (!$(e.target).hasClass("prevent_parent_collapse")) {
        $(this).prev().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");
        $(this).prev().find(".Hide-all").hide();
        $(this).prev().find(".Show-all").show();
    }
});

"use strict";

(function($, window, document, undefined) {
    "use strict";
})(jQuery, window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1hZG1pbi5qcyIsImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImZvcm1zLmpzIiwiaW5pdGlhbF9fZHJvcGRvd24tbW9kYWwtdHJpZ2dlci5qcyIsImluaXRpYWxfX2hhbWJ1cmdlci5qcyIsImluaXRpYWxfX3N0aWNreS1uYXYuanMiLCJtYXAuanMiLCJyZXNwb25zZS1wbGFuX19tdWx0aS1zZWxlY3QuanMiLCJyZXNwb25zZS1wbGFuX19yZXZlYWwtcmliYm9uLmpzIl0sIm5hbWVzIjpbImNvdW50cnlfcmVtb3ZlZCIsImNvdW50cmllcyIsIiQiLCJsZW5ndGgiLCJoaWRlIiwic2hvdyIsImdwYUFjdGlvbkNoYW5nZWQiLCJlbGVtZW50IiwiYWRkQWN0aW9uQnV0dG9uIiwiY2hlY2tlZCIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiZmluZCIsImkiLCJlYWNoIiwiYWRkQ2xhc3MiLCJhZGREZXBhcnRtZW50TW9kYWwiLCJzZWxlY3QiLCJtb2RhbF9pZCIsImhhc0NsYXNzIiwibW9kYWwiLCJyZWFkVVJMIiwiaW5wdXQiLCJmaWxlcyIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiY3NzIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzRGF0YVVSTCIsInByZXZpZXdMb2dvIiwibG9nb0ltYWdlIiwidHJpZ2dlclByZXZpZXdMb2dvIiwicHJldmVudERlZmF1bHQiLCJ0cmlnZ2VyIiwicmVtb3ZlTG9nb1ByZXZpZXciLCJqUXVlcnkiLCJFcnJvciIsInQiLCJmbiIsImpxdWVyeSIsInNwbGl0IiwiUmVmZXJlbmNlRXJyb3IiLCJfdHlwZW9mIiwiVHlwZUVycm9yIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwibiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwibyIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwiciIsInRvU3RyaW5nIiwiY2FsbCIsIm1hdGNoIiwidG9Mb3dlckNhc2UiLCJub2RlVHlwZSIsImJpbmRUeXBlIiwiYSIsImVuZCIsImRlbGVnYXRlVHlwZSIsImhhbmRsZSIsImlzIiwidGhpcyIsImhhbmRsZU9iaiIsImhhbmRsZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndpbmRvdyIsIlFVbml0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaCIsInN0eWxlIiwib25lIiwiYyIsIlRSQU5TSVRJT05fRU5EIiwic2V0VGltZW91dCIsInRyaWdnZXJUcmFuc2l0aW9uRW5kIiwicyIsImVtdWxhdGVUcmFuc2l0aW9uRW5kIiwic3VwcG9ydHNUcmFuc2l0aW9uRW5kIiwiZXZlbnQiLCJzcGVjaWFsIiwibCIsIldlYmtpdFRyYW5zaXRpb24iLCJNb3pUcmFuc2l0aW9uIiwiT1RyYW5zaXRpb24iLCJ0cmFuc2l0aW9uIiwiZ2V0VUlEIiwiTWF0aCIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCIsImdldEF0dHJpYnV0ZSIsInRlc3QiLCJyZWZsb3ciLCJvZmZzZXRIZWlnaHQiLCJCb29sZWFuIiwidHlwZUNoZWNrQ29uZmlnIiwiaGFzT3duUHJvcGVydHkiLCJSZWdFeHAiLCJ0b1VwcGVyQ2FzZSIsInUiLCJESVNNSVNTIiwiZCIsIkNMT1NFIiwiQ0xPU0VEIiwiQ0xJQ0tfREFUQV9BUEkiLCJmIiwiQUxFUlQiLCJGQURFIiwiU0hPVyIsIl8iLCJfZWxlbWVudCIsImNsb3NlIiwiX2dldFJvb3RFbGVtZW50IiwiX3RyaWdnZXJDbG9zZUV2ZW50IiwiaXNEZWZhdWx0UHJldmVudGVkIiwiX3JlbW92ZUVsZW1lbnQiLCJkaXNwb3NlIiwicmVtb3ZlRGF0YSIsImNsb3Nlc3QiLCJFdmVudCIsIl9kZXN0cm95RWxlbWVudCIsImRldGFjaCIsInJlbW92ZSIsIl9qUXVlcnlJbnRlcmZhY2UiLCJkYXRhIiwiX2hhbmRsZURpc21pc3MiLCJnZXQiLCJvbiIsIkNvbnN0cnVjdG9yIiwibm9Db25mbGljdCIsIkFDVElWRSIsIkJVVFRPTiIsIkZPQ1VTIiwiREFUQV9UT0dHTEVfQ0FSUk9UIiwiREFUQV9UT0dHTEUiLCJJTlBVVCIsIkZPQ1VTX0JMVVJfREFUQV9BUEkiLCJ0b2dnbGUiLCJ0eXBlIiwiZm9jdXMiLCJzZXRBdHRyaWJ1dGUiLCJ0b2dnbGVDbGFzcyIsImludGVydmFsIiwia2V5Ym9hcmQiLCJzbGlkZSIsInBhdXNlIiwid3JhcCIsImciLCJwIiwiTkVYVCIsIlBSRVYiLCJMRUZUIiwiUklHSFQiLCJtIiwiU0xJREUiLCJTTElEIiwiS0VZRE9XTiIsIk1PVVNFRU5URVIiLCJNT1VTRUxFQVZFIiwiTE9BRF9EQVRBX0FQSSIsIkUiLCJDQVJPVVNFTCIsIklURU0iLCJ2IiwiQUNUSVZFX0lURU0iLCJORVhUX1BSRVYiLCJJTkRJQ0FUT1JTIiwiREFUQV9TTElERSIsIkRBVEFfUklERSIsIlQiLCJfaXRlbXMiLCJfaW50ZXJ2YWwiLCJfYWN0aXZlRWxlbWVudCIsIl9pc1BhdXNlZCIsIl9pc1NsaWRpbmciLCJfY29uZmlnIiwiX2dldENvbmZpZyIsIl9pbmRpY2F0b3JzRWxlbWVudCIsIl9hZGRFdmVudExpc3RlbmVycyIsIm5leHQiLCJfc2xpZGUiLCJuZXh0V2hlblZpc2libGUiLCJoaWRkZW4iLCJwcmV2IiwiUFJFVklPVVMiLCJjeWNsZSIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInZpc2liaWxpdHlTdGF0ZSIsImJpbmQiLCJ0byIsIl9nZXRJdGVtSW5kZXgiLCJvZmYiLCJleHRlbmQiLCJfa2V5ZG93biIsImRvY3VtZW50RWxlbWVudCIsInRhZ05hbWUiLCJ3aGljaCIsIm1ha2VBcnJheSIsImluZGV4T2YiLCJfZ2V0SXRlbUJ5RGlyZWN0aW9uIiwiX3RyaWdnZXJTbGlkZUV2ZW50IiwicmVsYXRlZFRhcmdldCIsImRpcmVjdGlvbiIsIl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50IiwiY2hpbGRyZW4iLCJfZGF0YUFwaUNsaWNrSGFuZGxlciIsIlNIT1dOIiwiSElERSIsIkhJRERFTiIsIkNPTExBUFNFIiwiQ09MTEFQU0lORyIsIkNPTExBUFNFRCIsIldJRFRIIiwiSEVJR0hUIiwiQUNUSVZFUyIsIl9pc1RyYW5zaXRpb25pbmciLCJfdHJpZ2dlckFycmF5IiwiaWQiLCJfcGFyZW50IiwiX2dldFBhcmVudCIsIl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MiLCJfZ2V0RGltZW5zaW9uIiwiYXR0ciIsInNldFRyYW5zaXRpb25pbmciLCJzbGljZSIsIl9nZXRUYXJnZXRGcm9tRWxlbWVudCIsIkNMSUNLIiwiRk9DVVNJTl9EQVRBX0FQSSIsIktFWURPV05fREFUQV9BUEkiLCJCQUNLRFJPUCIsIkRJU0FCTEVEIiwiRk9STV9DSElMRCIsIlJPTEVfTUVOVSIsIlJPTEVfTElTVEJPWCIsIk5BVkJBUl9OQVYiLCJWSVNJQkxFX0lURU1TIiwiZGlzYWJsZWQiLCJfZ2V0UGFyZW50RnJvbUVsZW1lbnQiLCJfY2xlYXJNZW51cyIsImNsYXNzTmFtZSIsImluc2VydEJlZm9yZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImNvbnRhaW5zIiwiX2RhdGFBcGlLZXlkb3duSGFuZGxlciIsInN0b3BQcm9wYWdhdGlvbiIsImJhY2tkcm9wIiwiRk9DVVNJTiIsIlJFU0laRSIsIkNMSUNLX0RJU01JU1MiLCJLRVlET1dOX0RJU01JU1MiLCJNT1VTRVVQX0RJU01JU1MiLCJNT1VTRURPV05fRElTTUlTUyIsIlNDUk9MTEJBUl9NRUFTVVJFUiIsIk9QRU4iLCJESUFMT0ciLCJEQVRBX0RJU01JU1MiLCJGSVhFRF9DT05URU5UIiwiX2RpYWxvZyIsIl9iYWNrZHJvcCIsIl9pc1Nob3duIiwiX2lzQm9keU92ZXJmbG93aW5nIiwiX2lnbm9yZUJhY2tkcm9wQ2xpY2siLCJfb3JpZ2luYWxCb2R5UGFkZGluZyIsIl9zY3JvbGxiYXJXaWR0aCIsIl9jaGVja1Njcm9sbGJhciIsIl9zZXRTY3JvbGxiYXIiLCJib2R5IiwiX3NldEVzY2FwZUV2ZW50IiwiX3NldFJlc2l6ZUV2ZW50IiwiX3Nob3dCYWNrZHJvcCIsIl9zaG93RWxlbWVudCIsIl9oaWRlTW9kYWwiLCJOb2RlIiwiRUxFTUVOVF9OT0RFIiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5IiwicmVtb3ZlQXR0cmlidXRlIiwic2Nyb2xsVG9wIiwiX2VuZm9yY2VGb2N1cyIsImhhcyIsIl9oYW5kbGVVcGRhdGUiLCJfcmVzZXRBZGp1c3RtZW50cyIsIl9yZXNldFNjcm9sbGJhciIsIl9yZW1vdmVCYWNrZHJvcCIsImFwcGVuZFRvIiwiY3VycmVudFRhcmdldCIsIl9hZGp1c3REaWFsb2ciLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsImNsaWVudFdpZHRoIiwiaW5uZXJXaWR0aCIsIl9nZXRTY3JvbGxiYXJXaWR0aCIsInBhcnNlSW50Iiwib2Zmc2V0V2lkdGgiLCJEZWZhdWx0Iiwib2Zmc2V0IiwibWV0aG9kIiwiQUNUSVZBVEUiLCJTQ1JPTEwiLCJEUk9QRE9XTl9JVEVNIiwiRFJPUERPV05fTUVOVSIsIk5BVl9MSU5LIiwiTkFWIiwiREFUQV9TUFkiLCJMSVNUX0lURU0iLCJMSSIsIkxJX0RST1BET1dOIiwiTkFWX0xJTktTIiwiRFJPUERPV04iLCJEUk9QRE9XTl9JVEVNUyIsIkRST1BET1dOX1RPR0dMRSIsIk9GRlNFVCIsIlBPU0lUSU9OIiwiX3Njcm9sbEVsZW1lbnQiLCJfc2VsZWN0b3IiLCJfb2Zmc2V0cyIsIl90YXJnZXRzIiwiX2FjdGl2ZVRhcmdldCIsIl9zY3JvbGxIZWlnaHQiLCJfcHJvY2VzcyIsInJlZnJlc2giLCJfZ2V0U2Nyb2xsVG9wIiwiX2dldFNjcm9sbEhlaWdodCIsIm1hcCIsInRvcCIsImZpbHRlciIsInNvcnQiLCJmb3JFYWNoIiwicHVzaCIsInBhZ2VZT2Zmc2V0IiwibWF4IiwiX2dldE9mZnNldEhlaWdodCIsImlubmVySGVpZ2h0IiwiX2FjdGl2YXRlIiwiX2NsZWFyIiwiam9pbiIsInBhcmVudHMiLCJBIiwiTElTVCIsIkZBREVfQ0hJTEQiLCJBQ1RJVkVfQ0hJTEQiLCJEUk9QRE9XTl9BQ1RJVkVfQ0hJTEQiLCJfdHJhbnNpdGlvbkNvbXBsZXRlIiwiVGV0aGVyIiwiYW5pbWF0aW9uIiwidGVtcGxhdGUiLCJ0aXRsZSIsImRlbGF5IiwiaHRtbCIsInNlbGVjdG9yIiwicGxhY2VtZW50IiwiY29uc3RyYWludHMiLCJjb250YWluZXIiLCJUT1AiLCJCT1RUT00iLCJPVVQiLCJJTlNFUlRFRCIsIkZPQ1VTT1VUIiwiVE9PTFRJUCIsIlRPT0xUSVBfSU5ORVIiLCJlbmFibGVkIiwiSE9WRVIiLCJNQU5VQUwiLCJJIiwiX2lzRW5hYmxlZCIsIl90aW1lb3V0IiwiX2hvdmVyU3RhdGUiLCJfYWN0aXZlVHJpZ2dlciIsIl90ZXRoZXIiLCJjb25maWciLCJ0aXAiLCJfc2V0TGlzdGVuZXJzIiwiZW5hYmxlIiwiZGlzYWJsZSIsInRvZ2dsZUVuYWJsZWQiLCJEQVRBX0tFWSIsIl9nZXREZWxlZ2F0ZUNvbmZpZyIsImNsaWNrIiwiX2lzV2l0aEFjdGl2ZVRyaWdnZXIiLCJfZW50ZXIiLCJfbGVhdmUiLCJnZXRUaXBFbGVtZW50IiwiY2xlYXJUaW1lb3V0IiwiY2xlYW51cFRldGhlciIsIkVWRU5UX0tFWSIsImlzV2l0aENvbnRlbnQiLCJvd25lckRvY3VtZW50IiwiTkFNRSIsInNldENvbnRlbnQiLCJfZ2V0QXR0YWNobWVudCIsImF0dGFjaG1lbnQiLCJjbGFzc2VzIiwiY2xhc3NQcmVmaXgiLCJhZGRUYXJnZXRDbGFzc2VzIiwicG9zaXRpb24iLCJfVFJBTlNJVElPTl9EVVJBVElPTiIsImdldFRpdGxlIiwic2V0RWxlbWVudENvbnRlbnQiLCJlbXB0eSIsImFwcGVuZCIsInRleHQiLCJkZXN0cm95IiwiX2ZpeFRpdGxlIiwiRGVmYXVsdFR5cGUiLCJjb250ZW50IiwiVElUTEUiLCJDT05URU5UIiwiX2dldENvbnRlbnQiLCJzZXRGb2N1c1ZhbHVlIiwidmFsIiwiY29sbGFwc2VBbGwiLCJhY2NvcmRpb24iLCJhY3Rpb24iLCJjb2xsYXBzZSIsInByb3AiLCJlZGl0SW5saW5lRWRpdGFibGUiLCJjaGFuZ2UiLCJjb25zb2xlIiwibG9nIiwic2Nyb2xsIiwiYWRkTWFya2VyIiwibGF0IiwibG9uZyIsImNvbnRlbnRTdHJpbmciLCJsYWJlbCIsInVuZGVmaW5lZCIsIm1hcmtlciIsIk1hcmtlciIsImdvb2dsZSIsIm1hcHMiLCJMYXRMbmciLCJpY29uIiwibWFwX2ljb25fbGFiZWwiLCJpbmZvd2luZG93IiwiSW5mb1dpbmRvdyIsIm1heFdpZHRoIiwiYWRkTGlzdGVuZXIiLCJvcGVuIiwibXVsdGlfc2VsZWN0X3JhZGlvU2VsZWN0ZWQiLCJyaWJib25DbGljayIsInNsaWRlVXAiLCJzbGlkZVRvZ2dsZSIsImNvbnRpbnVlVG9OZXh0UmliYm9uIiwic2xpZGVEb3duIl0sIm1hcHBpbmdzIjoiOztBQUNBLFNBQVNBO0lBRUwsSUFBSUMsWUFBWUMsRUFBRTtJQUVsQixJQUFHRCxVQUFVRSxVQUFVLEdBQ3ZCO1FBRUlELEVBQUUsaUJBQWlCRTtXQUNsQjtRQUNERixFQUFFLGlCQUFpQkc7Ozs7QUFLM0IsU0FBU0MsaUJBQWtCQztJQUN2QixJQUFJQyxrQkFBa0JOLEVBQUU7SUFDeEIsSUFBSUssUUFBUUUsU0FBUztRQUVqQkQsZ0JBQWdCRSxZQUFZO1FBRzVCUixFQUFFSyxTQUFTSSxTQUFTQSxTQUFTQyxLQUFLLDBCQUEwQlA7V0FDekQ7UUFFSEgsRUFBRUssU0FBU0ksU0FBU0EsU0FBU0MsS0FBSywwQkFBMEJSO1FBRzVELElBQUlTLElBQUk7UUFDUlgsRUFBRSxrQ0FBa0NZLEtBQUs7WUFDckNEOztRQUVKLElBQUlBLElBQUksR0FBRztZQUNQTCxnQkFBZ0JPLFNBQVM7Ozs7O0FBV3JDLFNBQVNDLG1CQUFtQkMsUUFBUUM7SUFDaEMsSUFBR2hCLEVBQUVlLFFBQVFMLEtBQUssYUFBYU8sU0FBUyxtQkFDeEM7UUFDSWpCLEVBQUVnQixVQUFVRSxNQUFN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QSxTQUFTd0wsS0FBSyxzQkFBc0IwUTtRQUN4RDNjLEVBQUVLLFNBQVNJLFNBQVNBLFNBQVNrSixZQUFZOzs7O0FBSWpELFNBQVNpVCxxQkFBcUJ2YztJQUN0QkwsRUFBRSxzRUFBc0VRLFlBQVk7SUFDcEZSLEVBQUUsc0JBQXNCMGM7SUFHeEIxYyxFQUFFSyxTQUFTSSxTQUFTQSxTQUFTd0wsT0FBT0EsS0FBSyxzQkFBc0I0UTtJQUMvRDdjLEVBQUVLLFNBQVNJLFNBQVNBLFNBQVN3TCxLQUFLLHFCQUFxQnBMLFNBQVM7SUFDaEViLEVBQUVLLFNBQVNJLFNBQVNBLFNBQVN3TCxPQUFPdkwsS0FBSyxtREFBbURHLFNBQVM7OztBQUk3R2IsRUFBRSxhQUFhNkksR0FBRyxxQkFBcUIsU0FBU3BIO0lBQ3hDLEtBQUl6QixFQUFFeUIsRUFBRUUsUUFBUVYsU0FBUyw0QkFBMkI7UUFDaERqQixFQUFFeUUsTUFBTTRILE9BQU8zTCxLQUFLLGtCQUFrQkYsWUFBWSxpQkFBaUJLLFNBQVM7UUFDNUViLEVBQUV5RSxNQUFNNEgsT0FBTzNMLEtBQUssYUFBYVA7UUFDakNILEVBQUV5RSxNQUFNNEgsT0FBTzNMLEtBQUssYUFBYVI7O0dBRXRDMkksR0FBRyxzQkFBc0IsU0FBU3BIO0lBQ2pDLEtBQUl6QixFQUFFeUIsRUFBRUUsUUFBUVYsU0FBUyw0QkFBMkI7UUFDaERqQixFQUFFeUUsTUFBTTRILE9BQU8zTCxLQUFLLGdCQUFnQkYsWUFBWSxlQUFlSyxTQUFTO1FBQ3hFYixFQUFFeUUsTUFBTTRILE9BQU8zTCxLQUFLLGFBQWFSO1FBQ2pDRixFQUFFeUUsTUFBTTRILE9BQU8zTCxLQUFLLGFBQWFQOzs7Ozs7Q1R2QzdDLFNBQUFILEdBQUE4RSxRQUFTaEYsVUFBQUE7SUFFTDtHQUtJRSxRQUFFOEUsUUFBQUUiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFdoZW4gYSByZW1vdmUgZmllbGQgaXMgY2xpY2tlZFxyXG5mdW5jdGlvbiBjb3VudHJ5X3JlbW92ZWQoKVxyXG57XHJcbiAgICB2YXIgY291bnRyaWVzID0gJCgnI2NvdW50cmllc19wYXJlbnQgc2VsZWN0Jyk7XHJcblxyXG4gICAgaWYoY291bnRyaWVzLmxlbmd0aCA8PSAxKVxyXG4gICAge1xyXG4gICAgICAgIC8vIGhpZGUgdGhlIHJlbW92ZSBsaW5rc1xyXG4gICAgICAgICQoJy5yZW1vdmVfZmllbGQnKS5oaWRlKCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkKCcucmVtb3ZlX2ZpZWxkJykuc2hvdygpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBHZW5lcmljIHByZXBhcmVkbmVzcyBhY3Rpb24gaXRlbVxyXG5mdW5jdGlvbiBncGFBY3Rpb25DaGFuZ2VkKCBlbGVtZW50ICkge1xyXG4gICAgdmFyIGFkZEFjdGlvbkJ1dHRvbiA9ICQoXCIjYWRkLWFjdGlvbi1idG5cIik7XHJcbiAgICBpZiAoZWxlbWVudC5jaGVja2VkKSB7XHJcbiAgICAgICAgLy8gRW5hYmxlIHRoZSBhZGQgYWN0aW9uIGJ1dHRvblxyXG4gICAgICAgIGFkZEFjdGlvbkJ1dHRvbi5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFNob3cgZGVwYXJ0bWVudCBkcm9wZG93blxyXG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkuZmluZChcIi5ncGFfYWN0aW9uX2RlcGFydG1lbnRcIikuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBIaWRlIGRlcGFydG1lbnQgZHJvcGRvd25cclxuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuZ3BhX2FjdGlvbl9kZXBhcnRtZW50XCIpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgLy8gRGlzYWJsZSB0aGUgYWRkIGFjdGlvbiBidXR0b24gaWYgdGhlcmUgYXJlIG5vIGNoZWNrZWQgYWN0aW9uc1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAkKFwiaW5wdXRbbmFtZT1ncGFfYWN0aW9uXTpjaGVja2VkXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoaSA8IDEpIHtcclxuICAgICAgICAgICAgYWRkQWN0aW9uQnV0dG9uLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxuKiBWZXJpZnkgaWYgdGhlIEFkZCBkZXBhcnRtZW50IG9wdGlvbiBpcyBzZWxlY3RlZCBhbmQgb3BlbiB0aGUgbW9kYWwgd2luZG93XHJcbipcclxuKiBAcGFyYW0gT2JqZWN0IHNlbGVjdCAgICAgIFRoZSBzZWxlY3QgT2JqZWN0XHJcbiogQHBhcmFtIHN0cmluZyBtb2RhbF9pZCAgICBUaGUgbW9kYWwgaWQgdG8gb3BlblxyXG4qL1xyXG5mdW5jdGlvbiBhZGREZXBhcnRtZW50TW9kYWwoc2VsZWN0LCBtb2RhbF9pZCl7XHJcbiAgICBpZigkKHNlbGVjdCkuZmluZChcIjpzZWxlY3RlZFwiKS5oYXNDbGFzcygnYWRkLWRlcGFydG1lbnQnKSlcclxuICAgIHtcclxuICAgICAgICAkKG1vZGFsX2lkKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgfVxyXG59IiwiZnVuY3Rpb24gcmVhZFVSTChpbnB1dCkge1xyXG4gIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xyXG4gICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgXHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJCgnLkFnZW5jeS1kZXRhaWxzX19sb2dvX19wcmV2aWV3JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZS50YXJnZXQucmVzdWx0ICsgJyknKTtcclxuICAgICAgICAgICQoJy5BZ2VuY3ktZGV0YWlsc19fbG9nb19fcHJldmlldycpLmFkZENsYXNzKCdTZWxlY3RlZCcpXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGlucHV0LmZpbGVzWzBdKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByZXZpZXdMb2dvKGxvZ29JbWFnZSl7XHJcbiAgICByZWFkVVJMKGxvZ29JbWFnZSk7XHJcbiAgICAkKFwiI3NlbGVjdC1sb2dvXCIpLmhpZGUoKTtcclxuICAgICQoXCIjcmVwbGFjZS1sb2dvXCIpLnNob3coKTtcclxuICAgICQoXCIjcmVtb3ZlLWxvZ29cIikuc2hvdygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0cmlnZ2VyUHJldmlld0xvZ28oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICQoXCIjaW1nSW5wXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUxvZ29QcmV2aWV3KGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJChcIiNyZXBsYWNlLWxvZ29cIikuaGlkZSgpO1xyXG4gICAgJChcIiNyZW1vdmUtbG9nb1wiKS5oaWRlKCk7XHJcbiAgICAkKFwiI3NlbGVjdC1sb2dvXCIpLnNob3coKTtcclxuICAgICQoJy5BZ2VuY3ktZGV0YWlsc19fbG9nb19fcHJldmlldycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICdub25lJyk7XHJcbiAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5yZW1vdmVDbGFzcygnU2VsZWN0ZWQnKTtcclxufSIsIi8qIVxyXG4gKiBCb290c3RyYXAgdjQuMC4wLWFscGhhLjYgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbSlcclxuICogQ29weXJpZ2h0IDIwMTEtMjAxNyBUaGUgQm9vdHN0cmFwIEF1dGhvcnMgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ncmFwaHMvY29udHJpYnV0b3JzKVxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gKi9cclxuaWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGpRdWVyeSl0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeS4galF1ZXJ5IG11c3QgYmUgaW5jbHVkZWQgYmVmb3JlIEJvb3RzdHJhcCdzIEphdmFTY3JpcHQuXCIpOytmdW5jdGlvbih0KXt2YXIgZT10LmZuLmpxdWVyeS5zcGxpdChcIiBcIilbMF0uc3BsaXQoXCIuXCIpO2lmKGVbMF08MiYmZVsxXTw5fHwxPT1lWzBdJiY5PT1lWzFdJiZlWzJdPDF8fGVbMF0+PTQpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBhdCBsZWFzdCBqUXVlcnkgdjEuOS4xIGJ1dCBsZXNzIHRoYW4gdjQuMC4wXCIpfShqUXVlcnkpLCtmdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtpZighdCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP3Q6ZX1mdW5jdGlvbiBlKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIrdHlwZW9mIGUpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJihPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKHQsZSk6dC5fX3Byb3RvX189ZSl9ZnVuY3Rpb24gbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0sbz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpLHI9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0KXtyZXR1cm57fS50b1N0cmluZy5jYWxsKHQpLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbih0KXtyZXR1cm4odFswXXx8dCkubm9kZVR5cGV9ZnVuY3Rpb24gaSgpe3JldHVybntiaW5kVHlwZTphLmVuZCxkZWxlZ2F0ZVR5cGU6YS5lbmQsaGFuZGxlOmZ1bmN0aW9uKGUpe2lmKHQoZS50YXJnZXQpLmlzKHRoaXMpKXJldHVybiBlLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19fWZ1bmN0aW9uIG8oKXtpZih3aW5kb3cuUVVuaXQpcmV0dXJuITE7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvb3RzdHJhcFwiKTtmb3IodmFyIGUgaW4gaClpZih2b2lkIDAhPT10LnN0eWxlW2VdKXJldHVybntlbmQ6aFtlXX07cmV0dXJuITF9ZnVuY3Rpb24gcihlKXt2YXIgbj10aGlzLGk9ITE7cmV0dXJuIHQodGhpcykub25lKGMuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24oKXtpPSEwfSksc2V0VGltZW91dChmdW5jdGlvbigpe2l8fGMudHJpZ2dlclRyYW5zaXRpb25FbmQobil9LGUpLHRoaXN9ZnVuY3Rpb24gcygpe2E9bygpLHQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQ9cixjLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiYodC5ldmVudC5zcGVjaWFsW2MuVFJBTlNJVElPTl9FTkRdPWkoKSl9dmFyIGE9ITEsbD0xZTYsaD17V2Via2l0VHJhbnNpdGlvbjpcIndlYmtpdFRyYW5zaXRpb25FbmRcIixNb3pUcmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwiLE9UcmFuc2l0aW9uOlwib1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmRcIix0cmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwifSxjPXtUUkFOU0lUSU9OX0VORDpcImJzVHJhbnNpdGlvbkVuZFwiLGdldFVJRDpmdW5jdGlvbih0KXtkbyB0Kz1+fihNYXRoLnJhbmRvbSgpKmwpO3doaWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHQpKTtyZXR1cm4gdH0sZ2V0U2VsZWN0b3JGcm9tRWxlbWVudDpmdW5jdGlvbih0KXt2YXIgZT10LmdldEF0dHJpYnV0ZShcImRhdGEtdGFyZ2V0XCIpO3JldHVybiBlfHwoZT10LmdldEF0dHJpYnV0ZShcImhyZWZcIil8fFwiXCIsZT0vXiNbYS16XS9pLnRlc3QoZSk/ZTpudWxsKSxlfSxyZWZsb3c6ZnVuY3Rpb24odCl7cmV0dXJuIHQub2Zmc2V0SGVpZ2h0fSx0cmlnZ2VyVHJhbnNpdGlvbkVuZDpmdW5jdGlvbihlKXt0KGUpLnRyaWdnZXIoYS5lbmQpfSxzdXBwb3J0c1RyYW5zaXRpb25FbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gQm9vbGVhbihhKX0sdHlwZUNoZWNrQ29uZmlnOmZ1bmN0aW9uKHQsaSxvKXtmb3IodmFyIHIgaW4gbylpZihvLmhhc093blByb3BlcnR5KHIpKXt2YXIgcz1vW3JdLGE9aVtyXSxsPWEmJm4oYSk/XCJlbGVtZW50XCI6ZShhKTtpZighbmV3IFJlZ0V4cChzKS50ZXN0KGwpKXRocm93IG5ldyBFcnJvcih0LnRvVXBwZXJDYXNlKCkrXCI6IFwiKygnT3B0aW9uIFwiJytyKydcIiBwcm92aWRlZCB0eXBlIFwiJytsKydcIiAnKSsoJ2J1dCBleHBlY3RlZCB0eXBlIFwiJytzKydcIi4nKSl9fX07cmV0dXJuIHMoKSxjfShqUXVlcnkpLHM9KGZ1bmN0aW9uKHQpe3ZhciBlPVwiYWxlcnRcIixpPVwiNC4wLjAtYWxwaGEuNlwiLHM9XCJicy5hbGVydFwiLGE9XCIuXCIrcyxsPVwiLmRhdGEtYXBpXCIsaD10LmZuW2VdLGM9MTUwLHU9e0RJU01JU1M6J1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXSd9LGQ9e0NMT1NFOlwiY2xvc2VcIithLENMT1NFRDpcImNsb3NlZFwiK2EsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2ErbH0sZj17QUxFUlQ6XCJhbGVydFwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sXz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dH1yZXR1cm4gZS5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24odCl7dD10fHx0aGlzLl9lbGVtZW50O3ZhciBlPXRoaXMuX2dldFJvb3RFbGVtZW50KHQpLG49dGhpcy5fdHJpZ2dlckNsb3NlRXZlbnQoZSk7bi5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8dGhpcy5fcmVtb3ZlRWxlbWVudChlKX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LHMpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2dldFJvb3RFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKSxpPSExO3JldHVybiBuJiYoaT10KG4pWzBdKSxpfHwoaT10KGUpLmNsb3Nlc3QoXCIuXCIrZi5BTEVSVClbMF0pLGl9LGUucHJvdG90eXBlLl90cmlnZ2VyQ2xvc2VFdmVudD1mdW5jdGlvbihlKXt2YXIgbj10LkV2ZW50KGQuQ0xPU0UpO3JldHVybiB0KGUpLnRyaWdnZXIobiksbn0sZS5wcm90b3R5cGUuX3JlbW92ZUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztyZXR1cm4gdChlKS5yZW1vdmVDbGFzcyhmLlNIT1cpLHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQoZSkuaGFzQ2xhc3MoZi5GQURFKT92b2lkIHQoZSkub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24odCl7cmV0dXJuIG4uX2Rlc3Ryb3lFbGVtZW50KGUsdCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjKTp2b2lkIHRoaXMuX2Rlc3Ryb3lFbGVtZW50KGUpfSxlLnByb3RvdHlwZS5fZGVzdHJveUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dChlKS5kZXRhY2goKS50cmlnZ2VyKGQuQ0xPU0VEKS5yZW1vdmUoKX0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLG89aS5kYXRhKHMpO298fChvPW5ldyBlKHRoaXMpLGkuZGF0YShzLG8pKSxcImNsb3NlXCI9PT1uJiZvW25dKHRoaXMpfSl9LGUuX2hhbmRsZURpc21pc3M9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2UmJmUucHJldmVudERlZmF1bHQoKSx0LmNsb3NlKHRoaXMpfX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKGQuQ0xJQ0tfREFUQV9BUEksdS5ESVNNSVNTLF8uX2hhbmRsZURpc21pc3MobmV3IF8pKSx0LmZuW2VdPV8uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPV8sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxfLl9qUXVlcnlJbnRlcmZhY2V9LF99KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJidXR0b25cIixpPVwiNC4wLjAtYWxwaGEuNlwiLHI9XCJicy5idXR0b25cIixzPVwiLlwiK3IsYT1cIi5kYXRhLWFwaVwiLGw9dC5mbltlXSxoPXtBQ1RJVkU6XCJhY3RpdmVcIixCVVRUT046XCJidG5cIixGT0NVUzpcImZvY3VzXCJ9LGM9e0RBVEFfVE9HR0xFX0NBUlJPVDonW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nLElOUFVUOlwiaW5wdXRcIixBQ1RJVkU6XCIuYWN0aXZlXCIsQlVUVE9OOlwiLmJ0blwifSx1PXtDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrcythLEZPQ1VTX0JMVVJfREFUQV9BUEk6XCJmb2N1c1wiK3MrYStcIiBcIisoXCJibHVyXCIrcythKX0sZD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dH1yZXR1cm4gZS5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dmFyIGU9ITAsbj10KHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoYy5EQVRBX1RPR0dMRSlbMF07aWYobil7dmFyIGk9dCh0aGlzLl9lbGVtZW50KS5maW5kKGMuSU5QVVQpWzBdO2lmKGkpe2lmKFwicmFkaW9cIj09PWkudHlwZSlpZihpLmNoZWNrZWQmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoaC5BQ1RJVkUpKWU9ITE7ZWxzZXt2YXIgbz10KG4pLmZpbmQoYy5BQ1RJVkUpWzBdO28mJnQobykucmVtb3ZlQ2xhc3MoaC5BQ1RJVkUpfWUmJihpLmNoZWNrZWQ9IXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoaC5BQ1RJVkUpLHQoaSkudHJpZ2dlcihcImNoYW5nZVwiKSksaS5mb2N1cygpfX10aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtcHJlc3NlZFwiLCF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSksZSYmdCh0aGlzLl9lbGVtZW50KS50b2dnbGVDbGFzcyhoLkFDVElWRSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxyKSx0aGlzLl9lbGVtZW50PW51bGx9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKS5kYXRhKHIpO2l8fChpPW5ldyBlKHRoaXMpLHQodGhpcykuZGF0YShyLGkpKSxcInRvZ2dsZVwiPT09biYmaVtuXSgpfSl9LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbih1LkNMSUNLX0RBVEFfQVBJLGMuREFUQV9UT0dHTEVfQ0FSUk9ULGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt2YXIgbj1lLnRhcmdldDt0KG4pLmhhc0NsYXNzKGguQlVUVE9OKXx8KG49dChuKS5jbG9zZXN0KGMuQlVUVE9OKSksZC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChuKSxcInRvZ2dsZVwiKX0pLm9uKHUuRk9DVVNfQkxVUl9EQVRBX0FQSSxjLkRBVEFfVE9HR0xFX0NBUlJPVCxmdW5jdGlvbihlKXt2YXIgbj10KGUudGFyZ2V0KS5jbG9zZXN0KGMuQlVUVE9OKVswXTt0KG4pLnRvZ2dsZUNsYXNzKGguRk9DVVMsL15mb2N1cyhpbik/JC8udGVzdChlLnR5cGUpKX0pLHQuZm5bZV09ZC5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9ZCx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1sLGQuX2pRdWVyeUludGVyZmFjZX0sZH0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImNhcm91c2VsXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMuY2Fyb3VzZWxcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTYwMCxkPTM3LGY9MzksXz17aW50ZXJ2YWw6NWUzLGtleWJvYXJkOiEwLHNsaWRlOiExLHBhdXNlOlwiaG92ZXJcIix3cmFwOiEwfSxnPXtpbnRlcnZhbDpcIihudW1iZXJ8Ym9vbGVhbilcIixrZXlib2FyZDpcImJvb2xlYW5cIixzbGlkZTpcIihib29sZWFufHN0cmluZylcIixwYXVzZTpcIihzdHJpbmd8Ym9vbGVhbilcIix3cmFwOlwiYm9vbGVhblwifSxwPXtORVhUOlwibmV4dFwiLFBSRVY6XCJwcmV2XCIsTEVGVDpcImxlZnRcIixSSUdIVDpcInJpZ2h0XCJ9LG09e1NMSURFOlwic2xpZGVcIitsLFNMSUQ6XCJzbGlkXCIrbCxLRVlET1dOOlwia2V5ZG93blwiK2wsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitsLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrbCxMT0FEX0RBVEFfQVBJOlwibG9hZFwiK2wraCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxFPXtDQVJPVVNFTDpcImNhcm91c2VsXCIsQUNUSVZFOlwiYWN0aXZlXCIsU0xJREU6XCJzbGlkZVwiLFJJR0hUOlwiY2Fyb3VzZWwtaXRlbS1yaWdodFwiLExFRlQ6XCJjYXJvdXNlbC1pdGVtLWxlZnRcIixORVhUOlwiY2Fyb3VzZWwtaXRlbS1uZXh0XCIsUFJFVjpcImNhcm91c2VsLWl0ZW0tcHJldlwiLElURU06XCJjYXJvdXNlbC1pdGVtXCJ9LHY9e0FDVElWRTpcIi5hY3RpdmVcIixBQ1RJVkVfSVRFTTpcIi5hY3RpdmUuY2Fyb3VzZWwtaXRlbVwiLElURU06XCIuY2Fyb3VzZWwtaXRlbVwiLE5FWFRfUFJFVjpcIi5jYXJvdXNlbC1pdGVtLW5leHQsIC5jYXJvdXNlbC1pdGVtLXByZXZcIixJTkRJQ0FUT1JTOlwiLmNhcm91c2VsLWluZGljYXRvcnNcIixEQVRBX1NMSURFOlwiW2RhdGEtc2xpZGVdLCBbZGF0YS1zbGlkZS10b11cIixEQVRBX1JJREU6J1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXSd9LFQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKGUsaSl7bih0aGlzLGgpLHRoaXMuX2l0ZW1zPW51bGwsdGhpcy5faW50ZXJ2YWw9bnVsbCx0aGlzLl9hY3RpdmVFbGVtZW50PW51bGwsdGhpcy5faXNQYXVzZWQ9ITEsdGhpcy5faXNTbGlkaW5nPSExLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fZWxlbWVudD10KGUpWzBdLHRoaXMuX2luZGljYXRvcnNFbGVtZW50PXQodGhpcy5fZWxlbWVudCkuZmluZCh2LklORElDQVRPUlMpWzBdLHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCl9cmV0dXJuIGgucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXtpZih0aGlzLl9pc1NsaWRpbmcpdGhyb3cgbmV3IEVycm9yKFwiQ2Fyb3VzZWwgaXMgc2xpZGluZ1wiKTt0aGlzLl9zbGlkZShwLk5FWFQpfSxoLnByb3RvdHlwZS5uZXh0V2hlblZpc2libGU9ZnVuY3Rpb24oKXtkb2N1bWVudC5oaWRkZW58fHRoaXMubmV4dCgpfSxoLnByb3RvdHlwZS5wcmV2PWZ1bmN0aW9uKCl7aWYodGhpcy5faXNTbGlkaW5nKXRocm93IG5ldyBFcnJvcihcIkNhcm91c2VsIGlzIHNsaWRpbmdcIik7dGhpcy5fc2xpZGUocC5QUkVWSU9VUyl9LGgucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKGUpe2V8fCh0aGlzLl9pc1BhdXNlZD0hMCksdCh0aGlzLl9lbGVtZW50KS5maW5kKHYuTkVYVF9QUkVWKVswXSYmci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHIudHJpZ2dlclRyYW5zaXRpb25FbmQodGhpcy5fZWxlbWVudCksdGhpcy5jeWNsZSghMCkpLGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpLHRoaXMuX2ludGVydmFsPW51bGx9LGgucHJvdG90eXBlLmN5Y2xlPWZ1bmN0aW9uKHQpe3R8fCh0aGlzLl9pc1BhdXNlZD0hMSksdGhpcy5faW50ZXJ2YWwmJihjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsKSx0aGlzLl9pbnRlcnZhbD1udWxsKSx0aGlzLl9jb25maWcuaW50ZXJ2YWwmJiF0aGlzLl9pc1BhdXNlZCYmKHRoaXMuX2ludGVydmFsPXNldEludGVydmFsKChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGU/dGhpcy5uZXh0V2hlblZpc2libGU6dGhpcy5uZXh0KS5iaW5kKHRoaXMpLHRoaXMuX2NvbmZpZy5pbnRlcnZhbCkpfSxoLnByb3RvdHlwZS50bz1mdW5jdGlvbihlKXt2YXIgbj10aGlzO3RoaXMuX2FjdGl2ZUVsZW1lbnQ9dCh0aGlzLl9lbGVtZW50KS5maW5kKHYuQUNUSVZFX0lURU0pWzBdO3ZhciBpPXRoaXMuX2dldEl0ZW1JbmRleCh0aGlzLl9hY3RpdmVFbGVtZW50KTtpZighKGU+dGhpcy5faXRlbXMubGVuZ3RoLTF8fGU8MCkpe2lmKHRoaXMuX2lzU2xpZGluZylyZXR1cm4gdm9pZCB0KHRoaXMuX2VsZW1lbnQpLm9uZShtLlNMSUQsZnVuY3Rpb24oKXtyZXR1cm4gbi50byhlKX0pO2lmKGk9PT1lKXJldHVybiB0aGlzLnBhdXNlKCksdm9pZCB0aGlzLmN5Y2xlKCk7dmFyIG89ZT5pP3AuTkVYVDpwLlBSRVZJT1VTO3RoaXMuX3NsaWRlKG8sdGhpcy5faXRlbXNbZV0pfX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkub2ZmKGwpLHQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHRoaXMuX2l0ZW1zPW51bGwsdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX2ludGVydmFsPW51bGwsdGhpcy5faXNQYXVzZWQ9bnVsbCx0aGlzLl9pc1NsaWRpbmc9bnVsbCx0aGlzLl9hY3RpdmVFbGVtZW50PW51bGwsdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQ9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxfLG4pLHIudHlwZUNoZWNrQ29uZmlnKGUsbixnKSxufSxoLnByb3RvdHlwZS5fYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2NvbmZpZy5rZXlib2FyZCYmdCh0aGlzLl9lbGVtZW50KS5vbihtLktFWURPV04sZnVuY3Rpb24odCl7cmV0dXJuIGUuX2tleWRvd24odCl9KSxcImhvdmVyXCIhPT10aGlzLl9jb25maWcucGF1c2V8fFwib250b3VjaHN0YXJ0XCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnR8fHQodGhpcy5fZWxlbWVudCkub24obS5NT1VTRUVOVEVSLGZ1bmN0aW9uKHQpe3JldHVybiBlLnBhdXNlKHQpfSkub24obS5NT1VTRUxFQVZFLGZ1bmN0aW9uKHQpe3JldHVybiBlLmN5Y2xlKHQpfSl9LGgucHJvdG90eXBlLl9rZXlkb3duPWZ1bmN0aW9uKHQpe2lmKCEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KHQudGFyZ2V0LnRhZ05hbWUpKXN3aXRjaCh0LndoaWNoKXtjYXNlIGQ6dC5wcmV2ZW50RGVmYXVsdCgpLHRoaXMucHJldigpO2JyZWFrO2Nhc2UgZjp0LnByZXZlbnREZWZhdWx0KCksdGhpcy5uZXh0KCk7YnJlYWs7ZGVmYXVsdDpyZXR1cm59fSxoLnByb3RvdHlwZS5fZ2V0SXRlbUluZGV4PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLl9pdGVtcz10Lm1ha2VBcnJheSh0KGUpLnBhcmVudCgpLmZpbmQodi5JVEVNKSksdGhpcy5faXRlbXMuaW5kZXhPZihlKX0saC5wcm90b3R5cGUuX2dldEl0ZW1CeURpcmVjdGlvbj1mdW5jdGlvbih0LGUpe3ZhciBuPXQ9PT1wLk5FWFQsaT10PT09cC5QUkVWSU9VUyxvPXRoaXMuX2dldEl0ZW1JbmRleChlKSxyPXRoaXMuX2l0ZW1zLmxlbmd0aC0xLHM9aSYmMD09PW98fG4mJm89PT1yO2lmKHMmJiF0aGlzLl9jb25maWcud3JhcClyZXR1cm4gZTt2YXIgYT10PT09cC5QUkVWSU9VUz8tMToxLGw9KG8rYSkldGhpcy5faXRlbXMubGVuZ3RoO3JldHVybiBsPT09LTE/dGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdOnRoaXMuX2l0ZW1zW2xdfSxoLnByb3RvdHlwZS5fdHJpZ2dlclNsaWRlRXZlbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgaT10LkV2ZW50KG0uU0xJREUse3JlbGF0ZWRUYXJnZXQ6ZSxkaXJlY3Rpb246bn0pO3JldHVybiB0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoaSksaX0saC5wcm90b3R5cGUuX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQ9ZnVuY3Rpb24oZSl7aWYodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpe3QodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpLmZpbmQodi5BQ1RJVkUpLnJlbW92ZUNsYXNzKEUuQUNUSVZFKTt2YXIgbj10aGlzLl9pbmRpY2F0b3JzRWxlbWVudC5jaGlsZHJlblt0aGlzLl9nZXRJdGVtSW5kZXgoZSldO24mJnQobikuYWRkQ2xhc3MoRS5BQ1RJVkUpfX0saC5wcm90b3R5cGUuX3NsaWRlPWZ1bmN0aW9uKGUsbil7dmFyIGk9dGhpcyxvPXQodGhpcy5fZWxlbWVudCkuZmluZCh2LkFDVElWRV9JVEVNKVswXSxzPW58fG8mJnRoaXMuX2dldEl0ZW1CeURpcmVjdGlvbihlLG8pLGE9Qm9vbGVhbih0aGlzLl9pbnRlcnZhbCksbD12b2lkIDAsaD12b2lkIDAsYz12b2lkIDA7aWYoZT09PXAuTkVYVD8obD1FLkxFRlQsaD1FLk5FWFQsYz1wLkxFRlQpOihsPUUuUklHSFQsaD1FLlBSRVYsYz1wLlJJR0hUKSxzJiZ0KHMpLmhhc0NsYXNzKEUuQUNUSVZFKSlyZXR1cm4gdm9pZCh0aGlzLl9pc1NsaWRpbmc9ITEpO3ZhciBkPXRoaXMuX3RyaWdnZXJTbGlkZUV2ZW50KHMsYyk7aWYoIWQuaXNEZWZhdWx0UHJldmVudGVkKCkmJm8mJnMpe3RoaXMuX2lzU2xpZGluZz0hMCxhJiZ0aGlzLnBhdXNlKCksdGhpcy5fc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudChzKTt2YXIgZj10LkV2ZW50KG0uU0xJRCx7cmVsYXRlZFRhcmdldDpzLGRpcmVjdGlvbjpjfSk7ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhFLlNMSURFKT8odChzKS5hZGRDbGFzcyhoKSxyLnJlZmxvdyhzKSx0KG8pLmFkZENsYXNzKGwpLHQocykuYWRkQ2xhc3MobCksdChvKS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbigpe3QocykucmVtb3ZlQ2xhc3MobCtcIiBcIitoKS5hZGRDbGFzcyhFLkFDVElWRSksdChvKS5yZW1vdmVDbGFzcyhFLkFDVElWRStcIiBcIitoK1wiIFwiK2wpLGkuX2lzU2xpZGluZz0hMSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cmV0dXJuIHQoaS5fZWxlbWVudCkudHJpZ2dlcihmKX0sMCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KSk6KHQobykucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUpLHQocykuYWRkQ2xhc3MoRS5BQ1RJVkUpLHRoaXMuX2lzU2xpZGluZz0hMSx0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoZikpLGEmJnRoaXMuY3ljbGUoKX19LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89dC5leHRlbmQoe30sXyx0KHRoaXMpLmRhdGEoKSk7XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZ0LmV4dGVuZChvLGUpO3ZhciByPVwic3RyaW5nXCI9PXR5cGVvZiBlP2U6by5zbGlkZTtpZihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcIm51bWJlclwiPT10eXBlb2YgZSluLnRvKGUpO2Vsc2UgaWYoXCJzdHJpbmdcIj09dHlwZW9mIHIpe2lmKHZvaWQgMD09PW5bcl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK3IrJ1wiJyk7bltyXSgpfWVsc2Ugby5pbnRlcnZhbCYmKG4ucGF1c2UoKSxuLmN5Y2xlKCkpfSl9LGguX2RhdGFBcGlDbGlja0hhbmRsZXI9ZnVuY3Rpb24oZSl7dmFyIG49ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpO2lmKG4pe3ZhciBpPXQobilbMF07aWYoaSYmdChpKS5oYXNDbGFzcyhFLkNBUk9VU0VMKSl7dmFyIG89dC5leHRlbmQoe30sdChpKS5kYXRhKCksdCh0aGlzKS5kYXRhKCkpLHM9dGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvXCIpO3MmJihvLmludGVydmFsPSExKSxoLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KGkpLG8pLHMmJnQoaSkuZGF0YShhKS50byhzKSxlLnByZXZlbnREZWZhdWx0KCl9fX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBffX1dKSxofSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihtLkNMSUNLX0RBVEFfQVBJLHYuREFUQV9TTElERSxULl9kYXRhQXBpQ2xpY2tIYW5kbGVyKSx0KHdpbmRvdykub24obS5MT0FEX0RBVEFfQVBJLGZ1bmN0aW9uKCl7dCh2LkRBVEFfUklERSkuZWFjaChmdW5jdGlvbigpe3ZhciBlPXQodGhpcyk7VC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoZSxlLmRhdGEoKSl9KX0pLHQuZm5bZV09VC5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9VCx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLFQuX2pRdWVyeUludGVyZmFjZX0sVH0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImNvbGxhcHNlXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMuY29sbGFwc2VcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTYwMCxkPXt0b2dnbGU6ITAscGFyZW50OlwiXCJ9LGY9e3RvZ2dsZTpcImJvb2xlYW5cIixwYXJlbnQ6XCJzdHJpbmdcIn0sXz17U0hPVzpcInNob3dcIitsLFNIT1dOOlwic2hvd25cIitsLEhJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LGc9e1NIT1c6XCJzaG93XCIsQ09MTEFQU0U6XCJjb2xsYXBzZVwiLENPTExBUFNJTkc6XCJjb2xsYXBzaW5nXCIsQ09MTEFQU0VEOlwiY29sbGFwc2VkXCJ9LHA9e1dJRFRIOlwid2lkdGhcIixIRUlHSFQ6XCJoZWlnaHRcIn0sbT17QUNUSVZFUzpcIi5jYXJkID4gLnNob3csIC5jYXJkID4gLmNvbGxhcHNpbmdcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nfSxFPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChlLGkpe24odGhpcyxsKSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fZWxlbWVudD1lLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fdHJpZ2dlckFycmF5PXQubWFrZUFycmF5KHQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJytlLmlkKydcIl0sJysoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycrZS5pZCsnXCJdJykpKSx0aGlzLl9wYXJlbnQ9dGhpcy5fY29uZmlnLnBhcmVudD90aGlzLl9nZXRQYXJlbnQoKTpudWxsLHRoaXMuX2NvbmZpZy5wYXJlbnR8fHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLl9lbGVtZW50LHRoaXMuX3RyaWdnZXJBcnJheSksdGhpcy5fY29uZmlnLnRvZ2dsZSYmdGhpcy50b2dnbGUoKX1yZXR1cm4gbC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhnLlNIT1cpP3RoaXMuaGlkZSgpOnRoaXMuc2hvdygpfSxsLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiQ29sbGFwc2UgaXMgdHJhbnNpdGlvbmluZ1wiKTtpZighdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhnLlNIT1cpKXt2YXIgbj12b2lkIDAsaT12b2lkIDA7aWYodGhpcy5fcGFyZW50JiYobj10Lm1ha2VBcnJheSh0KHRoaXMuX3BhcmVudCkuZmluZChtLkFDVElWRVMpKSxuLmxlbmd0aHx8KG49bnVsbCkpLCEobiYmKGk9dChuKS5kYXRhKGEpLGkmJmkuX2lzVHJhbnNpdGlvbmluZykpKXt2YXIgbz10LkV2ZW50KF8uU0hPVyk7aWYodCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKG8pLCFvLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtuJiYobC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChuKSxcImhpZGVcIiksaXx8dChuKS5kYXRhKGEsbnVsbCkpO3ZhciBzPXRoaXMuX2dldERpbWVuc2lvbigpO3QodGhpcy5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRSkuYWRkQ2xhc3MoZy5DT0xMQVBTSU5HKSx0aGlzLl9lbGVtZW50LnN0eWxlW3NdPTAsdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMuX3RyaWdnZXJBcnJheS5sZW5ndGgmJnQodGhpcy5fdHJpZ2dlckFycmF5KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFRCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksdGhpcy5zZXRUcmFuc2l0aW9uaW5nKCEwKTt2YXIgaD1mdW5jdGlvbigpe3QoZS5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTSU5HKS5hZGRDbGFzcyhnLkNPTExBUFNFKS5hZGRDbGFzcyhnLlNIT1cpLGUuX2VsZW1lbnQuc3R5bGVbc109XCJcIixlLnNldFRyYW5zaXRpb25pbmcoITEpLHQoZS5fZWxlbWVudCkudHJpZ2dlcihfLlNIT1dOKX07aWYoIXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkpcmV0dXJuIHZvaWQgaCgpO3ZhciBjPXNbMF0udG9VcHBlckNhc2UoKStzLnNsaWNlKDEpLGQ9XCJzY3JvbGxcIitjO3QodGhpcy5fZWxlbWVudCkub25lKHIuVFJBTlNJVElPTl9FTkQsaCkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSksdGhpcy5fZWxlbWVudC5zdHlsZVtzXT10aGlzLl9lbGVtZW50W2RdK1wicHhcIn19fX0sbC5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIkNvbGxhcHNlIGlzIHRyYW5zaXRpb25pbmdcIik7aWYodCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhnLlNIT1cpKXt2YXIgbj10LkV2ZW50KF8uSElERSk7aWYodCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKG4pLCFuLmlzRGVmYXVsdFByZXZlbnRlZCgpKXt2YXIgaT10aGlzLl9nZXREaW1lbnNpb24oKSxvPWk9PT1wLldJRFRIP1wib2Zmc2V0V2lkdGhcIjpcIm9mZnNldEhlaWdodFwiO3RoaXMuX2VsZW1lbnQuc3R5bGVbaV09dGhpcy5fZWxlbWVudFtvXStcInB4XCIsci5yZWZsb3codGhpcy5fZWxlbWVudCksdCh0aGlzLl9lbGVtZW50KS5hZGRDbGFzcyhnLkNPTExBUFNJTkcpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0UpLnJlbW92ZUNsYXNzKGcuU0hPVyksdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuX3RyaWdnZXJBcnJheS5sZW5ndGgmJnQodGhpcy5fdHJpZ2dlckFycmF5KS5hZGRDbGFzcyhnLkNPTExBUFNFRCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMSksdGhpcy5zZXRUcmFuc2l0aW9uaW5nKCEwKTt2YXIgcz1mdW5jdGlvbigpe2Uuc2V0VHJhbnNpdGlvbmluZyghMSksdChlLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNJTkcpLmFkZENsYXNzKGcuQ09MTEFQU0UpLnRyaWdnZXIoXy5ISURERU4pfTtyZXR1cm4gdGhpcy5fZWxlbWVudC5zdHlsZVtpXT1cIlwiLHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCk/dm9pZCB0KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnZvaWQgcygpfX19LGwucHJvdG90eXBlLnNldFRyYW5zaXRpb25pbmc9ZnVuY3Rpb24odCl7dGhpcy5faXNUcmFuc2l0aW9uaW5nPXR9LGwucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9wYXJlbnQ9bnVsbCx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5fdHJpZ2dlckFycmF5PW51bGwsdGhpcy5faXNUcmFuc2l0aW9uaW5nPW51bGx9LGwucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sZCxuKSxuLnRvZ2dsZT1Cb29sZWFuKG4udG9nZ2xlKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZiksbn0sbC5wcm90b3R5cGUuX2dldERpbWVuc2lvbj1mdW5jdGlvbigpe3ZhciBlPXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MocC5XSURUSCk7cmV0dXJuIGU/cC5XSURUSDpwLkhFSUdIVH0sbC5wcm90b3R5cGUuX2dldFBhcmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXMsbj10KHRoaXMuX2NvbmZpZy5wYXJlbnQpWzBdLGk9J1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyt0aGlzLl9jb25maWcucGFyZW50KydcIl0nO3JldHVybiB0KG4pLmZpbmQoaSkuZWFjaChmdW5jdGlvbih0LG4pe2UuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhsLl9nZXRUYXJnZXRGcm9tRWxlbWVudChuKSxbbl0pfSksbn0sbC5wcm90b3R5cGUuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcz1mdW5jdGlvbihlLG4pe2lmKGUpe3ZhciBpPXQoZSkuaGFzQ2xhc3MoZy5TSE9XKTtlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIixpKSxuLmxlbmd0aCYmdChuKS50b2dnbGVDbGFzcyhnLkNPTExBUFNFRCwhaSkuYXR0cihcImFyaWEtZXhwYW5kZWRcIixpKX19LGwuX2dldFRhcmdldEZyb21FbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKTtyZXR1cm4gbj90KG4pWzBdOm51bGx9LGwuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKSxvPW4uZGF0YShhKSxyPXQuZXh0ZW5kKHt9LGQsbi5kYXRhKCksXCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlKTtpZighbyYmci50b2dnbGUmJi9zaG93fGhpZGUvLnRlc3QoZSkmJihyLnRvZ2dsZT0hMSksb3x8KG89bmV3IGwodGhpcyxyKSxuLmRhdGEoYSxvKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW9bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7b1tlXSgpfX0pfSxvKGwsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGR9fV0pLGx9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKF8uQ0xJQ0tfREFUQV9BUEksbS5EQVRBX1RPR0dMRSxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIG49RS5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQodGhpcyksaT10KG4pLmRhdGEoYSksbz1pP1widG9nZ2xlXCI6dCh0aGlzKS5kYXRhKCk7RS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChuKSxvKX0pLHQuZm5bZV09RS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9RSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLEUuX2pRdWVyeUludGVyZmFjZX0sRX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImRyb3Bkb3duXCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMuZHJvcGRvd25cIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTI3LHU9MzgsZD00MCxmPTMsXz17SElERTpcImhpZGVcIithLEhJRERFTjpcImhpZGRlblwiK2EsU0hPVzpcInNob3dcIithLFNIT1dOOlwic2hvd25cIithLENMSUNLOlwiY2xpY2tcIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2wsRk9DVVNJTl9EQVRBX0FQSTpcImZvY3VzaW5cIithK2wsS0VZRE9XTl9EQVRBX0FQSTpcImtleWRvd25cIithK2x9LGc9e0JBQ0tEUk9QOlwiZHJvcGRvd24tYmFja2Ryb3BcIixESVNBQkxFRDpcImRpc2FibGVkXCIsU0hPVzpcInNob3dcIn0scD17QkFDS0RST1A6XCIuZHJvcGRvd24tYmFja2Ryb3BcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLEZPUk1fQ0hJTEQ6XCIuZHJvcGRvd24gZm9ybVwiLFJPTEVfTUVOVTonW3JvbGU9XCJtZW51XCJdJyxST0xFX0xJU1RCT1g6J1tyb2xlPVwibGlzdGJveFwiXScsTkFWQkFSX05BVjpcIi5uYXZiYXItbmF2XCIsVklTSUJMRV9JVEVNUzonW3JvbGU9XCJtZW51XCJdIGxpOm5vdCguZGlzYWJsZWQpIGEsIFtyb2xlPVwibGlzdGJveFwiXSBsaTpub3QoLmRpc2FibGVkKSBhJ30sbT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dCx0aGlzLl9hZGRFdmVudExpc3RlbmVycygpfXJldHVybiBlLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXtpZih0aGlzLmRpc2FibGVkfHx0KHRoaXMpLmhhc0NsYXNzKGcuRElTQUJMRUQpKXJldHVybiExO3ZhciBuPWUuX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMpLGk9dChuKS5oYXNDbGFzcyhnLlNIT1cpO2lmKGUuX2NsZWFyTWVudXMoKSxpKXJldHVybiExO2lmKFwib250b3VjaHN0YXJ0XCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQmJiF0KG4pLmNsb3Nlc3QocC5OQVZCQVJfTkFWKS5sZW5ndGgpe3ZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7by5jbGFzc05hbWU9Zy5CQUNLRFJPUCx0KG8pLmluc2VydEJlZm9yZSh0aGlzKSx0KG8pLm9uKFwiY2xpY2tcIixlLl9jbGVhck1lbnVzKX12YXIgcj17cmVsYXRlZFRhcmdldDp0aGlzfSxzPXQuRXZlbnQoXy5TSE9XLHIpO3JldHVybiB0KG4pLnRyaWdnZXIocyksIXMuaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLmZvY3VzKCksdGhpcy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApLHQobikudG9nZ2xlQ2xhc3MoZy5TSE9XKSx0KG4pLnRyaWdnZXIodC5FdmVudChfLlNIT1dOLHIpKSwhMSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxzKSx0KHRoaXMuX2VsZW1lbnQpLm9mZihhKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9hZGRFdmVudExpc3RlbmVycz1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkub24oXy5DTElDSyx0aGlzLnRvZ2dsZSl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKS5kYXRhKHMpO2lmKGl8fChpPW5ldyBlKHRoaXMpLHQodGhpcykuZGF0YShzLGkpKSxcInN0cmluZ1wiPT10eXBlb2Ygbil7aWYodm9pZCAwPT09aVtuXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrbisnXCInKTtpW25dLmNhbGwodGhpcyl9fSl9LGUuX2NsZWFyTWVudXM9ZnVuY3Rpb24obil7aWYoIW58fG4ud2hpY2ghPT1mKXt2YXIgaT10KHAuQkFDS0RST1ApWzBdO2kmJmkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpKTtmb3IodmFyIG89dC5tYWtlQXJyYXkodChwLkRBVEFfVE9HR0xFKSkscj0wO3I8by5sZW5ndGg7cisrKXt2YXIgcz1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudChvW3JdKSxhPXtyZWxhdGVkVGFyZ2V0Om9bcl19O2lmKHQocykuaGFzQ2xhc3MoZy5TSE9XKSYmIShuJiYoXCJjbGlja1wiPT09bi50eXBlJiYvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KG4udGFyZ2V0LnRhZ05hbWUpfHxcImZvY3VzaW5cIj09PW4udHlwZSkmJnQuY29udGFpbnMocyxuLnRhcmdldCkpKXt2YXIgbD10LkV2ZW50KF8uSElERSxhKTt0KHMpLnRyaWdnZXIobCksbC5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KG9bcl0uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLFwiZmFsc2VcIiksdChzKS5yZW1vdmVDbGFzcyhnLlNIT1cpLnRyaWdnZXIodC5FdmVudChfLkhJRERFTixhKSkpfX19fSxlLl9nZXRQYXJlbnRGcm9tRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj12b2lkIDAsaT1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIGkmJihuPXQoaSlbMF0pLG58fGUucGFyZW50Tm9kZX0sZS5fZGF0YUFwaUtleWRvd25IYW5kbGVyPWZ1bmN0aW9uKG4pe2lmKC8oMzh8NDB8Mjd8MzIpLy50ZXN0KG4ud2hpY2gpJiYhL2lucHV0fHRleHRhcmVhL2kudGVzdChuLnRhcmdldC50YWdOYW1lKSYmKG4ucHJldmVudERlZmF1bHQoKSxuLnN0b3BQcm9wYWdhdGlvbigpLCF0aGlzLmRpc2FibGVkJiYhdCh0aGlzKS5oYXNDbGFzcyhnLkRJU0FCTEVEKSkpe3ZhciBpPWUuX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMpLG89dChpKS5oYXNDbGFzcyhnLlNIT1cpO2lmKCFvJiZuLndoaWNoIT09Y3x8byYmbi53aGljaD09PWMpe2lmKG4ud2hpY2g9PT1jKXt2YXIgcj10KGkpLmZpbmQocC5EQVRBX1RPR0dMRSlbMF07dChyKS50cmlnZ2VyKFwiZm9jdXNcIil9cmV0dXJuIHZvaWQgdCh0aGlzKS50cmlnZ2VyKFwiY2xpY2tcIil9dmFyIHM9dChpKS5maW5kKHAuVklTSUJMRV9JVEVNUykuZ2V0KCk7aWYocy5sZW5ndGgpe3ZhciBhPXMuaW5kZXhPZihuLnRhcmdldCk7bi53aGljaD09PXUmJmE+MCYmYS0tLG4ud2hpY2g9PT1kJiZhPHMubGVuZ3RoLTEmJmErKyxhPDAmJihhPTApLHNbYV0uZm9jdXMoKX19fSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuREFUQV9UT0dHTEUsbS5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihfLktFWURPV05fREFUQV9BUEkscC5ST0xFX01FTlUsbS5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihfLktFWURPV05fREFUQV9BUEkscC5ST0xFX0xJU1RCT1gsbS5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihfLkNMSUNLX0RBVEFfQVBJK1wiIFwiK18uRk9DVVNJTl9EQVRBX0FQSSxtLl9jbGVhck1lbnVzKS5vbihfLkNMSUNLX0RBVEFfQVBJLHAuREFUQV9UT0dHTEUsbS5wcm90b3R5cGUudG9nZ2xlKS5vbihfLkNMSUNLX0RBVEFfQVBJLHAuRk9STV9DSElMRCxmdW5jdGlvbih0KXt0LnN0b3BQcm9wYWdhdGlvbigpfSksdC5mbltlXT1tLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1tLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwibW9kYWxcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5tb2RhbFwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9MzAwLGQ9MTUwLGY9MjcsXz17YmFja2Ryb3A6ITAsa2V5Ym9hcmQ6ITAsZm9jdXM6ITAsc2hvdzohMH0sZz17YmFja2Ryb3A6XCIoYm9vbGVhbnxzdHJpbmcpXCIsa2V5Ym9hcmQ6XCJib29sZWFuXCIsZm9jdXM6XCJib29sZWFuXCIsc2hvdzpcImJvb2xlYW5cIn0scD17SElERTpcImhpZGVcIitsLEhJRERFTjpcImhpZGRlblwiK2wsU0hPVzpcInNob3dcIitsLFNIT1dOOlwic2hvd25cIitsLEZPQ1VTSU46XCJmb2N1c2luXCIrbCxSRVNJWkU6XCJyZXNpemVcIitsLENMSUNLX0RJU01JU1M6XCJjbGljay5kaXNtaXNzXCIrbCxLRVlET1dOX0RJU01JU1M6XCJrZXlkb3duLmRpc21pc3NcIitsLE1PVVNFVVBfRElTTUlTUzpcIm1vdXNldXAuZGlzbWlzc1wiK2wsTU9VU0VET1dOX0RJU01JU1M6XCJtb3VzZWRvd24uZGlzbWlzc1wiK2wsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sbT17U0NST0xMQkFSX01FQVNVUkVSOlwibW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmVcIixCQUNLRFJPUDpcIm1vZGFsLWJhY2tkcm9wXCIsT1BFTjpcIm1vZGFsLW9wZW5cIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LEU9e0RJQUxPRzpcIi5tb2RhbC1kaWFsb2dcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLERBVEFfRElTTUlTUzonW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJyxGSVhFRF9DT05URU5UOlwiLmZpeGVkLXRvcCwgLmZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkLCAuc3RpY2t5LXRvcFwifSx2PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe24odGhpcyxoKSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9kaWFsb2c9dChlKS5maW5kKEUuRElBTE9HKVswXSx0aGlzLl9iYWNrZHJvcD1udWxsLHRoaXMuX2lzU2hvd249ITEsdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmc9ITEsdGhpcy5faWdub3JlQmFja2Ryb3BDbGljaz0hMSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz0wLHRoaXMuX3Njcm9sbGJhcldpZHRoPTB9cmV0dXJuIGgucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5faXNTaG93bj90aGlzLmhpZGUoKTp0aGlzLnNob3codCl9LGgucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiTW9kYWwgaXMgdHJhbnNpdGlvbmluZ1wiKTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSkmJih0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITApO3ZhciBpPXQuRXZlbnQocC5TSE9XLHtyZWxhdGVkVGFyZ2V0OmV9KTt0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoaSksdGhpcy5faXNTaG93bnx8aS5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KHRoaXMuX2lzU2hvd249ITAsdGhpcy5fY2hlY2tTY3JvbGxiYXIoKSx0aGlzLl9zZXRTY3JvbGxiYXIoKSx0KGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKG0uT1BFTiksdGhpcy5fc2V0RXNjYXBlRXZlbnQoKSx0aGlzLl9zZXRSZXNpemVFdmVudCgpLHQodGhpcy5fZWxlbWVudCkub24ocC5DTElDS19ESVNNSVNTLEUuREFUQV9ESVNNSVNTLGZ1bmN0aW9uKHQpe3JldHVybiBuLmhpZGUodCl9KSx0KHRoaXMuX2RpYWxvZykub24ocC5NT1VTRURPV05fRElTTUlTUyxmdW5jdGlvbigpe3Qobi5fZWxlbWVudCkub25lKHAuTU9VU0VVUF9ESVNNSVNTLGZ1bmN0aW9uKGUpe3QoZS50YXJnZXQpLmlzKG4uX2VsZW1lbnQpJiYobi5faWdub3JlQmFja2Ryb3BDbGljaz0hMCl9KX0pLHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbigpe3JldHVybiBuLl9zaG93RWxlbWVudChlKX0pKX0saC5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbihlKXt2YXIgbj10aGlzO2lmKGUmJmUucHJldmVudERlZmF1bHQoKSx0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiTW9kYWwgaXMgdHJhbnNpdGlvbmluZ1wiKTt2YXIgaT1yLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk7aSYmKHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCk7dmFyIG89dC5FdmVudChwLkhJREUpO3QodGhpcy5fZWxlbWVudCkudHJpZ2dlcihvKSx0aGlzLl9pc1Nob3duJiYhby5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmKHRoaXMuX2lzU2hvd249ITEsdGhpcy5fc2V0RXNjYXBlRXZlbnQoKSx0aGlzLl9zZXRSZXNpemVFdmVudCgpLHQoZG9jdW1lbnQpLm9mZihwLkZPQ1VTSU4pLHQodGhpcy5fZWxlbWVudCkucmVtb3ZlQ2xhc3MobS5TSE9XKSx0KHRoaXMuX2VsZW1lbnQpLm9mZihwLkNMSUNLX0RJU01JU1MpLHQodGhpcy5fZGlhbG9nKS5vZmYocC5NT1VTRURPV05fRElTTUlTUyksaT90KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKHQpe3JldHVybiBuLl9oaWRlTW9kYWwodCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTp0aGlzLl9oaWRlTW9kYWwoKSl9LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0KHdpbmRvdyxkb2N1bWVudCx0aGlzLl9lbGVtZW50LHRoaXMuX2JhY2tkcm9wKS5vZmYobCksdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX2RpYWxvZz1udWxsLHRoaXMuX2JhY2tkcm9wPW51bGwsdGhpcy5faXNTaG93bj1udWxsLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nPW51bGwsdGhpcy5faWdub3JlQmFja2Ryb3BDbGljaz1udWxsLHRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9bnVsbCx0aGlzLl9zY3JvbGxiYXJXaWR0aD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LF8sbiksci50eXBlQ2hlY2tDb25maWcoZSxuLGcpLG59LGgucHJvdG90eXBlLl9zaG93RWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpO3RoaXMuX2VsZW1lbnQucGFyZW50Tm9kZSYmdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlPT09Tm9kZS5FTEVNRU5UX05PREV8fGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbWVudCksdGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIix0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpLHRoaXMuX2VsZW1lbnQuc2Nyb2xsVG9wPTAsaSYmci5yZWZsb3codGhpcy5fZWxlbWVudCksdCh0aGlzLl9lbGVtZW50KS5hZGRDbGFzcyhtLlNIT1cpLHRoaXMuX2NvbmZpZy5mb2N1cyYmdGhpcy5fZW5mb3JjZUZvY3VzKCk7dmFyIG89dC5FdmVudChwLlNIT1dOLHtyZWxhdGVkVGFyZ2V0OmV9KSxzPWZ1bmN0aW9uKCl7bi5fY29uZmlnLmZvY3VzJiZuLl9lbGVtZW50LmZvY3VzKCksbi5faXNUcmFuc2l0aW9uaW5nPSExLHQobi5fZWxlbWVudCkudHJpZ2dlcihvKX07aT90KHRoaXMuX2RpYWxvZykub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6cygpfSxoLnByb3RvdHlwZS5fZW5mb3JjZUZvY3VzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0KGRvY3VtZW50KS5vZmYocC5GT0NVU0lOKS5vbihwLkZPQ1VTSU4sZnVuY3Rpb24obil7ZG9jdW1lbnQ9PT1uLnRhcmdldHx8ZS5fZWxlbWVudD09PW4udGFyZ2V0fHx0KGUuX2VsZW1lbnQpLmhhcyhuLnRhcmdldCkubGVuZ3RofHxlLl9lbGVtZW50LmZvY3VzKCl9KX0saC5wcm90b3R5cGUuX3NldEVzY2FwZUV2ZW50PWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9pc1Nob3duJiZ0aGlzLl9jb25maWcua2V5Ym9hcmQ/dCh0aGlzLl9lbGVtZW50KS5vbihwLktFWURPV05fRElTTUlTUyxmdW5jdGlvbih0KXt0LndoaWNoPT09ZiYmZS5oaWRlKCl9KTp0aGlzLl9pc1Nob3dufHx0KHRoaXMuX2VsZW1lbnQpLm9mZihwLktFWURPV05fRElTTUlTUyl9LGgucHJvdG90eXBlLl9zZXRSZXNpemVFdmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5faXNTaG93bj90KHdpbmRvdykub24ocC5SRVNJWkUsZnVuY3Rpb24odCl7cmV0dXJuIGUuX2hhbmRsZVVwZGF0ZSh0KX0pOnQod2luZG93KS5vZmYocC5SRVNJWkUpfSxoLnByb3RvdHlwZS5faGlkZU1vZGFsPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXk9XCJub25lXCIsdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7dChkb2N1bWVudC5ib2R5KS5yZW1vdmVDbGFzcyhtLk9QRU4pLGUuX3Jlc2V0QWRqdXN0bWVudHMoKSxlLl9yZXNldFNjcm9sbGJhcigpLHQoZS5fZWxlbWVudCkudHJpZ2dlcihwLkhJRERFTil9KX0saC5wcm90b3R5cGUuX3JlbW92ZUJhY2tkcm9wPWZ1bmN0aW9uKCl7dGhpcy5fYmFja2Ryb3AmJih0KHRoaXMuX2JhY2tkcm9wKS5yZW1vdmUoKSx0aGlzLl9iYWNrZHJvcD1udWxsKX0saC5wcm90b3R5cGUuX3Nob3dCYWNrZHJvcD1mdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpP20uRkFERTpcIlwiO2lmKHRoaXMuX2lzU2hvd24mJnRoaXMuX2NvbmZpZy5iYWNrZHJvcCl7dmFyIG89ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmaTtpZih0aGlzLl9iYWNrZHJvcD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHRoaXMuX2JhY2tkcm9wLmNsYXNzTmFtZT1tLkJBQ0tEUk9QLGkmJnQodGhpcy5fYmFja2Ryb3ApLmFkZENsYXNzKGkpLHQodGhpcy5fYmFja2Ryb3ApLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpLHQodGhpcy5fZWxlbWVudCkub24ocC5DTElDS19ESVNNSVNTLGZ1bmN0aW9uKHQpe3JldHVybiBuLl9pZ25vcmVCYWNrZHJvcENsaWNrP3ZvaWQobi5faWdub3JlQmFja2Ryb3BDbGljaz0hMSk6dm9pZCh0LnRhcmdldD09PXQuY3VycmVudFRhcmdldCYmKFwic3RhdGljXCI9PT1uLl9jb25maWcuYmFja2Ryb3A/bi5fZWxlbWVudC5mb2N1cygpOm4uaGlkZSgpKSl9KSxvJiZyLnJlZmxvdyh0aGlzLl9iYWNrZHJvcCksdCh0aGlzLl9iYWNrZHJvcCkuYWRkQ2xhc3MobS5TSE9XKSwhZSlyZXR1cm47aWYoIW8pcmV0dXJuIHZvaWQgZSgpO3QodGhpcy5fYmFja2Ryb3ApLm9uZShyLlRSQU5TSVRJT05fRU5ELGUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGQpfWVsc2UgaWYoIXRoaXMuX2lzU2hvd24mJnRoaXMuX2JhY2tkcm9wKXt0KHRoaXMuX2JhY2tkcm9wKS5yZW1vdmVDbGFzcyhtLlNIT1cpO3ZhciBzPWZ1bmN0aW9uKCl7bi5fcmVtb3ZlQmFja2Ryb3AoKSxlJiZlKCl9O3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKT90KHRoaXMuX2JhY2tkcm9wKS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkKTpzKCl9ZWxzZSBlJiZlKCl9LGgucHJvdG90eXBlLl9oYW5kbGVVcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLl9hZGp1c3REaWFsb2coKX0saC5wcm90b3R5cGUuX2FkanVzdERpYWxvZz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2VsZW1lbnQuc2Nyb2xsSGVpZ2h0PmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7IXRoaXMuX2lzQm9keU92ZXJmbG93aW5nJiZ0JiYodGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdD10aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nJiYhdCYmKHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0PXRoaXMuX3Njcm9sbGJhcldpZHRoK1wicHhcIil9LGgucHJvdG90eXBlLl9yZXNldEFkanVzdG1lbnRzPWZ1bmN0aW9uKCl7dGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdD1cIlwiLHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0PVwiXCJ9LGgucHJvdG90eXBlLl9jaGVja1Njcm9sbGJhcj1mdW5jdGlvbigpe3RoaXMuX2lzQm9keU92ZXJmbG93aW5nPWRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg8d2luZG93LmlubmVyV2lkdGgsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9dGhpcy5fZ2V0U2Nyb2xsYmFyV2lkdGgoKX0saC5wcm90b3R5cGUuX3NldFNjcm9sbGJhcj1mdW5jdGlvbigpe3ZhciBlPXBhcnNlSW50KHQoRS5GSVhFRF9DT05URU5UKS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpfHwwLDEwKTt0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPWRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0fHxcIlwiLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nJiYoZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQ9ZSt0aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpfSxoLnByb3RvdHlwZS5fcmVzZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXtkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodD10aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nfSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsYmFyV2lkdGg9ZnVuY3Rpb24oKXt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3QuY2xhc3NOYW1lPW0uU0NST0xMQkFSX01FQVNVUkVSLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodCk7dmFyIGU9dC5vZmZzZXRXaWR0aC10LmNsaWVudFdpZHRoO3JldHVybiBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHQpLGV9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlLG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbz10KHRoaXMpLmRhdGEoYSkscj10LmV4dGVuZCh7fSxoLkRlZmF1bHQsdCh0aGlzKS5kYXRhKCksXCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlKTtpZihvfHwobz1uZXcgaCh0aGlzLHIpLHQodGhpcykuZGF0YShhLG8pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09b1tlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtvW2VdKG4pfWVsc2Ugci5zaG93JiZvLnNob3cobil9KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBffX1dKSxofSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihwLkNMSUNLX0RBVEFfQVBJLEUuREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXZvaWQgMCxvPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKTtvJiYoaT10KG8pWzBdKTt2YXIgcz10KGkpLmRhdGEoYSk/XCJ0b2dnbGVcIjp0LmV4dGVuZCh7fSx0KGkpLmRhdGEoKSx0KHRoaXMpLmRhdGEoKSk7XCJBXCIhPT10aGlzLnRhZ05hbWUmJlwiQVJFQVwiIT09dGhpcy50YWdOYW1lfHxlLnByZXZlbnREZWZhdWx0KCk7dmFyIGw9dChpKS5vbmUocC5TSE9XLGZ1bmN0aW9uKGUpe2UuaXNEZWZhdWx0UHJldmVudGVkKCl8fGwub25lKHAuSElEREVOLGZ1bmN0aW9uKCl7dChuKS5pcyhcIjp2aXNpYmxlXCIpJiZuLmZvY3VzKCl9KX0pO3YuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQoaSkscyx0aGlzKX0pLHQuZm5bZV09di5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9dix0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLHYuX2pRdWVyeUludGVyZmFjZX0sdn0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cInNjcm9sbHNweVwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLnNjcm9sbHNweVwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9e29mZnNldDoxMCxtZXRob2Q6XCJhdXRvXCIsdGFyZ2V0OlwiXCJ9LGQ9e29mZnNldDpcIm51bWJlclwiLG1ldGhvZDpcInN0cmluZ1wiLHRhcmdldDpcIihzdHJpbmd8ZWxlbWVudClcIn0sZj17QUNUSVZBVEU6XCJhY3RpdmF0ZVwiK2wsU0NST0xMOlwic2Nyb2xsXCIrbCxMT0FEX0RBVEFfQVBJOlwibG9hZFwiK2wraH0sXz17RFJPUERPV05fSVRFTTpcImRyb3Bkb3duLWl0ZW1cIixEUk9QRE9XTl9NRU5VOlwiZHJvcGRvd24tbWVudVwiLE5BVl9MSU5LOlwibmF2LWxpbmtcIixOQVY6XCJuYXZcIixBQ1RJVkU6XCJhY3RpdmVcIn0sZz17REFUQV9TUFk6J1tkYXRhLXNweT1cInNjcm9sbFwiXScsQUNUSVZFOlwiLmFjdGl2ZVwiLExJU1RfSVRFTTpcIi5saXN0LWl0ZW1cIixMSTpcImxpXCIsTElfRFJPUERPV046XCJsaS5kcm9wZG93blwiLE5BVl9MSU5LUzpcIi5uYXYtbGlua1wiLERST1BET1dOOlwiLmRyb3Bkb3duXCIsRFJPUERPV05fSVRFTVM6XCIuZHJvcGRvd24taXRlbVwiLERST1BET1dOX1RPR0dMRTpcIi5kcm9wZG93bi10b2dnbGVcIn0scD17T0ZGU0VUOlwib2Zmc2V0XCIsUE9TSVRJT046XCJwb3NpdGlvblwifSxtPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe3ZhciBvPXRoaXM7bih0aGlzLGgpLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9zY3JvbGxFbGVtZW50PVwiQk9EWVwiPT09ZS50YWdOYW1lP3dpbmRvdzplLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fc2VsZWN0b3I9dGhpcy5fY29uZmlnLnRhcmdldCtcIiBcIitnLk5BVl9MSU5LUytcIixcIisodGhpcy5fY29uZmlnLnRhcmdldCtcIiBcIitnLkRST1BET1dOX0lURU1TKSx0aGlzLl9vZmZzZXRzPVtdLHRoaXMuX3RhcmdldHM9W10sdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdGhpcy5fc2Nyb2xsSGVpZ2h0PTAsdCh0aGlzLl9zY3JvbGxFbGVtZW50KS5vbihmLlNDUk9MTCxmdW5jdGlvbih0KXtyZXR1cm4gby5fcHJvY2Vzcyh0KX0pLHRoaXMucmVmcmVzaCgpLHRoaXMuX3Byb2Nlc3MoKX1yZXR1cm4gaC5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMsbj10aGlzLl9zY3JvbGxFbGVtZW50IT09dGhpcy5fc2Nyb2xsRWxlbWVudC53aW5kb3c/cC5QT1NJVElPTjpwLk9GRlNFVCxpPVwiYXV0b1wiPT09dGhpcy5fY29uZmlnLm1ldGhvZD9uOnRoaXMuX2NvbmZpZy5tZXRob2Qsbz1pPT09cC5QT1NJVElPTj90aGlzLl9nZXRTY3JvbGxUb3AoKTowO3RoaXMuX29mZnNldHM9W10sdGhpcy5fdGFyZ2V0cz1bXSx0aGlzLl9zY3JvbGxIZWlnaHQ9dGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KCk7dmFyIHM9dC5tYWtlQXJyYXkodCh0aGlzLl9zZWxlY3RvcikpO3MubWFwKGZ1bmN0aW9uKGUpe3ZhciBuPXZvaWQgMCxzPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKTtyZXR1cm4gcyYmKG49dChzKVswXSksbiYmKG4ub2Zmc2V0V2lkdGh8fG4ub2Zmc2V0SGVpZ2h0KT9bdChuKVtpXSgpLnRvcCtvLHNdOm51bGx9KS5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIHR9KS5zb3J0KGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRbMF0tZVswXX0pLmZvckVhY2goZnVuY3Rpb24odCl7ZS5fb2Zmc2V0cy5wdXNoKHRbMF0pLGUuX3RhcmdldHMucHVzaCh0WzFdKX0pfSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdCh0aGlzLl9zY3JvbGxFbGVtZW50KS5vZmYobCksdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX3Njcm9sbEVsZW1lbnQ9bnVsbCx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9zZWxlY3Rvcj1udWxsLHRoaXMuX29mZnNldHM9bnVsbCx0aGlzLl90YXJnZXRzPW51bGwsdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdGhpcy5fc2Nyb2xsSGVpZ2h0PW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7aWYobj10LmV4dGVuZCh7fSx1LG4pLFwic3RyaW5nXCIhPXR5cGVvZiBuLnRhcmdldCl7dmFyIGk9dChuLnRhcmdldCkuYXR0cihcImlkXCIpO2l8fChpPXIuZ2V0VUlEKGUpLHQobi50YXJnZXQpLmF0dHIoXCJpZFwiLGkpKSxuLnRhcmdldD1cIiNcIitpfXJldHVybiByLnR5cGVDaGVja0NvbmZpZyhlLG4sZCksbn0saC5wcm90b3R5cGUuX2dldFNjcm9sbFRvcD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50PT09d2luZG93P3RoaXMuX3Njcm9sbEVsZW1lbnQucGFnZVlPZmZzZXQ6dGhpcy5fc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3B9LGgucHJvdG90eXBlLl9nZXRTY3JvbGxIZWlnaHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudC5zY3JvbGxIZWlnaHR8fE1hdGgubWF4KGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0LGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpfSxoLnByb3RvdHlwZS5fZ2V0T2Zmc2V0SGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQ9PT13aW5kb3c/d2luZG93LmlubmVySGVpZ2h0OnRoaXMuX3Njcm9sbEVsZW1lbnQub2Zmc2V0SGVpZ2h0fSxoLnByb3RvdHlwZS5fcHJvY2Vzcz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2dldFNjcm9sbFRvcCgpK3RoaXMuX2NvbmZpZy5vZmZzZXQsZT10aGlzLl9nZXRTY3JvbGxIZWlnaHQoKSxuPXRoaXMuX2NvbmZpZy5vZmZzZXQrZS10aGlzLl9nZXRPZmZzZXRIZWlnaHQoKTtpZih0aGlzLl9zY3JvbGxIZWlnaHQhPT1lJiZ0aGlzLnJlZnJlc2goKSx0Pj1uKXt2YXIgaT10aGlzLl90YXJnZXRzW3RoaXMuX3RhcmdldHMubGVuZ3RoLTFdO3JldHVybiB2b2lkKHRoaXMuX2FjdGl2ZVRhcmdldCE9PWkmJnRoaXMuX2FjdGl2YXRlKGkpKX1pZih0aGlzLl9hY3RpdmVUYXJnZXQmJnQ8dGhpcy5fb2Zmc2V0c1swXSYmdGhpcy5fb2Zmc2V0c1swXT4wKXJldHVybiB0aGlzLl9hY3RpdmVUYXJnZXQ9bnVsbCx2b2lkIHRoaXMuX2NsZWFyKCk7Zm9yKHZhciBvPXRoaXMuX29mZnNldHMubGVuZ3RoO28tLTspe3ZhciByPXRoaXMuX2FjdGl2ZVRhcmdldCE9PXRoaXMuX3RhcmdldHNbb10mJnQ+PXRoaXMuX29mZnNldHNbb10mJih2b2lkIDA9PT10aGlzLl9vZmZzZXRzW28rMV18fHQ8dGhpcy5fb2Zmc2V0c1tvKzFdKTtyJiZ0aGlzLl9hY3RpdmF0ZSh0aGlzLl90YXJnZXRzW29dKX19LGgucHJvdG90eXBlLl9hY3RpdmF0ZT1mdW5jdGlvbihlKXt0aGlzLl9hY3RpdmVUYXJnZXQ9ZSx0aGlzLl9jbGVhcigpO3ZhciBuPXRoaXMuX3NlbGVjdG9yLnNwbGl0KFwiLFwiKTtuPW4ubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0KydbZGF0YS10YXJnZXQ9XCInK2UrJ1wiXSwnKyh0KydbaHJlZj1cIicrZSsnXCJdJyl9KTt2YXIgaT10KG4uam9pbihcIixcIikpO2kuaGFzQ2xhc3MoXy5EUk9QRE9XTl9JVEVNKT8oaS5jbG9zZXN0KGcuRFJPUERPV04pLmZpbmQoZy5EUk9QRE9XTl9UT0dHTEUpLmFkZENsYXNzKF8uQUNUSVZFKSxpLmFkZENsYXNzKF8uQUNUSVZFKSk6aS5wYXJlbnRzKGcuTEkpLmZpbmQoXCI+IFwiK2cuTkFWX0xJTktTKS5hZGRDbGFzcyhfLkFDVElWRSksdCh0aGlzLl9zY3JvbGxFbGVtZW50KS50cmlnZ2VyKGYuQUNUSVZBVEUse3JlbGF0ZWRUYXJnZXQ6ZX0pfSxoLnByb3RvdHlwZS5fY2xlYXI9ZnVuY3Rpb24oKXt0KHRoaXMuX3NlbGVjdG9yKS5maWx0ZXIoZy5BQ1RJVkUpLnJlbW92ZUNsYXNzKF8uQUNUSVZFKX0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLmRhdGEoYSksbz1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmU7XHJcbmlmKG58fChuPW5ldyBoKHRoaXMsbyksdCh0aGlzKS5kYXRhKGEsbikpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1uW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO25bZV0oKX19KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB1fX1dKSxofSgpO3JldHVybiB0KHdpbmRvdykub24oZi5MT0FEX0RBVEFfQVBJLGZ1bmN0aW9uKCl7Zm9yKHZhciBlPXQubWFrZUFycmF5KHQoZy5EQVRBX1NQWSkpLG49ZS5sZW5ndGg7bi0tOyl7dmFyIGk9dChlW25dKTttLl9qUXVlcnlJbnRlcmZhY2UuY2FsbChpLGkuZGF0YSgpKX19KSx0LmZuW2VdPW0uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPW0sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxtLl9qUXVlcnlJbnRlcmZhY2V9LG19KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJ0YWJcIixpPVwiNC4wLjAtYWxwaGEuNlwiLHM9XCJicy50YWJcIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTE1MCx1PXtISURFOlwiaGlkZVwiK2EsSElEREVOOlwiaGlkZGVuXCIrYSxTSE9XOlwic2hvd1wiK2EsU0hPV046XCJzaG93blwiK2EsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2ErbH0sZD17RFJPUERPV05fTUVOVTpcImRyb3Bkb3duLW1lbnVcIixBQ1RJVkU6XCJhY3RpdmVcIixESVNBQkxFRDpcImRpc2FibGVkXCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxmPXtBOlwiYVwiLExJOlwibGlcIixEUk9QRE9XTjpcIi5kcm9wZG93blwiLExJU1Q6XCJ1bDpub3QoLmRyb3Bkb3duLW1lbnUpLCBvbDpub3QoLmRyb3Bkb3duLW1lbnUpLCBuYXY6bm90KC5kcm9wZG93bi1tZW51KVwiLEZBREVfQ0hJTEQ6XCI+IC5uYXYtaXRlbSAuZmFkZSwgPiAuZmFkZVwiLEFDVElWRTpcIi5hY3RpdmVcIixBQ1RJVkVfQ0hJTEQ6XCI+IC5uYXYtaXRlbSA+IC5hY3RpdmUsID4gLmFjdGl2ZVwiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJ0YWJcIl0sIFtkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLERST1BET1dOX1RPR0dMRTpcIi5kcm9wZG93bi10b2dnbGVcIixEUk9QRE9XTl9BQ1RJVkVfQ0hJTEQ6XCI+IC5kcm9wZG93bi1tZW51IC5hY3RpdmVcIn0sXz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dH1yZXR1cm4gZS5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYoISh0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUmJnRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGQuQUNUSVZFKXx8dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhkLkRJU0FCTEVEKSkpe3ZhciBuPXZvaWQgMCxpPXZvaWQgMCxvPXQodGhpcy5fZWxlbWVudCkuY2xvc2VzdChmLkxJU1QpWzBdLHM9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpO28mJihpPXQubWFrZUFycmF5KHQobykuZmluZChmLkFDVElWRSkpLGk9aVtpLmxlbmd0aC0xXSk7dmFyIGE9dC5FdmVudCh1LkhJREUse3JlbGF0ZWRUYXJnZXQ6dGhpcy5fZWxlbWVudH0pLGw9dC5FdmVudCh1LlNIT1cse3JlbGF0ZWRUYXJnZXQ6aX0pO2lmKGkmJnQoaSkudHJpZ2dlcihhKSx0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobCksIWwuaXNEZWZhdWx0UHJldmVudGVkKCkmJiFhLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtzJiYobj10KHMpWzBdKSx0aGlzLl9hY3RpdmF0ZSh0aGlzLl9lbGVtZW50LG8pO3ZhciBoPWZ1bmN0aW9uKCl7dmFyIG49dC5FdmVudCh1LkhJRERFTix7cmVsYXRlZFRhcmdldDplLl9lbGVtZW50fSksbz10LkV2ZW50KHUuU0hPV04se3JlbGF0ZWRUYXJnZXQ6aX0pO3QoaSkudHJpZ2dlcihuKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIobyl9O24/dGhpcy5fYWN0aXZhdGUobixuLnBhcmVudE5vZGUsaCk6aCgpfX19LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZUNsYXNzKHRoaXMuX2VsZW1lbnQscyksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fYWN0aXZhdGU9ZnVuY3Rpb24oZSxuLGkpe3ZhciBvPXRoaXMscz10KG4pLmZpbmQoZi5BQ1RJVkVfQ0hJTEQpWzBdLGE9aSYmci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHMmJnQocykuaGFzQ2xhc3MoZC5GQURFKXx8Qm9vbGVhbih0KG4pLmZpbmQoZi5GQURFX0NISUxEKVswXSkpLGw9ZnVuY3Rpb24oKXtyZXR1cm4gby5fdHJhbnNpdGlvbkNvbXBsZXRlKGUscyxhLGkpfTtzJiZhP3Qocykub25lKHIuVFJBTlNJVElPTl9FTkQsbCkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYyk6bCgpLHMmJnQocykucmVtb3ZlQ2xhc3MoZC5TSE9XKX0sZS5wcm90b3R5cGUuX3RyYW5zaXRpb25Db21wbGV0ZT1mdW5jdGlvbihlLG4saSxvKXtpZihuKXt0KG4pLnJlbW92ZUNsYXNzKGQuQUNUSVZFKTt2YXIgcz10KG4ucGFyZW50Tm9kZSkuZmluZChmLkRST1BET1dOX0FDVElWRV9DSElMRClbMF07cyYmdChzKS5yZW1vdmVDbGFzcyhkLkFDVElWRSksbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITEpfWlmKHQoZSkuYWRkQ2xhc3MoZC5BQ1RJVkUpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSxpPyhyLnJlZmxvdyhlKSx0KGUpLmFkZENsYXNzKGQuU0hPVykpOnQoZSkucmVtb3ZlQ2xhc3MoZC5GQURFKSxlLnBhcmVudE5vZGUmJnQoZS5wYXJlbnROb2RlKS5oYXNDbGFzcyhkLkRST1BET1dOX01FTlUpKXt2YXIgYT10KGUpLmNsb3Nlc3QoZi5EUk9QRE9XTilbMF07YSYmdChhKS5maW5kKGYuRFJPUERPV05fVE9HR0xFKS5hZGRDbGFzcyhkLkFDVElWRSksZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApfW8mJm8oKX0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLG89aS5kYXRhKHMpO2lmKG98fChvPW5ldyBlKHRoaXMpLGkuZGF0YShzLG8pKSxcInN0cmluZ1wiPT10eXBlb2Ygbil7aWYodm9pZCAwPT09b1tuXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrbisnXCInKTtvW25dKCl9fSl9LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbih1LkNMSUNLX0RBVEFfQVBJLGYuREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpLF8uX2pRdWVyeUludGVyZmFjZS5jYWxsKHQodGhpcyksXCJzaG93XCIpfSksdC5mbltlXT1fLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1fLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsXy5falF1ZXJ5SW50ZXJmYWNlfSxffShqUXVlcnkpLGZ1bmN0aW9uKHQpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBUZXRoZXIpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwIHRvb2x0aXBzIHJlcXVpcmUgVGV0aGVyIChodHRwOi8vdGV0aGVyLmlvLylcIik7dmFyIGU9XCJ0b29sdGlwXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMudG9vbHRpcFwiLGw9XCIuXCIrYSxoPXQuZm5bZV0sYz0xNTAsdT1cImJzLXRldGhlclwiLGQ9e2FuaW1hdGlvbjohMCx0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+Jyx0cmlnZ2VyOlwiaG92ZXIgZm9jdXNcIix0aXRsZTpcIlwiLGRlbGF5OjAsaHRtbDohMSxzZWxlY3RvcjohMSxwbGFjZW1lbnQ6XCJ0b3BcIixvZmZzZXQ6XCIwIDBcIixjb25zdHJhaW50czpbXSxjb250YWluZXI6ITF9LGY9e2FuaW1hdGlvbjpcImJvb2xlYW5cIix0ZW1wbGF0ZTpcInN0cmluZ1wiLHRpdGxlOlwiKHN0cmluZ3xlbGVtZW50fGZ1bmN0aW9uKVwiLHRyaWdnZXI6XCJzdHJpbmdcIixkZWxheTpcIihudW1iZXJ8b2JqZWN0KVwiLGh0bWw6XCJib29sZWFuXCIsc2VsZWN0b3I6XCIoc3RyaW5nfGJvb2xlYW4pXCIscGxhY2VtZW50OlwiKHN0cmluZ3xmdW5jdGlvbilcIixvZmZzZXQ6XCJzdHJpbmdcIixjb25zdHJhaW50czpcImFycmF5XCIsY29udGFpbmVyOlwiKHN0cmluZ3xlbGVtZW50fGJvb2xlYW4pXCJ9LF89e1RPUDpcImJvdHRvbSBjZW50ZXJcIixSSUdIVDpcIm1pZGRsZSBsZWZ0XCIsQk9UVE9NOlwidG9wIGNlbnRlclwiLExFRlQ6XCJtaWRkbGUgcmlnaHRcIn0sZz17U0hPVzpcInNob3dcIixPVVQ6XCJvdXRcIn0scD17SElERTpcImhpZGVcIitsLEhJRERFTjpcImhpZGRlblwiK2wsU0hPVzpcInNob3dcIitsLFNIT1dOOlwic2hvd25cIitsLElOU0VSVEVEOlwiaW5zZXJ0ZWRcIitsLENMSUNLOlwiY2xpY2tcIitsLEZPQ1VTSU46XCJmb2N1c2luXCIrbCxGT0NVU09VVDpcImZvY3Vzb3V0XCIrbCxNT1VTRUVOVEVSOlwibW91c2VlbnRlclwiK2wsTU9VU0VMRUFWRTpcIm1vdXNlbGVhdmVcIitsfSxtPXtGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LEU9e1RPT0xUSVA6XCIudG9vbHRpcFwiLFRPT0xUSVBfSU5ORVI6XCIudG9vbHRpcC1pbm5lclwifSx2PXtlbGVtZW50OiExLGVuYWJsZWQ6ITF9LFQ9e0hPVkVSOlwiaG92ZXJcIixGT0NVUzpcImZvY3VzXCIsQ0xJQ0s6XCJjbGlja1wiLE1BTlVBTDpcIm1hbnVhbFwifSxJPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaCh0LGUpe24odGhpcyxoKSx0aGlzLl9pc0VuYWJsZWQ9ITAsdGhpcy5fdGltZW91dD0wLHRoaXMuX2hvdmVyU3RhdGU9XCJcIix0aGlzLl9hY3RpdmVUcmlnZ2VyPXt9LHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl90ZXRoZXI9bnVsbCx0aGlzLmVsZW1lbnQ9dCx0aGlzLmNvbmZpZz10aGlzLl9nZXRDb25maWcoZSksdGhpcy50aXA9bnVsbCx0aGlzLl9zZXRMaXN0ZW5lcnMoKX1yZXR1cm4gaC5wcm90b3R5cGUuZW5hYmxlPWZ1bmN0aW9uKCl7dGhpcy5faXNFbmFibGVkPSEwfSxoLnByb3RvdHlwZS5kaXNhYmxlPWZ1bmN0aW9uKCl7dGhpcy5faXNFbmFibGVkPSExfSxoLnByb3RvdHlwZS50b2dnbGVFbmFibGVkPWZ1bmN0aW9uKCl7dGhpcy5faXNFbmFibGVkPSF0aGlzLl9pc0VuYWJsZWR9LGgucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihlKXtpZihlKXt2YXIgbj10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZLGk9dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEobik7aXx8KGk9bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKG4saSkpLGkuX2FjdGl2ZVRyaWdnZXIuY2xpY2s9IWkuX2FjdGl2ZVRyaWdnZXIuY2xpY2ssaS5faXNXaXRoQWN0aXZlVHJpZ2dlcigpP2kuX2VudGVyKG51bGwsaSk6aS5fbGVhdmUobnVsbCxpKX1lbHNle2lmKHQodGhpcy5nZXRUaXBFbGVtZW50KCkpLmhhc0NsYXNzKG0uU0hPVykpcmV0dXJuIHZvaWQgdGhpcy5fbGVhdmUobnVsbCx0aGlzKTt0aGlzLl9lbnRlcihudWxsLHRoaXMpfX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0KSx0aGlzLmNsZWFudXBUZXRoZXIoKSx0LnJlbW92ZURhdGEodGhpcy5lbGVtZW50LHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVkpLHQodGhpcy5lbGVtZW50KS5vZmYodGhpcy5jb25zdHJ1Y3Rvci5FVkVOVF9LRVkpLHQodGhpcy5lbGVtZW50KS5jbG9zZXN0KFwiLm1vZGFsXCIpLm9mZihcImhpZGUuYnMubW9kYWxcIiksdGhpcy50aXAmJnQodGhpcy50aXApLnJlbW92ZSgpLHRoaXMuX2lzRW5hYmxlZD1udWxsLHRoaXMuX3RpbWVvdXQ9bnVsbCx0aGlzLl9ob3ZlclN0YXRlPW51bGwsdGhpcy5fYWN0aXZlVHJpZ2dlcj1udWxsLHRoaXMuX3RldGhlcj1udWxsLHRoaXMuZWxlbWVudD1udWxsLHRoaXMuY29uZmlnPW51bGwsdGhpcy50aXA9bnVsbH0saC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYoXCJub25lXCI9PT10KHRoaXMuZWxlbWVudCkuY3NzKFwiZGlzcGxheVwiKSl0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgdXNlIHNob3cgb24gdmlzaWJsZSBlbGVtZW50c1wiKTt2YXIgbj10LkV2ZW50KHRoaXMuY29uc3RydWN0b3IuRXZlbnQuU0hPVyk7aWYodGhpcy5pc1dpdGhDb250ZW50KCkmJnRoaXMuX2lzRW5hYmxlZCl7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIlRvb2x0aXAgaXMgdHJhbnNpdGlvbmluZ1wiKTt0KHRoaXMuZWxlbWVudCkudHJpZ2dlcihuKTt2YXIgaT10LmNvbnRhaW5zKHRoaXMuZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCx0aGlzLmVsZW1lbnQpO2lmKG4uaXNEZWZhdWx0UHJldmVudGVkKCl8fCFpKXJldHVybjt2YXIgbz10aGlzLmdldFRpcEVsZW1lbnQoKSxzPXIuZ2V0VUlEKHRoaXMuY29uc3RydWN0b3IuTkFNRSk7by5zZXRBdHRyaWJ1dGUoXCJpZFwiLHMpLHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIscyksdGhpcy5zZXRDb250ZW50KCksdGhpcy5jb25maWcuYW5pbWF0aW9uJiZ0KG8pLmFkZENsYXNzKG0uRkFERSk7dmFyIGE9XCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5jb25maWcucGxhY2VtZW50P3RoaXMuY29uZmlnLnBsYWNlbWVudC5jYWxsKHRoaXMsbyx0aGlzLmVsZW1lbnQpOnRoaXMuY29uZmlnLnBsYWNlbWVudCxsPXRoaXMuX2dldEF0dGFjaG1lbnQoYSksYz10aGlzLmNvbmZpZy5jb250YWluZXI9PT0hMT9kb2N1bWVudC5ib2R5OnQodGhpcy5jb25maWcuY29udGFpbmVyKTt0KG8pLmRhdGEodGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSx0aGlzKS5hcHBlbmRUbyhjKSx0KHRoaXMuZWxlbWVudCkudHJpZ2dlcih0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LklOU0VSVEVEKSx0aGlzLl90ZXRoZXI9bmV3IFRldGhlcih7YXR0YWNobWVudDpsLGVsZW1lbnQ6byx0YXJnZXQ6dGhpcy5lbGVtZW50LGNsYXNzZXM6dixjbGFzc1ByZWZpeDp1LG9mZnNldDp0aGlzLmNvbmZpZy5vZmZzZXQsY29uc3RyYWludHM6dGhpcy5jb25maWcuY29uc3RyYWludHMsYWRkVGFyZ2V0Q2xhc3NlczohMX0pLHIucmVmbG93KG8pLHRoaXMuX3RldGhlci5wb3NpdGlvbigpLHQobykuYWRkQ2xhc3MobS5TSE9XKTt2YXIgZD1mdW5jdGlvbigpe3ZhciBuPWUuX2hvdmVyU3RhdGU7ZS5faG92ZXJTdGF0ZT1udWxsLGUuX2lzVHJhbnNpdGlvbmluZz0hMSx0KGUuZWxlbWVudCkudHJpZ2dlcihlLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1dOKSxuPT09Zy5PVVQmJmUuX2xlYXZlKG51bGwsZSl9O2lmKHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy50aXApLmhhc0NsYXNzKG0uRkFERSkpcmV0dXJuIHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCx2b2lkIHQodGhpcy50aXApLm9uZShyLlRSQU5TSVRJT05fRU5ELGQpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGguX1RSQU5TSVRJT05fRFVSQVRJT04pO2QoKX19LGgucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXRoaXMuZ2V0VGlwRWxlbWVudCgpLG89dC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkhJREUpO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJUb29sdGlwIGlzIHRyYW5zaXRpb25pbmdcIik7dmFyIHM9ZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlIT09Zy5TSE9XJiZpLnBhcmVudE5vZGUmJmkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpKSxuLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiKSx0KG4uZWxlbWVudCkudHJpZ2dlcihuLmNvbnN0cnVjdG9yLkV2ZW50LkhJRERFTiksbi5faXNUcmFuc2l0aW9uaW5nPSExLG4uY2xlYW51cFRldGhlcigpLGUmJmUoKX07dCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIobyksby5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KHQoaSkucmVtb3ZlQ2xhc3MobS5TSE9XKSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuQ0xJQ0tdPSExLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5GT0NVU109ITEsdGhpcy5fYWN0aXZlVHJpZ2dlcltULkhPVkVSXT0hMSxyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMudGlwKS5oYXNDbGFzcyhtLkZBREUpPyh0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITAsdChpKS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjKSk6cygpLHRoaXMuX2hvdmVyU3RhdGU9XCJcIil9LGgucHJvdG90eXBlLmlzV2l0aENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gQm9vbGVhbih0aGlzLmdldFRpdGxlKCkpfSxoLnByb3RvdHlwZS5nZXRUaXBFbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlwPXRoaXMudGlwfHx0KHRoaXMuY29uZmlnLnRlbXBsYXRlKVswXX0saC5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciBlPXQodGhpcy5nZXRUaXBFbGVtZW50KCkpO3RoaXMuc2V0RWxlbWVudENvbnRlbnQoZS5maW5kKEUuVE9PTFRJUF9JTk5FUiksdGhpcy5nZXRUaXRsZSgpKSxlLnJlbW92ZUNsYXNzKG0uRkFERStcIiBcIittLlNIT1cpLHRoaXMuY2xlYW51cFRldGhlcigpfSxoLnByb3RvdHlwZS5zZXRFbGVtZW50Q29udGVudD1mdW5jdGlvbihlLG4pe3ZhciBvPXRoaXMuY29uZmlnLmh0bWw7XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2Ygbj9cInVuZGVmaW5lZFwiOmkobikpJiYobi5ub2RlVHlwZXx8bi5qcXVlcnkpP28/dChuKS5wYXJlbnQoKS5pcyhlKXx8ZS5lbXB0eSgpLmFwcGVuZChuKTplLnRleHQodChuKS50ZXh0KCkpOmVbbz9cImh0bWxcIjpcInRleHRcIl0obil9LGgucHJvdG90eXBlLmdldFRpdGxlPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIik7cmV0dXJuIHR8fCh0PVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLnRpdGxlP3RoaXMuY29uZmlnLnRpdGxlLmNhbGwodGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy50aXRsZSksdH0saC5wcm90b3R5cGUuY2xlYW51cFRldGhlcj1mdW5jdGlvbigpe3RoaXMuX3RldGhlciYmdGhpcy5fdGV0aGVyLmRlc3Ryb3koKX0saC5wcm90b3R5cGUuX2dldEF0dGFjaG1lbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIF9bdC50b1VwcGVyQ2FzZSgpXX0saC5wcm90b3R5cGUuX3NldExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBlPXRoaXMsbj10aGlzLmNvbmZpZy50cmlnZ2VyLnNwbGl0KFwiIFwiKTtuLmZvckVhY2goZnVuY3Rpb24obil7aWYoXCJjbGlja1wiPT09bil0KGUuZWxlbWVudCkub24oZS5jb25zdHJ1Y3Rvci5FdmVudC5DTElDSyxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS50b2dnbGUodCl9KTtlbHNlIGlmKG4hPT1ULk1BTlVBTCl7dmFyIGk9bj09PVQuSE9WRVI/ZS5jb25zdHJ1Y3Rvci5FdmVudC5NT1VTRUVOVEVSOmUuY29uc3RydWN0b3IuRXZlbnQuRk9DVVNJTixvPW49PT1ULkhPVkVSP2UuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VMRUFWRTplLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTT1VUO3QoZS5lbGVtZW50KS5vbihpLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9lbnRlcih0KX0pLm9uKG8sZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUuX2xlYXZlKHQpfSl9dChlLmVsZW1lbnQpLmNsb3Nlc3QoXCIubW9kYWxcIikub24oXCJoaWRlLmJzLm1vZGFsXCIsZnVuY3Rpb24oKXtyZXR1cm4gZS5oaWRlKCl9KX0pLHRoaXMuY29uZmlnLnNlbGVjdG9yP3RoaXMuY29uZmlnPXQuZXh0ZW5kKHt9LHRoaXMuY29uZmlnLHt0cmlnZ2VyOlwibWFudWFsXCIsc2VsZWN0b3I6XCJcIn0pOnRoaXMuX2ZpeFRpdGxlKCl9LGgucHJvdG90eXBlLl9maXhUaXRsZT1mdW5jdGlvbigpe3ZhciB0PWkodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpOyh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGl0bGVcIil8fFwic3RyaW5nXCIhPT10KSYmKHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIsdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInRpdGxlXCIpfHxcIlwiKSx0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidGl0bGVcIixcIlwiKSl9LGgucHJvdG90eXBlLl9lbnRlcj1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMuY29uc3RydWN0b3IuREFUQV9LRVk7cmV0dXJuIG49bnx8dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSksbnx8KG49bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGksbikpLGUmJihuLl9hY3RpdmVUcmlnZ2VyW1wiZm9jdXNpblwiPT09ZS50eXBlP1QuRk9DVVM6VC5IT1ZFUl09ITApLHQobi5nZXRUaXBFbGVtZW50KCkpLmhhc0NsYXNzKG0uU0hPVyl8fG4uX2hvdmVyU3RhdGU9PT1nLlNIT1c/dm9pZChuLl9ob3ZlclN0YXRlPWcuU0hPVyk6KGNsZWFyVGltZW91dChuLl90aW1lb3V0KSxuLl9ob3ZlclN0YXRlPWcuU0hPVyxuLmNvbmZpZy5kZWxheSYmbi5jb25maWcuZGVsYXkuc2hvdz92b2lkKG4uX3RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe24uX2hvdmVyU3RhdGU9PT1nLlNIT1cmJm4uc2hvdygpfSxuLmNvbmZpZy5kZWxheS5zaG93KSk6dm9pZCBuLnNob3coKSl9LGgucHJvdG90eXBlLl9sZWF2ZT1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMuY29uc3RydWN0b3IuREFUQV9LRVk7aWYobj1ufHx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpKSxufHwobj1uZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsdGhpcy5fZ2V0RGVsZWdhdGVDb25maWcoKSksdChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSxuKSksZSYmKG4uX2FjdGl2ZVRyaWdnZXJbXCJmb2N1c291dFwiPT09ZS50eXBlP1QuRk9DVVM6VC5IT1ZFUl09ITEpLCFuLl9pc1dpdGhBY3RpdmVUcmlnZ2VyKCkpcmV0dXJuIGNsZWFyVGltZW91dChuLl90aW1lb3V0KSxuLl9ob3ZlclN0YXRlPWcuT1VULG4uY29uZmlnLmRlbGF5JiZuLmNvbmZpZy5kZWxheS5oaWRlP3ZvaWQobi5fdGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZT09PWcuT1VUJiZuLmhpZGUoKX0sbi5jb25maWcuZGVsYXkuaGlkZSkpOnZvaWQgbi5oaWRlKCl9LGgucHJvdG90eXBlLl9pc1dpdGhBY3RpdmVUcmlnZ2VyPWZ1bmN0aW9uKCl7Zm9yKHZhciB0IGluIHRoaXMuX2FjdGl2ZVRyaWdnZXIpaWYodGhpcy5fYWN0aXZlVHJpZ2dlclt0XSlyZXR1cm4hMDtyZXR1cm4hMX0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSx0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHQsdCh0aGlzLmVsZW1lbnQpLmRhdGEoKSxuKSxuLmRlbGF5JiZcIm51bWJlclwiPT10eXBlb2Ygbi5kZWxheSYmKG4uZGVsYXk9e3Nob3c6bi5kZWxheSxoaWRlOm4uZGVsYXl9KSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0VHlwZSksbn0saC5wcm90b3R5cGUuX2dldERlbGVnYXRlQ29uZmlnPWZ1bmN0aW9uKCl7dmFyIHQ9e307aWYodGhpcy5jb25maWcpZm9yKHZhciBlIGluIHRoaXMuY29uZmlnKXRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFtlXSE9PXRoaXMuY29uZmlnW2VdJiYodFtlXT10aGlzLmNvbmZpZ1tlXSk7cmV0dXJuIHR9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlO2lmKChufHwhL2Rpc3Bvc2V8aGlkZS8udGVzdChlKSkmJihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcInN0cmluZ1wiPT10eXBlb2YgZSkpe2lmKHZvaWQgMD09PW5bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7bltlXSgpfX0pfSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGR9fSx7a2V5OlwiTkFNRVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBlfX0se2tleTpcIkRBVEFfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGF9fSx7a2V5OlwiRXZlbnRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcH19LHtrZXk6XCJFVkVOVF9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbH19LHtrZXk6XCJEZWZhdWx0VHlwZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBmfX1dKSxofSgpO3JldHVybiB0LmZuW2VdPUkuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPUksdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxJLl9qUXVlcnlJbnRlcmZhY2V9LEl9KGpRdWVyeSkpOyhmdW5jdGlvbihyKXt2YXIgYT1cInBvcG92ZXJcIixsPVwiNC4wLjAtYWxwaGEuNlwiLGg9XCJicy5wb3BvdmVyXCIsYz1cIi5cIitoLHU9ci5mblthXSxkPXIuZXh0ZW5kKHt9LHMuRGVmYXVsdCx7cGxhY2VtZW50OlwicmlnaHRcIix0cmlnZ2VyOlwiY2xpY2tcIixjb250ZW50OlwiXCIsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J30pLGY9ci5leHRlbmQoe30scy5EZWZhdWx0VHlwZSx7Y29udGVudDpcIihzdHJpbmd8ZWxlbWVudHxmdW5jdGlvbilcIn0pLF89e0ZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sZz17VElUTEU6XCIucG9wb3Zlci10aXRsZVwiLENPTlRFTlQ6XCIucG9wb3Zlci1jb250ZW50XCJ9LHA9e0hJREU6XCJoaWRlXCIrYyxISURERU46XCJoaWRkZW5cIitjLFNIT1c6XCJzaG93XCIrYyxTSE9XTjpcInNob3duXCIrYyxJTlNFUlRFRDpcImluc2VydGVkXCIrYyxDTElDSzpcImNsaWNrXCIrYyxGT0NVU0lOOlwiZm9jdXNpblwiK2MsRk9DVVNPVVQ6XCJmb2N1c291dFwiK2MsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitjLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrY30sbT1mdW5jdGlvbihzKXtmdW5jdGlvbiB1KCl7cmV0dXJuIG4odGhpcyx1KSx0KHRoaXMscy5hcHBseSh0aGlzLGFyZ3VtZW50cykpfXJldHVybiBlKHUscyksdS5wcm90b3R5cGUuaXNXaXRoQ29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFRpdGxlKCl8fHRoaXMuX2dldENvbnRlbnQoKX0sdS5wcm90b3R5cGUuZ2V0VGlwRWxlbWVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpcD10aGlzLnRpcHx8cih0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF19LHUucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgdD1yKHRoaXMuZ2V0VGlwRWxlbWVudCgpKTt0aGlzLnNldEVsZW1lbnRDb250ZW50KHQuZmluZChnLlRJVExFKSx0aGlzLmdldFRpdGxlKCkpLHRoaXMuc2V0RWxlbWVudENvbnRlbnQodC5maW5kKGcuQ09OVEVOVCksdGhpcy5fZ2V0Q29udGVudCgpKSx0LnJlbW92ZUNsYXNzKF8uRkFERStcIiBcIitfLlNIT1cpLHRoaXMuY2xlYW51cFRldGhlcigpfSx1LnByb3RvdHlwZS5fZ2V0Q29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb250ZW50XCIpfHwoXCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5jb25maWcuY29udGVudD90aGlzLmNvbmZpZy5jb250ZW50LmNhbGwodGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy5jb250ZW50KX0sdS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1yKHRoaXMpLmRhdGEoaCksbj1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6aSh0KSk/dDpudWxsO2lmKChlfHwhL2Rlc3Ryb3l8aGlkZS8udGVzdCh0KSkmJihlfHwoZT1uZXcgdSh0aGlzLG4pLHIodGhpcykuZGF0YShoLGUpKSxcInN0cmluZ1wiPT10eXBlb2YgdCkpe2lmKHZvaWQgMD09PWVbdF0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK3QrJ1wiJyk7ZVt0XSgpfX0pfSxvKHUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbH19LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGR9fSx7a2V5OlwiTkFNRVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBhfX0se2tleTpcIkRBVEFfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGh9fSx7a2V5OlwiRXZlbnRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcH19LHtrZXk6XCJFVkVOVF9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY319LHtrZXk6XCJEZWZhdWx0VHlwZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBmfX1dKSx1fShzKTtyZXR1cm4gci5mblthXT1tLl9qUXVlcnlJbnRlcmZhY2Usci5mblthXS5Db25zdHJ1Y3Rvcj1tLHIuZm5bYV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiByLmZuW2FdPXUsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfSkoalF1ZXJ5KX0oKTsiLCIvKlxyXG4qIFNldCB2YWx1ZSBvbiBhIGZpZWxkIG9uZm9jdXMgZXZlbnQgaWYgZmllbGQgdmFsdWUgaXMgZW1wdHlcclxuKlxyXG4qIEBwYXJhbSBPYmplY3QgZWxlbWVudCBUaGUgZmllbGRcclxuKiBAcGFyYW0gc3RyaW5nIHZhbHVlICAgVGhlIHZhbHVlIFxyXG4qL1xyXG5mdW5jdGlvbiBzZXRGb2N1c1ZhbHVlKGVsZW1lbnQsIHZhbHVlKXtcclxuICAgIGlmKCEkKGVsZW1lbnQpLnZhbCgpKVxyXG4gICAge1xyXG4gICAgICAgICQoZWxlbWVudCkudmFsKHZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuKiBDb2xsYXBzZXMgYWNjb3JkaW9uKHMpIFxyXG4qXHJcbiogQHBhcmFtIGVsZW1lbnQgICAgYWNjb3JkaW9uICAgVGhlIGFjY29yZGlvbiBlbGVtZW50XHJcbiogQHBhcmFtIHN0cmluZyAgICAgYWN0aW9uICAgICAgVGhlIGFjdGlvblxyXG4qL1xyXG5mdW5jdGlvbiBjb2xsYXBzZUFsbChhY2NvcmRpb24sIGFjdGlvbilcclxue1xyXG4gICAgJChhY2NvcmRpb24pLmNvbGxhcHNlKGFjdGlvbik7XHJcbn1cclxuXHJcbi8vIENoZWNrcyBhbGwgdGhlIGNoZWNrYm94ZXMgY2hpbGRyZW4gd2hvIGhhdmUgdGhlIC5jaGVja0FsbCBlbGVtZW50IGlkXHJcbiQoJy5jaGVja0FsbCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAvLyBnZXQgdGhlIGlkXHJcbiAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XHJcblxyXG4gICAgLy8gY2hlY2sgYWxsIHRoZSBjaGVja2JveGVzIHdobyBoYXZlIHRoZSBwYXJlbnQgaWQgYXMgY2xhc3NcclxuICAgICQoJy4nICsgaWQpLnByb3AoJ2NoZWNrZWQnLCB0aGlzLmNoZWNrZWQpO1xyXG59KVxyXG5cclxuLypcclxuKiAgIEVuYWJsZXMvZGlzYWJsZXMgaW5saW5lIGVkaXRpbmdcclxuKi9cclxuZnVuY3Rpb24gZWRpdElubGluZUVkaXRhYmxlKCl7XHJcbiAgICAvLyBoaWRlL3Nob3cgdGhlIGFkZCBhbmQgZWRpdCBidXR0b25zIGFuZCBzaG93L2hpZGUgZWRpdCBhY3Rpb24gYnV0dG9uc1xyXG4gICAgJCgnLklubGluZS1lZGl0YWJsZS0tZW5hYmxlJykudG9nZ2xlKCk7XHJcbiAgICAkKCcuQWRkLW5ldy1pbmxpbmUtZWRpdGFibGUnKS50b2dnbGUoKTtcclxuICAgICQoJy5FZGl0LWlubGluZS1hY3Rpb24nKS50b2dnbGUoKTtcclxuXHJcbiAgICAvLyBzaG93L2hpZGUgdGhlIGVkaXRhYmxlIGlucHV0c1xyXG4gICAgJCgnLkVkaXRhYmxlLWNoZWNrLXRleHQgaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZ1bmN0aW9uKGksIHYpIHsgcmV0dXJuICF2OyB9KTs7XHJcbn0iLCIkKCdzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCQodGhpcykudmFsKCkgPT0gXCJtb2RhbC10cmlnZ2VyXCIpIHtcclxuICAgICAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcbn0pOyIsIiQoJy5IYW1idXJnZXInKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdPcGVuJyk7XHJcbiAgICAkKCcuU3ViLWhlYWRlcl9iYXInKS50b2dnbGVDbGFzcygnSGFtYnVyZ2VyLW9wZW4nKTtcclxuICAgIGNvbnNvbGUubG9nKCd0b2dnbGVkJylcclxufSk7IiwiJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHsgICAgXHJcbiAgICB2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgIGlmIChzY3JvbGwgPj0gNTApIHtcclxuICAgICAgICAkKFwiLlN1Yi1oZWFkZXJfYmFyXCIpLmFkZENsYXNzKFwiU3RpY2t5LWhlYWRlclwiKTtcclxuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikuYWRkQ2xhc3MoXCJPbmx5XCIpO1xyXG4gICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKFwiVy1TdGlja3ktbmF2LS1lblwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJChcIi5TdWItaGVhZGVyX2JhclwiKS5yZW1vdmVDbGFzcyhcIlN0aWNreS1oZWFkZXJcIik7XHJcbiAgICAgICAgJChcIi5IZWFkZXJfYmFyXCIpLnJlbW92ZUNsYXNzKFwiT25seVwiKTtcclxuICAgICAgICAkKFwiaHRtbFwiKS5yZW1vdmVDbGFzcyhcIlctU3RpY2t5LW5hdi0tZW5cIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnLkhlYWRlcl9iYXJfX2FsZXJ0JykuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICQoJy5IZWFkZXJfYmFyX19hbGVydC0tbm90aWZpY2F0aW9uJykuaGlkZSgpO1xyXG59KSIsIi8qXHJcbiogQWRkcyBhIG1hcmtlciBvbiB0aGUgbWFwXHJcbipcclxuKiBAcGFyYW0gTWFwXHRtYXBcdFx0XHRcdFRoZSBtYXAgd2hlcmUgdG8gYWRkIHRoZSBtYXJrZXJcclxuKiBAcGFyYW0gZmxvYXQgIGxhdCAgICAgXHRcdFRoZSBwbGFjZSBsYXRpdHVkZSBcclxuKiBAcGFyYW0gZmxvYXQgIGxvbmcgICAgXHRcdFRoZSBwbGFjZSBsb25naXR1ZGVcclxuKiBAcGFyYW0gc3RyaW5nIGNvbnRlbnRTdHJpbmdcdFRoZSB3aW5kb3cgaW5mbyBjb250ZW50XHJcbiogQHBhcmFtIHN0cmluZyB0eXBlICAgIFx0XHRUaGUgcGluIHR5cGUuIEF2YWlsYWJsZSBwaW5zOiBbcmVkLGFtYmVyLGdyZWVuXVxyXG4qIEBwYXJhbSBzdHJpbmcgbGFiZWwgICBcdFx0VGhlIHBpbiBsYWJlbC4gQXZhaWxhYmxlIGxhYmVsOiBbY3ljbG9uZSxjb25mbGljdCxlYXJ0aHF1YWtlLHRzdW5hbWksc3Rvcm0sdm9sY2Fubyx0b3JuYWRvLGluc2VjdC1pbmZlc3RhdGlvbixkYW5nZXJvdXMtYXJlYV1cclxuKiBAcmV0dXJuIHtOdW1iZXJ9IHN1bVxyXG4qL1xyXG5mdW5jdGlvbiBhZGRNYXJrZXIobWFwLCBsYXQsIGxvbmcsIGNvbnRlbnRTdHJpbmcsIHR5cGUgLCBsYWJlbCA9IG51bGwpXHJcbntcclxuXHR2YXIgbWFya2VyID0gbmV3IE1hcmtlcih7XHJcblx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxvbmcpLFxyXG5cdFx0bWFwOiBtYXAsXHJcblx0XHRpY29uOiAnaW1nL21hcmtlcnMvJyArIHR5cGUgKyAnLnN2ZycsXHJcblx0XHRtYXBfaWNvbl9sYWJlbDogKGxhYmVsICE9PSBudWxsKSA/ICc8aSBjbGFzcz1cIm1hcC1pY29uIEljb24tLScgKyBsYWJlbCArICcgSWNvbi0tc21cIj48L2k+JyA6ICcnXHJcblx0fSk7XHJcbiBcdFxyXG5cdHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50U3RyaW5nLFxyXG5cdFx0XHRtYXhXaWR0aDogNDgwXHJcblx0fSk7XHJcblxyXG5cdG1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XHJcblx0fSk7XHJcbn0iLCIvKipcclxuICogQWRkcyB0aGUgc2VsZWN0ZWQgY2xhc3MgdG8gdGhlIGNsaWNrZWQgcmFkaW8gYnV0dG9uXHJcbiAqIFxyXG4gKiBAcGFyYW0gRWxlbWVudCBpbnB1dCBcclxuICovXHJcbmZ1bmN0aW9uIG11bHRpX3NlbGVjdF9yYWRpb1NlbGVjdGVkKGlucHV0KXtcclxuICAgICQoaW5wdXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5TZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdTZWxlY3RlZCcpO1xyXG4gICAgJChpbnB1dCkucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ1NlbGVjdGVkJyk7XHJcbn0iLCJmdW5jdGlvbiByaWJib25DbGljayhlbGVtZW50KXtcclxuICAgIC8vUmVzZXQgYWxsIGFjdGl2ZSBjbGFzc2VzXHJcbiAgICBpZiAoICQoIGVsZW1lbnQgKS5oYXNDbGFzcyggXCJBY3RpdmVcIiApICkge1xyXG4gICAgICAgICQoXCIuUmliYm9uX19oZWFkZXJfX3dyYXAsIC5SaWJib25fX3Jlc3BvbnNlLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikucmVtb3ZlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgICQoXCIuUmliYm9uX19oZWFkZXJfX3dyYXAsIC5SaWJib25fX3Jlc3BvbnNlLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikucmVtb3ZlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xyXG5cclxuICAgICAgICAvL0FkZCBBY3RpdmUgdG8gUmliYm9uIEhlYWRlciBXcmFwXHJcbiAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hZGRDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJChlbGVtZW50KS50b2dnbGVDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5wYXJlbnQoKS50b2dnbGVDbGFzcygnQWN0aXZlJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnRpbnVlVG9OZXh0UmliYm9uKGVsZW1lbnQpe1xyXG4gICAgICAgICQoXCIuUmliYm9uX19oZWFkZXJfX3dyYXAsIC5SaWJib25fX3Jlc3BvbnNlLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikucmVtb3ZlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xyXG5cclxuICAgICAgICAvL0FkZCBBY3RpdmUgdG8gbmV4dCByaWJib25cclxuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoKS5uZXh0KFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlRG93bigpO1xyXG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkubmV4dChcIi5SaWJib25fX3Jlc3BvbnNlXCIpLmFkZENsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoKS5maW5kKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikuYWRkQ2xhc3MoJ0FjdGl2ZScpO1xyXG59XHJcblxyXG4vLyBJbnZlcnNlcyBhcnJvdyBvbiBhY2NvcmRpb24gZXhwYW5zaW9uXHJcbiQoJy5jb2xsYXBzZScpLm9uKCdzaG93bi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoXCIuZmEtY2FyZXQtZG93blwiKS5yZW1vdmVDbGFzcyhcImZhLWNhcmV0LWRvd25cIikuYWRkQ2xhc3MoXCJmYS1jYXJldC11cFwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLkhpZGUtYWxsJykuc2hvdygpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuU2hvdy1hbGwnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkub24oJ2hpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoXCIuZmEtY2FyZXQtdXBcIikucmVtb3ZlQ2xhc3MoXCJmYS1jYXJldC11cFwiKS5hZGRDbGFzcyhcImZhLWNhcmV0LWRvd25cIik7XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoJy5IaWRlLWFsbCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLlNob3ctYWxsJykuc2hvdygpO1xyXG4gICAgICAgIH1cclxufSk7XHJcblxyXG4iXX0=
