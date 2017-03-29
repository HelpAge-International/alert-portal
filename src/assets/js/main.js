"use strict";

function country_removed() {
    var countries = $("#countries_parent select");
    if (countries.length <= 1) {
        $(".remove_field").hide();
    } else {
        $(".remove_field").show();
    }
}

$("input[name=gpa_action]").change(function() {
    var addActionButton = $("#add-action-btn");
    if (this.checked) {
        addActionButton.removeClass("disabled");
        $(this).parent().parent().find(".gpa_action_department").show();
    } else {
        $(this).parent().parent().find(".gpa_action_department").hide();
        var i = 0;
        $("input[name=gpa_action]:checked").each(function() {
            i++;
        });
        if (i < 1) {
            addActionButton.addClass("disabled");
        }
    }
});

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

$("#imgInp").change(function() {
    readURL(this);
    $("#select-logo").hide();
    $("#replace-logo").show();
    $("#remove-logo").show();
});

$("#select-logo,#replace-logo").click(function(e) {
    e.preventDefault();
    $("#imgInp").trigger("click");
});

$("#remove-logo").click(function(e) {
    e.preventDefault();
    $("#replace-logo").hide();
    $("#remove-logo").hide();
    $("#select-logo").show();
    $(".Agency-details__logo__preview").css("background-image", "none");
    $(".Agency-details__logo__preview").removeClass("Selected");
});

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

function addField(element, parent, wrapper) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var remove_link = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var elementId = $(element).attr("id");
    var cloneId = elementId + "_" + Date.now();
    var clone = $(element).clone().attr("id", cloneId).wrap(wrapper).parent().html();
    $(parent).append(clone);
    if (remove_link) {
        $(parent).append(' <span><a href="#" class="remove_field text-danger" onclick="removeField(' + cloneId + ", this, " + callback.name + ')">Remove</a></span>');
    }
    if (callback) callback();
}

function removeField(element, rem_link, callback) {
    $(element).remove();
    $(rem_link).remove();
    if (callback) callback();
}

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
    } else {
        $(".Sub-header_bar").removeClass("Sticky-header");
        $(".Header_bar").removeClass("Only");
    }
});

"use strict";

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

$(".Item__selectable").click(function() {
    $(this).toggleClass("Selected");
});

"use strict";

$(".Ribbon__header__chevron").click(function() {
    if ($(this).hasClass("Active")) {
        $(".Ribbon__header__wrap, .Ribbon__response, .Ribbon__header__chevron").removeClass("Active");
        $(".Response__content").slideUp();
    } else {
        $(".Ribbon__header__wrap, .Ribbon__response, .Ribbon__header__chevron").removeClass("Active");
        $(".Response__content").slideUp();
        $(this).parent().addClass("Active");
        $(this).toggleClass("Active");
        $(this).parent().parent().next(".Response__content").slideToggle();
        $(this).parent().parent().toggleClass("Active");
    }
});

$(".btn-continue").click(function() {
    $(".Ribbon__header__wrap, .Ribbon__response, .Ribbon__header__chevron").removeClass("Active");
    $(".Response__content").slideUp();
    $(this).parent().parent().next().next(".Response__content").slideDown();
});

$(".collapse").on("shown.bs.collapse", function() {
    $(this).prev().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
    $(this).prev().find(".Show-all").hide();
    $(this).prev().find(".Hide-all").show();
}).on("hidden.bs.collapse", function() {
    $(this).prev().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");
    $(this).prev().find(".Show-all").show();
    $(this).prev().find(".Hide-all").hide();
});

"use strict";

(function($, window, document, undefined) {
    "use strict";
})(jQuery, window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1hZG1pbi5qcyIsImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImZvcm1zLmpzIiwiaW5pdGlhbF9fZHJvcGRvd24tbW9kYWwtdHJpZ2dlci5qcyIsImluaXRpYWxfX2hhbWJ1cmdlci5qcyIsImluaXRpYWxfX3N0aWNreS1uYXYuanMiLCJpbmxpbmUtZWRpdGFibGUuanMiLCJtYXAuanMiLCJyZXNwb25zZS1wbGFuX19tdWx0aS1zZWxlY3QuanMiLCJyZXNwb25zZS1wbGFuX19yZXZlYWwtcmliYm9uLmpzIl0sIm5hbWVzIjpbImNvdW50cnlfcmVtb3ZlZCIsImNvdW50cmllcyIsIiQiLCJsZW5ndGgiLCJoaWRlIiwic2hvdyIsImNoYW5nZSIsImFkZEFjdGlvbkJ1dHRvbiIsInRoaXMiLCJjaGVja2VkIiwicmVtb3ZlQ2xhc3MiLCJwYXJlbnQiLCJmaW5kIiwiaSIsImVhY2giLCJhZGRDbGFzcyIsImFkZERlcGFydG1lbnRNb2RhbCIsInNlbGVjdCIsIm1vZGFsX2lkIiwiaGFzQ2xhc3MiLCJtb2RhbCIsInJlYWRVUkwiLCJpbnB1dCIsImZpbGVzIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImUiLCJjc3MiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNEYXRhVVJMIiwiY2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsInRyaWdnZXIiLCJqUXVlcnkiLCJFcnJvciIsInQiLCJmbiIsImpxdWVyeSIsInNwbGl0IiwiUmVmZXJlbmNlRXJyb3IiLCJfdHlwZW9mIiwiVHlwZUVycm9yIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwibiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwibyIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwiciIsInRvU3RyaW5nIiwiY2FsbCIsIm1hdGNoIiwidG9Mb3dlckNhc2UiLCJub2RlVHlwZSIsImJpbmRUeXBlIiwiYSIsImVuZCIsImRlbGVnYXRlVHlwZSIsImhhbmRsZSIsImlzIiwiaGFuZGxlT2JqIiwiaGFuZGxlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2luZG93IiwiUVVuaXQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJoIiwic3R5bGUiLCJvbmUiLCJjIiwiVFJBTlNJVElPTl9FTkQiLCJzZXRUaW1lb3V0IiwidHJpZ2dlclRyYW5zaXRpb25FbmQiLCJzIiwiZW11bGF0ZVRyYW5zaXRpb25FbmQiLCJzdXBwb3J0c1RyYW5zaXRpb25FbmQiLCJldmVudCIsInNwZWNpYWwiLCJsIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJnZXRVSUQiLCJNYXRoIiwicmFuZG9tIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRTZWxlY3RvckZyb21FbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwidGVzdCIsInJlZmxvdyIsIm9mZnNldEhlaWdodCIsIkJvb2xlYW4iLCJ0eXBlQ2hlY2tDb25maWciLCJoYXNPd25Qcm9wZXJ0eSIsIlJlZ0V4cCIsInRvVXBwZXJDYXNlIiwidSIsIkRJU01JU1MiLCJkIiwiQ0xPU0UiLCJDTE9TRUQiLCJDTElDS19EQVRBX0FQSSIsImYiLCJBTEVSVCIsIkZBREUiLCJTSE9XIiwiXyIsIl9lbGVtZW50IiwiY2xvc2UiLCJfZ2V0Um9vdEVsZW1lbnQiLCJfdHJpZ2dlckNsb3NlRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJfcmVtb3ZlRWxlbWVudCIsImRpc3Bvc2UiLCJyZW1vdmVEYXRhIiwiY2xvc2VzdCIsIkV2ZW50IiwiX2Rlc3Ryb3lFbGVtZW50IiwiZGV0YWNoIiwicmVtb3ZlIiwiX2pRdWVyeUludGVyZmFjZSIsImRhdGEiLCJfaGFuZGxlRGlzbWlzcyIsImdldCIsIm9uIiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQUNUSVZFIiwiQlVUVE9OIiwiRk9DVVMiLCJEQVRBX1RPR0dMRV9DQVJST1QiLCJEQVRBX1RPR0dMRSIsIklOUFVUIiwiRk9DVVNfQkxVUl9EQVRBX0FQSSIsInRvZ2dsZSIsInR5cGUiLCJmb2N1cyIsInNldEF0dHJpYnV0ZSIsInRvZ2dsZUNsYXNzIiwiaW50ZXJ2YWwiLCJrZXlib2FyZCIsInNsaWRlIiwicGF1c2UiLCJ3cmFwIiwiZyIsInAiLCJORVhUIiwiUFJFViIsIkxFRlQiLCJSSUdIVCIsIm0iLCJTTElERSIsIlNMSUQiLCJLRVlET1dOIiwiTU9VU0VFTlRFUiIsIk1PVVNFTEVBVkUiLCJMT0FEX0RBVEFfQVBJIiwiRSIsIkNBUk9VU0VMIiwiSVRFTSIsInYiLCJBQ1RJVkVfSVRFTSIsIk5FWFRfUFJFViIsIklORElDQVRPUlMiLCJEQVRBX1NMSURFIiwiREFUQV9SSURFIiwiVCIsIl9pdGVtcyIsIl9pbnRlcnZhbCIsIl9hY3RpdmVFbGVtZW50IiwiX2lzUGF1c2VkIiwiX2lzU2xpZGluZyIsIl9jb25maWciLCJfZ2V0Q29uZmlnIiwiX2luZGljYXRvcnNFbGVtZW50IiwiX2FkZEV2ZW50TGlzdGVuZXJzIiwibmV4dCIsIl9zbGlkZSIsIm5leHRXaGVuVmlzaWJsZSIsImhpZGRlbiIsInByZXYiLCJQUkVWSU9VUyIsImN5Y2xlIiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwidmlzaWJpbGl0eVN0YXRlIiwiYmluZCIsInRvIiwiX2dldEl0ZW1JbmRleCIsIm9mZiIsImV4dGVuZCIsIl9rZXlkb3duIiwiZG9jdW1lbnRFbGVtZW50IiwidGFnTmFtZSIsIndoaWNoIiwibWFrZUFycmF5IiwiaW5kZXhPZiIsIl9nZXRJdGVtQnlEaXJlY3Rpb24iLCJfdHJpZ2dlclNsaWRlRXZlbnQiLCJyZWxhdGVkVGFyZ2V0IiwiZGlyZWN0aW9uIiwiX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQiLCJjaGlsZHJlbiIsIl9kYXRhQXBpQ2xpY2tIYW5kbGVyIiwiU0hPV04iLCJISURFIiwiSElEREVOIiwiQ09MTEFQU0UiLCJDT0xMQVBTSU5HIiwiQ09MTEFQU0VEIiwiV0lEVEgiLCJIRUlHSFQiLCJBQ1RJVkVTIiwiX2lzVHJhbnNpdGlvbmluZyIsIl90cmlnZ2VyQXJyYXkiLCJpZCIsIl9wYXJlbnQiLCJfZ2V0UGFyZW50IiwiX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsIl9nZXREaW1lbnNpb24iLCJhdHRyIiwic2V0VHJhbnNpdGlvbmluZyIsInNsaWNlIiwiX2dldFRhcmdldEZyb21FbGVtZW50IiwiQ0xJQ0siLCJGT0NVU0lOX0RBVEFfQVBJIiwiS0VZRE9XTl9EQVRBX0FQSSIsIkJBQ0tEUk9QIiwiRElTQUJMRUQiLCJGT1JNX0NISUxEIiwiUk9MRV9NRU5VIiwiUk9MRV9MSVNUQk9YIiwiTkFWQkFSX05BViIsIlZJU0lCTEVfSVRFTVMiLCJkaXNhYmxlZCIsIl9nZXRQYXJlbnRGcm9tRWxlbWVudCIsIl9jbGVhck1lbnVzIiwiY2xhc3NOYW1lIiwiaW5zZXJ0QmVmb3JlIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwiY29udGFpbnMiLCJfZGF0YUFwaUtleWRvd25IYW5kbGVyIiwic3RvcFByb3BhZ2F0aW9uIiwiYmFja2Ryb3AiLCJGT0NVU0lOIiwiUkVTSVpFIiwiQ0xJQ0tfRElTTUlTUyIsIktFWURPV05fRElTTUlTUyIsIk1PVVNFVVBfRElTTUlTUyIsIk1PVVNFRE9XTl9ESVNNSVNTIiwiU0NST0xMQkFSX01FQVNVUkVSIiwiT1BFTiIsIkRJQUxPRyIsIkRBVEFfRElTTUlTUyIsIkZJWEVEX0NPTlRFTlQiLCJfZGlhbG9nIiwiX2JhY2tkcm9wIiwiX2lzU2hvd24iLCJfaXNCb2R5T3ZlcmZsb3dpbmciLCJfaWdub3JlQmFja2Ryb3BDbGljayIsIl9vcmlnaW5hbEJvZHlQYWRkaW5nIiwiX3Njcm9sbGJhcldpZHRoIiwiX2NoZWNrU2Nyb2xsYmFyIiwiX3NldFNjcm9sbGJhciIsImJvZHkiLCJfc2V0RXNjYXBlRXZlbnQiLCJfc2V0UmVzaXplRXZlbnQiLCJfc2hvd0JhY2tkcm9wIiwiX3Nob3dFbGVtZW50IiwiX2hpZGVNb2RhbCIsIk5vZGUiLCJFTEVNRU5UX05PREUiLCJhcHBlbmRDaGlsZCIsImRpc3BsYXkiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzY3JvbGxUb3AiLCJfZW5mb3JjZUZvY3VzIiwiaGFzIiwiX2hhbmRsZVVwZGF0ZSIsIl9yZXNldEFkanVzdG1lbnRzIiwiX3Jlc2V0U2Nyb2xsYmFyIiwiX3JlbW92ZUJhY2tkcm9wIiwiYXBwZW5kVG8iLCJjdXJyZW50VGFyZ2V0IiwiX2FkanVzdERpYWxvZyIsInNjcm9sbEhlaWdodCIsImNsaWVudEhlaWdodCIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0IiwiY2xpZW50V2lkdGgiLCJpbm5lcldpZHRoIiwiX2dldFNjcm9sbGJhcldpZHRoIiwicGFyc2VJbnQiLCJvZmZzZXRXaWR0aCIsIkRlZmF1bHQiLCJvZmZzZXQiLCJtZXRob2QiLCJBQ1RJVkFURSIsIlNDUk9MTCIsIkRST1BET1dOX0lURU0iLCJEUk9QRE9XTl9NRU5VIiwiTkFWX0xJTksiLCJOQVYiLCJEQVRBX1NQWSIsIkxJU1RfSVRFTSIsIkxJIiwiTElfRFJPUERPV04iLCJOQVZfTElOS1MiLCJEUk9QRE9XTiIsIkRST1BET1dOX0lURU1TIiwiRFJPUERPV05fVE9HR0xFIiwiT0ZGU0VUIiwiUE9TSVRJT04iLCJfc2Nyb2xsRWxlbWVudCIsIl9zZWxlY3RvciIsIl9vZmZzZXRzIiwiX3RhcmdldHMiLCJfYWN0aXZlVGFyZ2V0IiwiX3Njcm9sbEhlaWdodCIsIl9wcm9jZXNzIiwicmVmcmVzaCIsIl9nZXRTY3JvbGxUb3AiLCJfZ2V0U2Nyb2xsSGVpZ2h0IiwibWFwIiwidG9wIiwiZmlsdGVyIiwic29ydCIsImZvckVhY2giLCJwdXNoIiwicGFnZVlPZmZzZXQiLCJtYXgiLCJfZ2V0T2Zmc2V0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJfYWN0aXZhdGUiLCJfY2xlYXIiLCJqb2luIiwicGFyZW50cyIsIkEiLCJMSVNUIiwiRkFERV9DSElMRCIsIkFDVElWRV9DSElMRCIsIkRST1BET1dOX0FDVElWRV9DSElMRCIsIl90cmFuc2l0aW9uQ29tcGxldGUiLCJUZXRoZXIiLCJhbmltYXRpb24iLCJ0ZW1wbGF0ZSIsInRpdGxlIiwiZGVsYXkiLCJodG1sIiwic2VsZWN0b3IiLCJwbGFjZW1lbnQiLCJjb25zdHJhaW50cyIsImNvbnRhaW5lciIsIlRPUCIsIkJPVFRPTSIsIk9VVCIsIklOU0VSVEVEIiwiRk9DVVNPVVQiLCJUT09MVElQIiwiVE9PTFRJUF9JTk5FUiIsImVsZW1lbnQiLCJlbmFibGVkIiwiSE9WRVIiLCJNQU5VQUwiLCJJIiwiX2lzRW5hYmxlZCIsIl90aW1lb3V0IiwiX2hvdmVyU3RhdGUiLCJfYWN0aXZlVHJpZ2dlciIsIl90ZXRoZXIiLCJjb25maWciLCJ0aXAiLCJfc2V0TGlzdGVuZXJzIiwiZW5hYmxlIiwiZGlzYWJsZSIsInRvZ2dsZUVuYWJsZWQiLCJEQVRBX0tFWSIsIl9nZXREZWxlZ2F0ZUNvbmZpZyIsIl9pc1dpdGhBY3RpdmVUcmlnZ2VyIiwiX2VudGVyIiwiX2xlYXZlIiwiZ2V0VGlwRWxlbWVudCIsImNsZWFyVGltZW91dCIsImNsZWFudXBUZXRoZXIiLCJFVkVOVF9LRVkiLCJpc1dpdGhDb250ZW50Iiwib3duZXJEb2N1bWVudCIsIk5BTUUiLCJzZXRDb250ZW50IiwiX2dldEF0dGFjaG1lbnQiLCJhdHRhY2htZW50IiwiY2xhc3NlcyIsImNsYXNzUHJlZml4IiwiYWRkVGFyZ2V0Q2xhc3NlcyIsInBvc2l0aW9uIiwiX1RSQU5TSVRJT05fRFVSQVRJT04iLCJnZXRUaXRsZSIsInNldEVsZW1lbnRDb250ZW50IiwiZW1wdHkiLCJhcHBlbmQiLCJ0ZXh0IiwiZGVzdHJveSIsIl9maXhUaXRsZSIsIkRlZmF1bHRUeXBlIiwiY29udGVudCIsIlRJVExFIiwiQ09OVEVOVCIsIl9nZXRDb250ZW50IiwiYWRkRmllbGQiLCJ3cmFwcGVyIiwiY2FsbGJhY2siLCJ1bmRlZmluZWQiLCJyZW1vdmVfbGluayIsImVsZW1lbnRJZCIsImNsb25lSWQiLCJEYXRlIiwibm93IiwiY2xvbmUiLCJuYW1lIiwicmVtb3ZlRmllbGQiLCJyZW1fbGluayIsInNldEZvY3VzVmFsdWUiLCJ2YWwiLCJjb2xsYXBzZUFsbCIsImFjY29yZGlvbiIsImFjdGlvbiIsImNvbGxhcHNlIiwicHJvcCIsImNvbnNvbGUiLCJsb2ciLCJzY3JvbGwiLCJhZGRNYXJrZXIiLCJsYXQiLCJsb25nIiwiY29udGVudFN0cmluZyIsImxhYmVsIiwibWFya2VyIiwiTWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIkxhdExuZyIsImljb24iLCJtYXBfaWNvbl9sYWJlbCIsImluZm93aW5kb3ciLCJJbmZvV2luZG93IiwibWF4V2lkdGgiLCJhZGRMaXN0ZW5lciIsIm9wZW4iLCJzbGlkZVVwIiwic2xpZGVUb2dnbGUiLCJzbGlkZURvd24iXSwibWFwcGluZ3MiOiI7O0FBQ0EsU0FBU0E7SUFFTCxJQUFJQyxZQUFZQyxFQUFFO0lBRWxCLElBQUdELFVBQVVFLFVBQVUsR0FDdkI7UUFFSUQsRUFBRSxpQkFBaUJFO1dBQ2xCO1FBQ0RGLEVBQUUsaUJBQWlCRzs7OztBQUszQkgsRUFBRSwwQkFBMEJJLE9BQU87SUFDL0IsSUFBSUMsa0JBQWtCTCxFQUFFO0lBRXhCLElBQUdNLEtBQUtDLFNBQVM7UUFFYkYsZ0JBQWdCRyxZQUFZO1FBRzVCUixFQUFFTSxNQUFNRyxTQUFTQSxTQUFTQyxLQUFLLDBCQUEwQlA7V0FDeEQ7UUFFREgsRUFBRU0sTUFBTUcsU0FBU0EsU0FBU0MsS0FBSywwQkFBMEJSO1FBR3pELElBQUlTLElBQUk7UUFDUlgsRUFBRSxrQ0FBa0NZLEtBQUs7WUFDdENEOztRQUVILElBQUdBLElBQUksR0FDUDtZQUNJTixnQkFBZ0JRLFNBQVM7Ozs7O0FBV3JDLFNBQVNDLG1CQUFtQkMsUUFBUUM7SUFDaEMsSUFBR2hCLEVBQUVlLFFBQVFMLEtBQUssYUFBYU8sU0FBUyxtQkFDeEM7UUFDSWpCLEVBQUVnQixVQUFVRSxNQUFNOzs7Ozs7QUNqRDFCLFNBQVNDLFFBQVFDO0lB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YSByZW1vdmUgZmllbGQgaXMgY2xpY2tlZFxyXG5mdW5jdGlvbiBjb3VudHJ5X3JlbW92ZWQoKVxyXG57XHJcbiAgICB2YXIgY291bnRyaWVzID0gJCgnI2NvdW50cmllc19wYXJlbnQgc2VsZWN0Jyk7XHJcblxyXG4gICAgaWYoY291bnRyaWVzLmxlbmd0aCA8PSAxKVxyXG4gICAge1xyXG4gICAgICAgIC8vIGhpZGUgdGhlIHJlbW92ZSBsaW5rc1xyXG4gICAgICAgICQoJy5yZW1vdmVfZmllbGQnKS5oaWRlKCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkKCcucmVtb3ZlX2ZpZWxkJykuc2hvdygpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBHZW5lcmljIHByZXBhcmVkbmVzcyBhY3Rpb24gaXRlbVxyXG4kKCdpbnB1dFtuYW1lPWdwYV9hY3Rpb25dJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGFkZEFjdGlvbkJ1dHRvbiA9ICQoJyNhZGQtYWN0aW9uLWJ0bicpO1xyXG4gICAgXHJcbiAgICBpZih0aGlzLmNoZWNrZWQpIHtcclxuICAgICAgICAvLyBFbmFibGUgdGhlIGFkZCBhY3Rpb24gYnV0dG9uXHJcbiAgICAgICAgYWRkQWN0aW9uQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgICAgICAvLyBTaG93IGRlcGFydG1lbnQgZHJvcGRvd25cclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5ncGFfYWN0aW9uX2RlcGFydG1lbnQnKS5zaG93KCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAvLyBIaWRlIGRlcGFydG1lbnQgZHJvcGRvd25cclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5ncGFfYWN0aW9uX2RlcGFydG1lbnQnKS5oaWRlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRGlzYWJsZSB0aGUgYWRkIGFjdGlvbiBidXR0b24gaWYgdGhlcmUgYXJlIG5vIGNoZWNrZWQgYWN0aW9uc1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAkKFwiaW5wdXRbbmFtZT1ncGFfYWN0aW9uXTpjaGVja2VkXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmKGkgPCAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYWRkQWN0aW9uQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4vKlxyXG4qIFZlcmlmeSBpZiB0aGUgQWRkIGRlcGFydG1lbnQgb3B0aW9uIGlzIHNlbGVjdGVkIGFuZCBvcGVuIHRoZSBtb2RhbCB3aW5kb3dcclxuKlxyXG4qIEBwYXJhbSBPYmplY3Qgc2VsZWN0ICAgICAgVGhlIHNlbGVjdCBPYmplY3RcclxuKiBAcGFyYW0gc3RyaW5nIG1vZGFsX2lkICAgIFRoZSBtb2RhbCBpZCB0byBvcGVuXHJcbiovXHJcbmZ1bmN0aW9uIGFkZERlcGFydG1lbnRNb2RhbChzZWxlY3QsIG1vZGFsX2lkKXtcclxuICAgIGlmKCQoc2VsZWN0KS5maW5kKFwiOnNlbGVjdGVkXCIpLmhhc0NsYXNzKCdhZGQtZGVwYXJ0bWVudCcpKVxyXG4gICAge1xyXG4gICAgICAgICQobW9kYWxfaWQpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcbn0iLCJmdW5jdGlvbiByZWFkVVJMKGlucHV0KSB7XHJcbiAgaWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzWzBdKSB7XHJcbiAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICBcclxuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBlLnRhcmdldC5yZXN1bHQgKyAnKScpO1xyXG4gICAgICAgICAgJCgnLkFnZW5jeS1kZXRhaWxzX19sb2dvX19wcmV2aWV3JykuYWRkQ2xhc3MoJ1NlbGVjdGVkJylcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xyXG4gIH1cclxufVxyXG5cclxuJChcIiNpbWdJbnBcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcbiAgcmVhZFVSTCh0aGlzKTtcclxuICAkKFwiI3NlbGVjdC1sb2dvXCIpLmhpZGUoKTtcclxuICAkKFwiI3JlcGxhY2UtbG9nb1wiKS5zaG93KCk7XHJcbiAgJChcIiNyZW1vdmUtbG9nb1wiKS5zaG93KCk7XHJcbn0pO1xyXG5cclxuJChcIiNzZWxlY3QtbG9nbywjcmVwbGFjZS1sb2dvXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG4gICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICQoXCIjaW1nSW5wXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbn0pO1xyXG5cclxuJChcIiNyZW1vdmUtbG9nb1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJChcIiNyZXBsYWNlLWxvZ29cIikuaGlkZSgpO1xyXG4gICAgJChcIiNyZW1vdmUtbG9nb1wiKS5oaWRlKCk7XHJcbiAgICAkKFwiI3NlbGVjdC1sb2dvXCIpLnNob3coKTtcclxuICAgICQoJy5BZ2VuY3ktZGV0YWlsc19fbG9nb19fcHJldmlldycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICdub25lJyk7XHJcbiAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5yZW1vdmVDbGFzcygnU2VsZWN0ZWQnKVxyXG59KTsiLCIvKiFcclxuICogQm9vdHN0cmFwIHY0LjAuMC1hbHBoYS42IChodHRwczovL2dldGJvb3RzdHJhcC5jb20pXHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTcgVGhlIEJvb3RzdHJhcCBBdXRob3JzIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvZ3JhcGhzL2NvbnRyaWJ1dG9ycylcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICovXHJcbmlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBqUXVlcnkpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkuIGpRdWVyeSBtdXN0IGJlIGluY2x1ZGVkIGJlZm9yZSBCb290c3RyYXAncyBKYXZhU2NyaXB0LlwiKTsrZnVuY3Rpb24odCl7dmFyIGU9dC5mbi5qcXVlcnkuc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiLlwiKTtpZihlWzBdPDImJmVbMV08OXx8MT09ZVswXSYmOT09ZVsxXSYmZVsyXTwxfHxlWzBdPj00KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgYXQgbGVhc3QgalF1ZXJ5IHYxLjkuMSBidXQgbGVzcyB0aGFuIHY0LjAuMFwiKX0oalF1ZXJ5KSwrZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFlfHxcIm9iamVjdFwiIT10eXBlb2YgZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT90OmV9ZnVuY3Rpb24gZSh0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBlKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LGUpOnQuX19wcm90b19fPWUpfWZ1bmN0aW9uIG4odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LG89ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKSxyPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7cmV0dXJue30udG9TdHJpbmcuY2FsbCh0KS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIG4odCl7cmV0dXJuKHRbMF18fHQpLm5vZGVUeXBlfWZ1bmN0aW9uIGkoKXtyZXR1cm57YmluZFR5cGU6YS5lbmQsZGVsZWdhdGVUeXBlOmEuZW5kLGhhbmRsZTpmdW5jdGlvbihlKXtpZih0KGUudGFyZ2V0KS5pcyh0aGlzKSlyZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fX1mdW5jdGlvbiBvKCl7aWYod2luZG93LlFVbml0KXJldHVybiExO3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib290c3RyYXBcIik7Zm9yKHZhciBlIGluIGgpaWYodm9pZCAwIT09dC5zdHlsZVtlXSlyZXR1cm57ZW5kOmhbZV19O3JldHVybiExfWZ1bmN0aW9uIHIoZSl7dmFyIG49dGhpcyxpPSExO3JldHVybiB0KHRoaXMpLm9uZShjLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKCl7aT0hMH0pLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpfHxjLnRyaWdnZXJUcmFuc2l0aW9uRW5kKG4pfSxlKSx0aGlzfWZ1bmN0aW9uIHMoKXthPW8oKSx0LmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kPXIsYy5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHQuZXZlbnQuc3BlY2lhbFtjLlRSQU5TSVRJT05fRU5EXT1pKCkpfXZhciBhPSExLGw9MWU2LGg9e1dlYmtpdFRyYW5zaXRpb246XCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCIsTW96VHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIixPVHJhbnNpdGlvbjpcIm9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kXCIsdHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIn0sYz17VFJBTlNJVElPTl9FTkQ6XCJic1RyYW5zaXRpb25FbmRcIixnZXRVSUQ6ZnVuY3Rpb24odCl7ZG8gdCs9fn4oTWF0aC5yYW5kb20oKSpsKTt3aGlsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0KSk7cmV0dXJuIHR9LGdldFNlbGVjdG9yRnJvbUVsZW1lbnQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhcmdldFwiKTtyZXR1cm4gZXx8KGU9dC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfHxcIlwiLGU9L14jW2Etel0vaS50ZXN0KGUpP2U6bnVsbCksZX0scmVmbG93OmZ1bmN0aW9uKHQpe3JldHVybiB0Lm9mZnNldEhlaWdodH0sdHJpZ2dlclRyYW5zaXRpb25FbmQ6ZnVuY3Rpb24oZSl7dChlKS50cmlnZ2VyKGEuZW5kKX0sc3VwcG9ydHNUcmFuc2l0aW9uRW5kOmZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4oYSl9LHR5cGVDaGVja0NvbmZpZzpmdW5jdGlvbih0LGksbyl7Zm9yKHZhciByIGluIG8paWYoby5oYXNPd25Qcm9wZXJ0eShyKSl7dmFyIHM9b1tyXSxhPWlbcl0sbD1hJiZuKGEpP1wiZWxlbWVudFwiOmUoYSk7aWYoIW5ldyBSZWdFeHAocykudGVzdChsKSl0aHJvdyBuZXcgRXJyb3IodC50b1VwcGVyQ2FzZSgpK1wiOiBcIisoJ09wdGlvbiBcIicrcisnXCIgcHJvdmlkZWQgdHlwZSBcIicrbCsnXCIgJykrKCdidXQgZXhwZWN0ZWQgdHlwZSBcIicrcysnXCIuJykpfX19O3JldHVybiBzKCksY30oalF1ZXJ5KSxzPShmdW5jdGlvbih0KXt2YXIgZT1cImFsZXJ0XCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMuYWxlcnRcIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTE1MCx1PXtESVNNSVNTOidbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nfSxkPXtDTE9TRTpcImNsb3NlXCIrYSxDTE9TRUQ6XCJjbG9zZWRcIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGY9e0FMRVJUOlwiYWxlcnRcIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKHQpe3Q9dHx8dGhpcy5fZWxlbWVudDt2YXIgZT10aGlzLl9nZXRSb290RWxlbWVudCh0KSxuPXRoaXMuX3RyaWdnZXJDbG9zZUV2ZW50KGUpO24uaXNEZWZhdWx0UHJldmVudGVkKCl8fHRoaXMuX3JlbW92ZUVsZW1lbnQoZSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxzKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9nZXRSb290RWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSksaT0hMTtyZXR1cm4gbiYmKGk9dChuKVswXSksaXx8KGk9dChlKS5jbG9zZXN0KFwiLlwiK2YuQUxFUlQpWzBdKSxpfSxlLnByb3RvdHlwZS5fdHJpZ2dlckNsb3NlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dC5FdmVudChkLkNMT1NFKTtyZXR1cm4gdChlKS50cmlnZ2VyKG4pLG59LGUucHJvdG90eXBlLl9yZW1vdmVFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7cmV0dXJuIHQoZSkucmVtb3ZlQ2xhc3MoZi5TSE9XKSxyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KGUpLmhhc0NsYXNzKGYuRkFERSk/dm9pZCB0KGUpLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKHQpe3JldHVybiBuLl9kZXN0cm95RWxlbWVudChlLHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYyk6dm9pZCB0aGlzLl9kZXN0cm95RWxlbWVudChlKX0sZS5wcm90b3R5cGUuX2Rlc3Ryb3lFbGVtZW50PWZ1bmN0aW9uKGUpe3QoZSkuZGV0YWNoKCkudHJpZ2dlcihkLkNMT1NFRCkucmVtb3ZlKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJjbG9zZVwiPT09biYmb1tuXSh0aGlzKX0pfSxlLl9oYW5kbGVEaXNtaXNzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXtlJiZlLnByZXZlbnREZWZhdWx0KCksdC5jbG9zZSh0aGlzKX19LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihkLkNMSUNLX0RBVEFfQVBJLHUuRElTTUlTUyxfLl9oYW5kbGVEaXNtaXNzKG5ldyBfKSksdC5mbltlXT1fLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1fLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsXy5falF1ZXJ5SW50ZXJmYWNlfSxffShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiYnV0dG9uXCIsaT1cIjQuMC4wLWFscGhhLjZcIixyPVwiYnMuYnV0dG9uXCIscz1cIi5cIityLGE9XCIuZGF0YS1hcGlcIixsPXQuZm5bZV0saD17QUNUSVZFOlwiYWN0aXZlXCIsQlVUVE9OOlwiYnRuXCIsRk9DVVM6XCJmb2N1c1wifSxjPXtEQVRBX1RPR0dMRV9DQVJST1Q6J1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJyxJTlBVVDpcImlucHV0XCIsQUNUSVZFOlwiLmFjdGl2ZVwiLEJVVFRPTjpcIi5idG5cIn0sdT17Q0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK3MrYSxGT0NVU19CTFVSX0RBVEFfQVBJOlwiZm9jdXNcIitzK2ErXCIgXCIrKFwiYmx1clwiK3MrYSl9LGQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3ZhciBlPSEwLG49dCh0aGlzLl9lbGVtZW50KS5jbG9zZXN0KGMuREFUQV9UT0dHTEUpWzBdO2lmKG4pe3ZhciBpPXQodGhpcy5fZWxlbWVudCkuZmluZChjLklOUFVUKVswXTtpZihpKXtpZihcInJhZGlvXCI9PT1pLnR5cGUpaWYoaS5jaGVja2VkJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSllPSExO2Vsc2V7dmFyIG89dChuKS5maW5kKGMuQUNUSVZFKVswXTtvJiZ0KG8pLnJlbW92ZUNsYXNzKGguQUNUSVZFKX1lJiYoaS5jaGVja2VkPSF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSx0KGkpLnRyaWdnZXIoXCJjaGFuZ2VcIikpLGkuZm9jdXMoKX19dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXByZXNzZWRcIiwhdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSkpLGUmJnQodGhpcy5fZWxlbWVudCkudG9nZ2xlQ2xhc3MoaC5BQ1RJVkUpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsciksdGhpcy5fZWxlbWVudD1udWxsfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShyKTtpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocixpKSksXCJ0b2dnbGVcIj09PW4mJmlbbl0oKX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxjLkRBVEFfVE9HR0xFX0NBUlJPVCxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIG49ZS50YXJnZXQ7dChuKS5oYXNDbGFzcyhoLkJVVFRPTil8fChuPXQobikuY2xvc2VzdChjLkJVVFRPTikpLGQuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJ0b2dnbGVcIil9KS5vbih1LkZPQ1VTX0JMVVJfREFUQV9BUEksYy5EQVRBX1RPR0dMRV9DQVJST1QsZnVuY3Rpb24oZSl7dmFyIG49dChlLnRhcmdldCkuY2xvc2VzdChjLkJVVFRPTilbMF07dChuKS50b2dnbGVDbGFzcyhoLkZPQ1VTLC9eZm9jdXMoaW4pPyQvLnRlc3QoZS50eXBlKSl9KSx0LmZuW2VdPWQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPWQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09bCxkLl9qUXVlcnlJbnRlcmZhY2V9LGR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjYXJvdXNlbFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNhcm91c2VsXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD0zNyxmPTM5LF89e2ludGVydmFsOjVlMyxrZXlib2FyZDohMCxzbGlkZTohMSxwYXVzZTpcImhvdmVyXCIsd3JhcDohMH0sZz17aW50ZXJ2YWw6XCIobnVtYmVyfGJvb2xlYW4pXCIsa2V5Ym9hcmQ6XCJib29sZWFuXCIsc2xpZGU6XCIoYm9vbGVhbnxzdHJpbmcpXCIscGF1c2U6XCIoc3RyaW5nfGJvb2xlYW4pXCIsd3JhcDpcImJvb2xlYW5cIn0scD17TkVYVDpcIm5leHRcIixQUkVWOlwicHJldlwiLExFRlQ6XCJsZWZ0XCIsUklHSFQ6XCJyaWdodFwifSxtPXtTTElERTpcInNsaWRlXCIrbCxTTElEOlwic2xpZFwiK2wsS0VZRE9XTjpcImtleWRvd25cIitsLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrbCxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2gsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sRT17Q0FST1VTRUw6XCJjYXJvdXNlbFwiLEFDVElWRTpcImFjdGl2ZVwiLFNMSURFOlwic2xpZGVcIixSSUdIVDpcImNhcm91c2VsLWl0ZW0tcmlnaHRcIixMRUZUOlwiY2Fyb3VzZWwtaXRlbS1sZWZ0XCIsTkVYVDpcImNhcm91c2VsLWl0ZW0tbmV4dFwiLFBSRVY6XCJjYXJvdXNlbC1pdGVtLXByZXZcIixJVEVNOlwiY2Fyb3VzZWwtaXRlbVwifSx2PXtBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0lURU06XCIuYWN0aXZlLmNhcm91c2VsLWl0ZW1cIixJVEVNOlwiLmNhcm91c2VsLWl0ZW1cIixORVhUX1BSRVY6XCIuY2Fyb3VzZWwtaXRlbS1uZXh0LCAuY2Fyb3VzZWwtaXRlbS1wcmV2XCIsSU5ESUNBVE9SUzpcIi5jYXJvdXNlbC1pbmRpY2F0b3JzXCIsREFUQV9TTElERTpcIltkYXRhLXNsaWRlXSwgW2RhdGEtc2xpZGUtdG9dXCIsREFUQV9SSURFOidbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nfSxUPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe24odGhpcyxoKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2ludGVydmFsPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2lzUGF1c2VkPSExLHRoaXMuX2lzU2xpZGluZz0hMSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX2VsZW1lbnQ9dChlKVswXSx0aGlzLl9pbmRpY2F0b3JzRWxlbWVudD10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5JTkRJQ0FUT1JTKVswXSx0aGlzLl9hZGRFdmVudExpc3RlbmVycygpfXJldHVybiBoLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7aWYodGhpcy5faXNTbGlkaW5nKXRocm93IG5ldyBFcnJvcihcIkNhcm91c2VsIGlzIHNsaWRpbmdcIik7dGhpcy5fc2xpZGUocC5ORVhUKX0saC5wcm90b3R5cGUubmV4dFdoZW5WaXNpYmxlPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuaGlkZGVufHx0aGlzLm5leHQoKX0saC5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe2lmKHRoaXMuX2lzU2xpZGluZyl0aHJvdyBuZXcgRXJyb3IoXCJDYXJvdXNlbCBpcyBzbGlkaW5nXCIpO3RoaXMuX3NsaWRlKHAuUFJFVklPVVMpfSxoLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihlKXtlfHwodGhpcy5faXNQYXVzZWQ9ITApLHQodGhpcy5fZWxlbWVudCkuZmluZCh2Lk5FWFRfUFJFVilbMF0mJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihyLnRyaWdnZXJUcmFuc2l0aW9uRW5kKHRoaXMuX2VsZW1lbnQpLHRoaXMuY3ljbGUoITApKSxjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsKSx0aGlzLl9pbnRlcnZhbD1udWxsfSxoLnByb3RvdHlwZS5jeWNsZT1mdW5jdGlvbih0KXt0fHwodGhpcy5faXNQYXVzZWQ9ITEpLHRoaXMuX2ludGVydmFsJiYoY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCksdGhpcy5faW50ZXJ2YWw9bnVsbCksdGhpcy5fY29uZmlnLmludGVydmFsJiYhdGhpcy5faXNQYXVzZWQmJih0aGlzLl9pbnRlcnZhbD1zZXRJbnRlcnZhbCgoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlP3RoaXMubmV4dFdoZW5WaXNpYmxlOnRoaXMubmV4dCkuYmluZCh0aGlzKSx0aGlzLl9jb25maWcuaW50ZXJ2YWwpKX0saC5wcm90b3R5cGUudG89ZnVuY3Rpb24oZSl7dmFyIG49dGhpczt0aGlzLl9hY3RpdmVFbGVtZW50PXQodGhpcy5fZWxlbWVudCkuZmluZCh2LkFDVElWRV9JVEVNKVswXTt2YXIgaT10aGlzLl9nZXRJdGVtSW5kZXgodGhpcy5fYWN0aXZlRWxlbWVudCk7aWYoIShlPnRoaXMuX2l0ZW1zLmxlbmd0aC0xfHxlPDApKXtpZih0aGlzLl9pc1NsaWRpbmcpcmV0dXJuIHZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUobS5TTElELGZ1bmN0aW9uKCl7cmV0dXJuIG4udG8oZSl9KTtpZihpPT09ZSlyZXR1cm4gdGhpcy5wYXVzZSgpLHZvaWQgdGhpcy5jeWNsZSgpO3ZhciBvPWU+aT9wLk5FWFQ6cC5QUkVWSU9VUzt0aGlzLl9zbGlkZShvLHRoaXMuX2l0ZW1zW2VdKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9mZihsKSx0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9pbnRlcnZhbD1udWxsLHRoaXMuX2lzUGF1c2VkPW51bGwsdGhpcy5faXNTbGlkaW5nPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2luZGljYXRvcnNFbGVtZW50PW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sXyxuKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZyksbn0saC5wcm90b3R5cGUuX2FkZEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9jb25maWcua2V5Ym9hcmQmJnQodGhpcy5fZWxlbWVudCkub24obS5LRVlET1dOLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9rZXlkb3duKHQpfSksXCJob3ZlclwiIT09dGhpcy5fY29uZmlnLnBhdXNlfHxcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50fHx0KHRoaXMuX2VsZW1lbnQpLm9uKG0uTU9VU0VFTlRFUixmdW5jdGlvbih0KXtyZXR1cm4gZS5wYXVzZSh0KX0pLm9uKG0uTU9VU0VMRUFWRSxmdW5jdGlvbih0KXtyZXR1cm4gZS5jeWNsZSh0KX0pfSxoLnByb3RvdHlwZS5fa2V5ZG93bj1mdW5jdGlvbih0KXtpZighL2lucHV0fHRleHRhcmVhL2kudGVzdCh0LnRhcmdldC50YWdOYW1lKSlzd2l0Y2godC53aGljaCl7Y2FzZSBkOnQucHJldmVudERlZmF1bHQoKSx0aGlzLnByZXYoKTticmVhaztjYXNlIGY6dC5wcmV2ZW50RGVmYXVsdCgpLHRoaXMubmV4dCgpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufX0saC5wcm90b3R5cGUuX2dldEl0ZW1JbmRleD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5faXRlbXM9dC5tYWtlQXJyYXkodChlKS5wYXJlbnQoKS5maW5kKHYuSVRFTSkpLHRoaXMuX2l0ZW1zLmluZGV4T2YoZSl9LGgucHJvdG90eXBlLl9nZXRJdGVtQnlEaXJlY3Rpb249ZnVuY3Rpb24odCxlKXt2YXIgbj10PT09cC5ORVhULGk9dD09PXAuUFJFVklPVVMsbz10aGlzLl9nZXRJdGVtSW5kZXgoZSkscj10aGlzLl9pdGVtcy5sZW5ndGgtMSxzPWkmJjA9PT1vfHxuJiZvPT09cjtpZihzJiYhdGhpcy5fY29uZmlnLndyYXApcmV0dXJuIGU7dmFyIGE9dD09PXAuUFJFVklPVVM/LTE6MSxsPShvK2EpJXRoaXMuX2l0ZW1zLmxlbmd0aDtyZXR1cm4gbD09PS0xP3RoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aC0xXTp0aGlzLl9pdGVtc1tsXX0saC5wcm90b3R5cGUuX3RyaWdnZXJTbGlkZUV2ZW50PWZ1bmN0aW9uKGUsbil7dmFyIGk9dC5FdmVudChtLlNMSURFLHtyZWxhdGVkVGFyZ2V0OmUsZGlyZWN0aW9uOm59KTtyZXR1cm4gdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLGl9LGgucHJvdG90eXBlLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50PWZ1bmN0aW9uKGUpe2lmKHRoaXMuX2luZGljYXRvcnNFbGVtZW50KXt0KHRoaXMuX2luZGljYXRvcnNFbGVtZW50KS5maW5kKHYuQUNUSVZFKS5yZW1vdmVDbGFzcyhFLkFDVElWRSk7dmFyIG49dGhpcy5faW5kaWNhdG9yc0VsZW1lbnQuY2hpbGRyZW5bdGhpcy5fZ2V0SXRlbUluZGV4KGUpXTtuJiZ0KG4pLmFkZENsYXNzKEUuQUNUSVZFKX19LGgucHJvdG90eXBlLl9zbGlkZT1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMsbz10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5BQ1RJVkVfSVRFTSlbMF0scz1ufHxvJiZ0aGlzLl9nZXRJdGVtQnlEaXJlY3Rpb24oZSxvKSxhPUJvb2xlYW4odGhpcy5faW50ZXJ2YWwpLGw9dm9pZCAwLGg9dm9pZCAwLGM9dm9pZCAwO2lmKGU9PT1wLk5FWFQ/KGw9RS5MRUZULGg9RS5ORVhULGM9cC5MRUZUKToobD1FLlJJR0hULGg9RS5QUkVWLGM9cC5SSUdIVCkscyYmdChzKS5oYXNDbGFzcyhFLkFDVElWRSkpcmV0dXJuIHZvaWQodGhpcy5faXNTbGlkaW5nPSExKTt2YXIgZD10aGlzLl90cmlnZ2VyU2xpZGVFdmVudChzLGMpO2lmKCFkLmlzRGVmYXVsdFByZXZlbnRlZCgpJiZvJiZzKXt0aGlzLl9pc1NsaWRpbmc9ITAsYSYmdGhpcy5wYXVzZSgpLHRoaXMuX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQocyk7dmFyIGY9dC5FdmVudChtLlNMSUQse3JlbGF0ZWRUYXJnZXQ6cyxkaXJlY3Rpb246Y30pO3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoRS5TTElERSk/KHQocykuYWRkQ2xhc3MoaCksci5yZWZsb3cocyksdChvKS5hZGRDbGFzcyhsKSx0KHMpLmFkZENsYXNzKGwpLHQobykub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24oKXt0KHMpLnJlbW92ZUNsYXNzKGwrXCIgXCIraCkuYWRkQ2xhc3MoRS5BQ1RJVkUpLHQobykucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUrXCIgXCIraCtcIiBcIitsKSxpLl9pc1NsaWRpbmc9ITEsc2V0VGltZW91dChmdW5jdGlvbigpe3JldHVybiB0KGkuX2VsZW1lbnQpLnRyaWdnZXIoZil9LDApfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSkpOih0KG8pLnJlbW92ZUNsYXNzKEUuQUNUSVZFKSx0KHMpLmFkZENsYXNzKEUuQUNUSVZFKSx0aGlzLl9pc1NsaWRpbmc9ITEsdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGYpKSxhJiZ0aGlzLmN5Y2xlKCl9fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPXQuZXh0ZW5kKHt9LF8sdCh0aGlzKS5kYXRhKCkpO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmdC5leHRlbmQobyxlKTt2YXIgcj1cInN0cmluZ1wiPT10eXBlb2YgZT9lOm8uc2xpZGU7aWYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJudW1iZXJcIj09dHlwZW9mIGUpbi50byhlKTtlbHNlIGlmKFwic3RyaW5nXCI9PXR5cGVvZiByKXtpZih2b2lkIDA9PT1uW3JdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytyKydcIicpO25bcl0oKX1lbHNlIG8uaW50ZXJ2YWwmJihuLnBhdXNlKCksbi5jeWNsZSgpKX0pfSxoLl9kYXRhQXBpQ2xpY2tIYW5kbGVyPWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKTtpZihuKXt2YXIgaT10KG4pWzBdO2lmKGkmJnQoaSkuaGFzQ2xhc3MoRS5DQVJPVVNFTCkpe3ZhciBvPXQuZXh0ZW5kKHt9LHQoaSkuZGF0YSgpLHQodGhpcykuZGF0YSgpKSxzPXRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b1wiKTtzJiYoby5pbnRlcnZhbD0hMSksaC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChpKSxvKSxzJiZ0KGkpLmRhdGEoYSkudG8ocyksZS5wcmV2ZW50RGVmYXVsdCgpfX19LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24obS5DTElDS19EQVRBX0FQSSx2LkRBVEFfU0xJREUsVC5fZGF0YUFwaUNsaWNrSGFuZGxlciksdCh3aW5kb3cpLm9uKG0uTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe3Qodi5EQVRBX1JJREUpLmVhY2goZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMpO1QuX2pRdWVyeUludGVyZmFjZS5jYWxsKGUsZS5kYXRhKCkpfSl9KSx0LmZuW2VdPVQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPVQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxULl9qUXVlcnlJbnRlcmZhY2V9LFR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjb2xsYXBzZVwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNvbGxhcHNlXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD17dG9nZ2xlOiEwLHBhcmVudDpcIlwifSxmPXt0b2dnbGU6XCJib29sZWFuXCIscGFyZW50Olwic3RyaW5nXCJ9LF89e1NIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxnPXtTSE9XOlwic2hvd1wiLENPTExBUFNFOlwiY29sbGFwc2VcIixDT0xMQVBTSU5HOlwiY29sbGFwc2luZ1wiLENPTExBUFNFRDpcImNvbGxhcHNlZFwifSxwPXtXSURUSDpcIndpZHRoXCIsSEVJR0hUOlwiaGVpZ2h0XCJ9LG09e0FDVElWRVM6XCIuY2FyZCA+IC5zaG93LCAuY2FyZCA+IC5jb2xsYXBzaW5nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJ30sRT1mdW5jdGlvbigpe2Z1bmN0aW9uIGwoZSxpKXtuKHRoaXMsbCksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3RyaWdnZXJBcnJheT10Lm1ha2VBcnJheSh0KCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycrZS5pZCsnXCJdLCcrKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnK2UuaWQrJ1wiXScpKSksdGhpcy5fcGFyZW50PXRoaXMuX2NvbmZpZy5wYXJlbnQ/dGhpcy5fZ2V0UGFyZW50KCk6bnVsbCx0aGlzLl9jb25maWcucGFyZW50fHx0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy5fZWxlbWVudCx0aGlzLl90cmlnZ2VyQXJyYXkpLHRoaXMuX2NvbmZpZy50b2dnbGUmJnRoaXMudG9nZ2xlKCl9cmV0dXJuIGwucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKT90aGlzLmhpZGUoKTp0aGlzLnNob3coKX0sbC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIkNvbGxhcHNlIGlzIHRyYW5zaXRpb25pbmdcIik7aWYoIXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuX3BhcmVudCYmKG49dC5tYWtlQXJyYXkodCh0aGlzLl9wYXJlbnQpLmZpbmQobS5BQ1RJVkVTKSksbi5sZW5ndGh8fChuPW51bGwpKSwhKG4mJihpPXQobikuZGF0YShhKSxpJiZpLl9pc1RyYW5zaXRpb25pbmcpKSl7dmFyIG89dC5FdmVudChfLlNIT1cpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihvKSwhby5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7biYmKGwuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJoaWRlXCIpLGl8fHQobikuZGF0YShhLG51bGwpKTt2YXIgcz10aGlzLl9nZXREaW1lbnNpb24oKTt0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0UpLmFkZENsYXNzKGcuQ09MTEFQU0lORyksdGhpcy5fZWxlbWVudC5zdHlsZVtzXT0wLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIGg9ZnVuY3Rpb24oKXt0KGUuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0lORykuYWRkQ2xhc3MoZy5DT0xMQVBTRSkuYWRkQ2xhc3MoZy5TSE9XKSxlLl9lbGVtZW50LnN0eWxlW3NdPVwiXCIsZS5zZXRUcmFuc2l0aW9uaW5nKCExKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIoXy5TSE9XTil9O2lmKCFyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpKXJldHVybiB2b2lkIGgoKTt2YXIgYz1zWzBdLnRvVXBwZXJDYXNlKCkrcy5zbGljZSgxKSxkPVwic2Nyb2xsXCIrYzt0KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELGgpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpLHRoaXMuX2VsZW1lbnQuc3R5bGVbc109dGhpcy5fZWxlbWVudFtkXStcInB4XCJ9fX19LGwucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJDb2xsYXBzZSBpcyB0cmFuc2l0aW9uaW5nXCIpO2lmKHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dC5FdmVudChfLkhJREUpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihuKSwhbi5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7dmFyIGk9dGhpcy5fZ2V0RGltZW5zaW9uKCksbz1pPT09cC5XSURUSD9cIm9mZnNldFdpZHRoXCI6XCJvZmZzZXRIZWlnaHRcIjt0aGlzLl9lbGVtZW50LnN0eWxlW2ldPXRoaXMuX2VsZW1lbnRbb10rXCJweFwiLHIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MoZy5DT0xMQVBTSU5HKS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFKS5yZW1vdmVDbGFzcyhnLlNIT1cpLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkuYWRkQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIHM9ZnVuY3Rpb24oKXtlLnNldFRyYW5zaXRpb25pbmcoITEpLHQoZS5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTSU5HKS5hZGRDbGFzcyhnLkNPTExBUFNFKS50cmlnZ2VyKF8uSElEREVOKX07cmV0dXJuIHRoaXMuX2VsZW1lbnQuc3R5bGVbaV09XCJcIixyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpP3ZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTp2b2lkIHMoKX19fSxsLnByb3RvdHlwZS5zZXRUcmFuc2l0aW9uaW5nPWZ1bmN0aW9uKHQpe3RoaXMuX2lzVHJhbnNpdGlvbmluZz10fSxsLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fcGFyZW50PW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX3RyaWdnZXJBcnJheT1udWxsLHRoaXMuX2lzVHJhbnNpdGlvbmluZz1udWxsfSxsLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LGQsbiksbi50b2dnbGU9Qm9vbGVhbihuLnRvZ2dsZSksci50eXBlQ2hlY2tDb25maWcoZSxuLGYpLG59LGwucHJvdG90eXBlLl9nZXREaW1lbnNpb249ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKHAuV0lEVEgpO3JldHVybiBlP3AuV0lEVEg6cC5IRUlHSFR9LGwucHJvdG90eXBlLl9nZXRQYXJlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dCh0aGlzLl9jb25maWcucGFyZW50KVswXSxpPSdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicrdGhpcy5fY29uZmlnLnBhcmVudCsnXCJdJztyZXR1cm4gdChuKS5maW5kKGkpLmVhY2goZnVuY3Rpb24odCxuKXtlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MobC5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQobiksW25dKX0pLG59LGwucHJvdG90eXBlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3M9ZnVuY3Rpb24oZSxuKXtpZihlKXt2YXIgaT10KGUpLmhhc0NsYXNzKGcuU0hPVyk7ZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsaSksbi5sZW5ndGgmJnQobikudG9nZ2xlQ2xhc3MoZy5DT0xMQVBTRUQsIWkpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsaSl9fSxsLl9nZXRUYXJnZXRGcm9tRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIG4/dChuKVswXTpudWxsfSxsLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcyksbz1uLmRhdGEoYSkscj10LmV4dGVuZCh7fSxkLG4uZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYoIW8mJnIudG9nZ2xlJiYvc2hvd3xoaWRlLy50ZXN0KGUpJiYoci50b2dnbGU9ITEpLG98fChvPW5ldyBsKHRoaXMsciksbi5kYXRhKGEsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1vW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO29bZV0oKX19KX0sbyhsLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX1dKSxsfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihfLkNMSUNLX0RBVEFfQVBJLG0uREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBuPUUuX2dldFRhcmdldEZyb21FbGVtZW50KHRoaXMpLGk9dChuKS5kYXRhKGEpLG89aT9cInRvZ2dsZVwiOnQodGhpcykuZGF0YSgpO0UuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksbyl9KSx0LmZuW2VdPUUuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPUUsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxFLl9qUXVlcnlJbnRlcmZhY2V9LEV9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJkcm9wZG93blwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLmRyb3Bkb3duXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0yNyx1PTM4LGQ9NDAsZj0zLF89e0hJREU6XCJoaWRlXCIrYSxISURERU46XCJoaWRkZW5cIithLFNIT1c6XCJzaG93XCIrYSxTSE9XTjpcInNob3duXCIrYSxDTElDSzpcImNsaWNrXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsLEZPQ1VTSU5fREFUQV9BUEk6XCJmb2N1c2luXCIrYStsLEtFWURPV05fREFUQV9BUEk6XCJrZXlkb3duXCIrYStsfSxnPXtCQUNLRFJPUDpcImRyb3Bkb3duLWJhY2tkcm9wXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLFNIT1c6XCJzaG93XCJ9LHA9e0JBQ0tEUk9QOlwiLmRyb3Bkb3duLWJhY2tkcm9wXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxGT1JNX0NISUxEOlwiLmRyb3Bkb3duIGZvcm1cIixST0xFX01FTlU6J1tyb2xlPVwibWVudVwiXScsUk9MRV9MSVNUQk9YOidbcm9sZT1cImxpc3Rib3hcIl0nLE5BVkJBUl9OQVY6XCIubmF2YmFyLW5hdlwiLFZJU0lCTEVfSVRFTVM6J1tyb2xlPVwibWVudVwiXSBsaTpub3QoLmRpc2FibGVkKSBhLCBbcm9sZT1cImxpc3Rib3hcIl0gbGk6bm90KC5kaXNhYmxlZCkgYSd9LG09ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXQsdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKX1yZXR1cm4gZS5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7aWYodGhpcy5kaXNhYmxlZHx8dCh0aGlzKS5oYXNDbGFzcyhnLkRJU0FCTEVEKSlyZXR1cm4hMTt2YXIgbj1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxpPXQobikuaGFzQ2xhc3MoZy5TSE9XKTtpZihlLl9jbGVhck1lbnVzKCksaSlyZXR1cm4hMTtpZihcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50JiYhdChuKS5jbG9zZXN0KHAuTkFWQkFSX05BVikubGVuZ3RoKXt2YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO28uY2xhc3NOYW1lPWcuQkFDS0RST1AsdChvKS5pbnNlcnRCZWZvcmUodGhpcyksdChvKS5vbihcImNsaWNrXCIsZS5fY2xlYXJNZW51cyl9dmFyIHI9e3JlbGF0ZWRUYXJnZXQ6dGhpc30scz10LkV2ZW50KF8uU0hPVyxyKTtyZXR1cm4gdChuKS50cmlnZ2VyKHMpLCFzLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYodGhpcy5mb2N1cygpLHRoaXMuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0KG4pLnRvZ2dsZUNsYXNzKGcuU0hPVyksdChuKS50cmlnZ2VyKHQuRXZlbnQoXy5TSE9XTixyKSksITEpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQscyksdCh0aGlzLl9lbGVtZW50KS5vZmYoYSksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9uKF8uQ0xJQ0ssdGhpcy50b2dnbGUpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShzKTtpZihpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PWlbbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7aVtuXS5jYWxsKHRoaXMpfX0pfSxlLl9jbGVhck1lbnVzPWZ1bmN0aW9uKG4pe2lmKCFufHxuLndoaWNoIT09Zil7dmFyIGk9dChwLkJBQ0tEUk9QKVswXTtpJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSk7Zm9yKHZhciBvPXQubWFrZUFycmF5KHQocC5EQVRBX1RPR0dMRSkpLHI9MDtyPG8ubGVuZ3RoO3IrKyl7dmFyIHM9ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQob1tyXSksYT17cmVsYXRlZFRhcmdldDpvW3JdfTtpZih0KHMpLmhhc0NsYXNzKGcuU0hPVykmJiEobiYmKFwiY2xpY2tcIj09PW4udHlwZSYmL2lucHV0fHRleHRhcmVhL2kudGVzdChuLnRhcmdldC50YWdOYW1lKXx8XCJmb2N1c2luXCI9PT1uLnR5cGUpJiZ0LmNvbnRhaW5zKHMsbi50YXJnZXQpKSl7dmFyIGw9dC5FdmVudChfLkhJREUsYSk7dChzKS50cmlnZ2VyKGwpLGwuaXNEZWZhdWx0UHJldmVudGVkKCl8fChvW3JdLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIixcImZhbHNlXCIpLHQocykucmVtb3ZlQ2xhc3MoZy5TSE9XKS50cmlnZ2VyKHQuRXZlbnQoXy5ISURERU4sYSkpKX19fX0sZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dm9pZCAwLGk9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBpJiYobj10KGkpWzBdKSxufHxlLnBhcmVudE5vZGV9LGUuX2RhdGFBcGlLZXlkb3duSGFuZGxlcj1mdW5jdGlvbihuKXtpZigvKDM4fDQwfDI3fDMyKS8udGVzdChuLndoaWNoKSYmIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3Qobi50YXJnZXQudGFnTmFtZSkmJihuLnByZXZlbnREZWZhdWx0KCksbi5zdG9wUHJvcGFnYXRpb24oKSwhdGhpcy5kaXNhYmxlZCYmIXQodGhpcykuaGFzQ2xhc3MoZy5ESVNBQkxFRCkpKXt2YXIgaT1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxvPXQoaSkuaGFzQ2xhc3MoZy5TSE9XKTtpZighbyYmbi53aGljaCE9PWN8fG8mJm4ud2hpY2g9PT1jKXtpZihuLndoaWNoPT09Yyl7dmFyIHI9dChpKS5maW5kKHAuREFUQV9UT0dHTEUpWzBdO3QocikudHJpZ2dlcihcImZvY3VzXCIpfXJldHVybiB2b2lkIHQodGhpcykudHJpZ2dlcihcImNsaWNrXCIpfXZhciBzPXQoaSkuZmluZChwLlZJU0lCTEVfSVRFTVMpLmdldCgpO2lmKHMubGVuZ3RoKXt2YXIgYT1zLmluZGV4T2Yobi50YXJnZXQpO24ud2hpY2g9PT11JiZhPjAmJmEtLSxuLndoaWNoPT09ZCYmYTxzLmxlbmd0aC0xJiZhKyssYTwwJiYoYT0wKSxzW2FdLmZvY3VzKCl9fX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9NRU5VLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9MSVNUQk9YLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5DTElDS19EQVRBX0FQSStcIiBcIitfLkZPQ1VTSU5fREFUQV9BUEksbS5fY2xlYXJNZW51cykub24oXy5DTElDS19EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0ucHJvdG90eXBlLnRvZ2dsZSkub24oXy5DTElDS19EQVRBX0FQSSxwLkZPUk1fQ0hJTEQsZnVuY3Rpb24odCl7dC5zdG9wUHJvcGFnYXRpb24oKX0pLHQuZm5bZV09bS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9bSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLG0uX2pRdWVyeUludGVyZmFjZX0sbX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cIm1vZGFsXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMubW9kYWxcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTMwMCxkPTE1MCxmPTI3LF89e2JhY2tkcm9wOiEwLGtleWJvYXJkOiEwLGZvY3VzOiEwLHNob3c6ITB9LGc9e2JhY2tkcm9wOlwiKGJvb2xlYW58c3RyaW5nKVwiLGtleWJvYXJkOlwiYm9vbGVhblwiLGZvY3VzOlwiYm9vbGVhblwiLHNob3c6XCJib29sZWFuXCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsUkVTSVpFOlwicmVzaXplXCIrbCxDTElDS19ESVNNSVNTOlwiY2xpY2suZGlzbWlzc1wiK2wsS0VZRE9XTl9ESVNNSVNTOlwia2V5ZG93bi5kaXNtaXNzXCIrbCxNT1VTRVVQX0RJU01JU1M6XCJtb3VzZXVwLmRpc21pc3NcIitsLE1PVVNFRE9XTl9ESVNNSVNTOlwibW91c2Vkb3duLmRpc21pc3NcIitsLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LG09e1NDUk9MTEJBUl9NRUFTVVJFUjpcIm1vZGFsLXNjcm9sbGJhci1tZWFzdXJlXCIsQkFDS0RST1A6XCJtb2RhbC1iYWNrZHJvcFwiLE9QRU46XCJtb2RhbC1vcGVuXCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtESUFMT0c6XCIubW9kYWwtZGlhbG9nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJyxEQVRBX0RJU01JU1M6J1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsRklYRURfQ09OVEVOVDpcIi5maXhlZC10b3AsIC5maXhlZC1ib3R0b20sIC5pcy1maXhlZCwgLnN0aWNreS10b3BcIn0sdj1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXtuKHRoaXMsaCksdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fZGlhbG9nPXQoZSkuZmluZChFLkRJQUxPRylbMF0sdGhpcy5fYmFja2Ryb3A9bnVsbCx0aGlzLl9pc1Nob3duPSExLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nPSExLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEsdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9MCx0aGlzLl9zY3JvbGxiYXJXaWR0aD0wfXJldHVybiBoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2lzU2hvd24/dGhpcy5oaWRlKCk6dGhpcy5zaG93KHQpfSxoLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpJiYodGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwKTt2YXIgaT10LkV2ZW50KHAuU0hPVyx7cmVsYXRlZFRhcmdldDplfSk7dCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLHRoaXMuX2lzU2hvd258fGkuaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0aGlzLl9pc1Nob3duPSEwLHRoaXMuX2NoZWNrU2Nyb2xsYmFyKCksdGhpcy5fc2V0U2Nyb2xsYmFyKCksdChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhtLk9QRU4pLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxFLkRBVEFfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5oaWRlKHQpfSksdCh0aGlzLl9kaWFsb2cpLm9uKHAuTU9VU0VET1dOX0RJU01JU1MsZnVuY3Rpb24oKXt0KG4uX2VsZW1lbnQpLm9uZShwLk1PVVNFVVBfRElTTUlTUyxmdW5jdGlvbihlKXt0KGUudGFyZ2V0KS5pcyhuLl9lbGVtZW50KSYmKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITApfSl9KSx0aGlzLl9zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtyZXR1cm4gbi5fc2hvd0VsZW1lbnQoZSl9KSl9LGgucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztpZihlJiZlLnByZXZlbnREZWZhdWx0KCksdGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7dmFyIGk9ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpO2kmJih0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITApO3ZhciBvPXQuRXZlbnQocC5ISURFKTt0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobyksdGhpcy5faXNTaG93biYmIW8uaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLl9pc1Nob3duPSExLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KGRvY3VtZW50KS5vZmYocC5GT0NVU0lOKSx0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKG0uU0hPVyksdCh0aGlzLl9lbGVtZW50KS5vZmYocC5DTElDS19ESVNNSVNTKSx0KHRoaXMuX2RpYWxvZykub2ZmKHAuTU9VU0VET1dOX0RJU01JU1MpLGk/dCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbih0KXtyZXR1cm4gbi5faGlkZU1vZGFsKHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6dGhpcy5faGlkZU1vZGFsKCkpfSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdCh3aW5kb3csZG9jdW1lbnQsdGhpcy5fZWxlbWVudCx0aGlzLl9iYWNrZHJvcCkub2ZmKGwpLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9kaWFsb2c9bnVsbCx0aGlzLl9iYWNrZHJvcD1udWxsLHRoaXMuX2lzU2hvd249bnVsbCx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1udWxsLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9bnVsbCx0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPW51bGwsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxfLG4pLHIudHlwZUNoZWNrQ29uZmlnKGUsbixnKSxufSxoLnByb3RvdHlwZS5fc2hvd0VsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKTt0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUmJnRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFfHxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnQpLHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheT1cImJsb2NrXCIsdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSx0aGlzLl9lbGVtZW50LnNjcm9sbFRvcD0wLGkmJnIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MobS5TSE9XKSx0aGlzLl9jb25maWcuZm9jdXMmJnRoaXMuX2VuZm9yY2VGb2N1cygpO3ZhciBvPXQuRXZlbnQocC5TSE9XTix7cmVsYXRlZFRhcmdldDplfSkscz1mdW5jdGlvbigpe24uX2NvbmZpZy5mb2N1cyYmbi5fZWxlbWVudC5mb2N1cygpLG4uX2lzVHJhbnNpdGlvbmluZz0hMSx0KG4uX2VsZW1lbnQpLnRyaWdnZXIobyl9O2k/dCh0aGlzLl9kaWFsb2cpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnMoKX0saC5wcm90b3R5cGUuX2VuZm9yY2VGb2N1cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dChkb2N1bWVudCkub2ZmKHAuRk9DVVNJTikub24ocC5GT0NVU0lOLGZ1bmN0aW9uKG4pe2RvY3VtZW50PT09bi50YXJnZXR8fGUuX2VsZW1lbnQ9PT1uLnRhcmdldHx8dChlLl9lbGVtZW50KS5oYXMobi50YXJnZXQpLmxlbmd0aHx8ZS5fZWxlbWVudC5mb2N1cygpfSl9LGgucHJvdG90eXBlLl9zZXRFc2NhcGVFdmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5faXNTaG93biYmdGhpcy5fY29uZmlnLmtleWJvYXJkP3QodGhpcy5fZWxlbWVudCkub24ocC5LRVlET1dOX0RJU01JU1MsZnVuY3Rpb24odCl7dC53aGljaD09PWYmJmUuaGlkZSgpfSk6dGhpcy5faXNTaG93bnx8dCh0aGlzLl9lbGVtZW50KS5vZmYocC5LRVlET1dOX0RJU01JU1MpfSxoLnByb3RvdHlwZS5fc2V0UmVzaXplRXZlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2lzU2hvd24/dCh3aW5kb3cpLm9uKHAuUkVTSVpFLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9oYW5kbGVVcGRhdGUodCl9KTp0KHdpbmRvdykub2ZmKHAuUkVTSVpFKX0saC5wcm90b3R5cGUuX2hpZGVNb2RhbD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbigpe3QoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MobS5PUEVOKSxlLl9yZXNldEFkanVzdG1lbnRzKCksZS5fcmVzZXRTY3JvbGxiYXIoKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIocC5ISURERU4pfSl9LGgucHJvdG90eXBlLl9yZW1vdmVCYWNrZHJvcD1mdW5jdGlvbigpe3RoaXMuX2JhY2tkcm9wJiYodCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlKCksdGhpcy5fYmFja2Ryb3A9bnVsbCl9LGgucHJvdG90eXBlLl9zaG93QmFja2Ryb3A9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKT9tLkZBREU6XCJcIjtpZih0aGlzLl9pc1Nob3duJiZ0aGlzLl9jb25maWcuYmFja2Ryb3Ape3ZhciBvPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJmk7aWYodGhpcy5fYmFja2Ryb3A9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLl9iYWNrZHJvcC5jbGFzc05hbWU9bS5CQUNLRFJPUCxpJiZ0KHRoaXMuX2JhY2tkcm9wKS5hZGRDbGFzcyhpKSx0KHRoaXMuX2JhY2tkcm9wKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5faWdub3JlQmFja2Ryb3BDbGljaz92b2lkKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEpOnZvaWQodC50YXJnZXQ9PT10LmN1cnJlbnRUYXJnZXQmJihcInN0YXRpY1wiPT09bi5fY29uZmlnLmJhY2tkcm9wP24uX2VsZW1lbnQuZm9jdXMoKTpuLmhpZGUoKSkpfSksbyYmci5yZWZsb3codGhpcy5fYmFja2Ryb3ApLHQodGhpcy5fYmFja2Ryb3ApLmFkZENsYXNzKG0uU0hPVyksIWUpcmV0dXJuO2lmKCFvKXJldHVybiB2b2lkIGUoKTt0KHRoaXMuX2JhY2tkcm9wKS5vbmUoci5UUkFOU0lUSU9OX0VORCxlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkKX1lbHNlIGlmKCF0aGlzLl9pc1Nob3duJiZ0aGlzLl9iYWNrZHJvcCl7dCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlQ2xhc3MobS5TSE9XKTt2YXIgcz1mdW5jdGlvbigpe24uX3JlbW92ZUJhY2tkcm9wKCksZSYmZSgpfTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk/dCh0aGlzLl9iYWNrZHJvcCkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoZCk6cygpfWVsc2UgZSYmZSgpfSxoLnByb3RvdHlwZS5faGFuZGxlVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5fYWRqdXN0RGlhbG9nKCl9LGgucHJvdG90eXBlLl9hZGp1c3REaWFsb2c9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodD5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyF0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmdCYmKHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9dGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKSx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmIXQmJih0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD10aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpfSxoLnByb3RvdHlwZS5fcmVzZXRBZGp1c3RtZW50cz1mdW5jdGlvbigpe3RoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9XCJcIix0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD1cIlwifSxoLnByb3RvdHlwZS5fY2hlY2tTY3JvbGxiYXI9ZnVuY3Rpb24oKXt0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoPHdpbmRvdy5pbm5lcldpZHRoLHRoaXMuX3Njcm9sbGJhcldpZHRoPXRoaXMuX2dldFNjcm9sbGJhcldpZHRoKCl9LGgucHJvdG90eXBlLl9zZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgZT1wYXJzZUludCh0KEUuRklYRURfQ09OVEVOVCkuY3NzKFwicGFkZGluZy1yaWdodFwiKXx8MCwxMCk7dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz1kb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodHx8XCJcIix0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmKGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0PWUrdGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKX0saC5wcm90b3R5cGUuX3Jlc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQ9dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZ30saC5wcm90b3R5cGUuX2dldFNjcm9sbGJhcldpZHRoPWZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0LmNsYXNzTmFtZT1tLlNDUk9MTEJBUl9NRUFTVVJFUixkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQpO3ZhciBlPXQub2Zmc2V0V2lkdGgtdC5jbGllbnRXaWR0aDtyZXR1cm4gZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0KSxlfSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSxuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG89dCh0aGlzKS5kYXRhKGEpLHI9dC5leHRlbmQoe30saC5EZWZhdWx0LHQodGhpcykuZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYob3x8KG89bmV3IGgodGhpcyxyKSx0KHRoaXMpLmRhdGEoYSxvKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW9bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7b1tlXShuKX1lbHNlIHIuc2hvdyYmby5zaG93KG4pfSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24ocC5DTElDS19EQVRBX0FQSSxFLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT12b2lkIDAsbz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7byYmKGk9dChvKVswXSk7dmFyIHM9dChpKS5kYXRhKGEpP1widG9nZ2xlXCI6dC5leHRlbmQoe30sdChpKS5kYXRhKCksdCh0aGlzKS5kYXRhKCkpO1wiQVwiIT09dGhpcy50YWdOYW1lJiZcIkFSRUFcIiE9PXRoaXMudGFnTmFtZXx8ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBsPXQoaSkub25lKHAuU0hPVyxmdW5jdGlvbihlKXtlLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxsLm9uZShwLkhJRERFTixmdW5jdGlvbigpe3QobikuaXMoXCI6dmlzaWJsZVwiKSYmbi5mb2N1cygpfSl9KTt2Ll9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KGkpLHMsdGhpcyl9KSx0LmZuW2VdPXYuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPXYsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09Yyx2Ll9qUXVlcnlJbnRlcmZhY2V9LHZ9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJzY3JvbGxzcHlcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5zY3JvbGxzcHlcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PXtvZmZzZXQ6MTAsbWV0aG9kOlwiYXV0b1wiLHRhcmdldDpcIlwifSxkPXtvZmZzZXQ6XCJudW1iZXJcIixtZXRob2Q6XCJzdHJpbmdcIix0YXJnZXQ6XCIoc3RyaW5nfGVsZW1lbnQpXCJ9LGY9e0FDVElWQVRFOlwiYWN0aXZhdGVcIitsLFNDUk9MTDpcInNjcm9sbFwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2h9LF89e0RST1BET1dOX0lURU06XCJkcm9wZG93bi1pdGVtXCIsRFJPUERPV05fTUVOVTpcImRyb3Bkb3duLW1lbnVcIixOQVZfTElOSzpcIm5hdi1saW5rXCIsTkFWOlwibmF2XCIsQUNUSVZFOlwiYWN0aXZlXCJ9LGc9e0RBVEFfU1BZOidbZGF0YS1zcHk9XCJzY3JvbGxcIl0nLEFDVElWRTpcIi5hY3RpdmVcIixMSVNUX0lURU06XCIubGlzdC1pdGVtXCIsTEk6XCJsaVwiLExJX0RST1BET1dOOlwibGkuZHJvcGRvd25cIixOQVZfTElOS1M6XCIubmF2LWxpbmtcIixEUk9QRE9XTjpcIi5kcm9wZG93blwiLERST1BET1dOX0lURU1TOlwiLmRyb3Bkb3duLWl0ZW1cIixEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCJ9LHA9e09GRlNFVDpcIm9mZnNldFwiLFBPU0lUSU9OOlwicG9zaXRpb25cIn0sbT1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXt2YXIgbz10aGlzO24odGhpcyxoKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fc2Nyb2xsRWxlbWVudD1cIkJPRFlcIj09PWUudGFnTmFtZT93aW5kb3c6ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3NlbGVjdG9yPXRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5OQVZfTElOS1MrXCIsXCIrKHRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5EUk9QRE9XTl9JVEVNUyksdGhpcy5fb2Zmc2V0cz1bXSx0aGlzLl90YXJnZXRzPVtdLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD0wLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub24oZi5TQ1JPTEwsZnVuY3Rpb24odCl7cmV0dXJuIG8uX3Byb2Nlc3ModCl9KSx0aGlzLnJlZnJlc2goKSx0aGlzLl9wcm9jZXNzKCl9cmV0dXJuIGgucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5fc2Nyb2xsRWxlbWVudCE9PXRoaXMuX3Njcm9sbEVsZW1lbnQud2luZG93P3AuUE9TSVRJT046cC5PRkZTRVQsaT1cImF1dG9cIj09PXRoaXMuX2NvbmZpZy5tZXRob2Q/bjp0aGlzLl9jb25maWcubWV0aG9kLG89aT09PXAuUE9TSVRJT04/dGhpcy5fZ2V0U2Nyb2xsVG9wKCk6MDt0aGlzLl9vZmZzZXRzPVtdLHRoaXMuX3RhcmdldHM9W10sdGhpcy5fc2Nyb2xsSGVpZ2h0PXRoaXMuX2dldFNjcm9sbEhlaWdodCgpO3ZhciBzPXQubWFrZUFycmF5KHQodGhpcy5fc2VsZWN0b3IpKTtzLm1hcChmdW5jdGlvbihlKXt2YXIgbj12b2lkIDAscz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIHMmJihuPXQocylbMF0pLG4mJihuLm9mZnNldFdpZHRofHxuLm9mZnNldEhlaWdodCk/W3QobilbaV0oKS50b3ArbyxzXTpudWxsfSkuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiB0fSkuc29ydChmdW5jdGlvbih0LGUpe3JldHVybiB0WzBdLWVbMF19KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UuX29mZnNldHMucHVzaCh0WzBdKSxlLl90YXJnZXRzLnB1c2godFsxXSl9KX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub2ZmKGwpLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9zY3JvbGxFbGVtZW50PW51bGwsdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fc2VsZWN0b3I9bnVsbCx0aGlzLl9vZmZzZXRzPW51bGwsdGhpcy5fdGFyZ2V0cz1udWxsLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe2lmKG49dC5leHRlbmQoe30sdSxuKSxcInN0cmluZ1wiIT10eXBlb2Ygbi50YXJnZXQpe3ZhciBpPXQobi50YXJnZXQpLmF0dHIoXCJpZFwiKTtpfHwoaT1yLmdldFVJRChlKSx0KG4udGFyZ2V0KS5hdHRyKFwiaWRcIixpKSksbi50YXJnZXQ9XCIjXCIraX1yZXR1cm4gci50eXBlQ2hlY2tDb25maWcoZSxuLGQpLG59LGgucHJvdG90eXBlLl9nZXRTY3JvbGxUb3A9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudD09PXdpbmRvdz90aGlzLl9zY3JvbGxFbGVtZW50LnBhZ2VZT2Zmc2V0OnRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsVG9wfSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsSGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsSGVpZ2h0fHxNYXRoLm1heChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KX0saC5wcm90b3R5cGUuX2dldE9mZnNldEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50PT09d2luZG93P3dpbmRvdy5pbm5lckhlaWdodDp0aGlzLl9zY3JvbGxFbGVtZW50Lm9mZnNldEhlaWdodH0saC5wcm90b3R5cGUuX3Byb2Nlc3M9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9nZXRTY3JvbGxUb3AoKSt0aGlzLl9jb25maWcub2Zmc2V0LGU9dGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KCksbj10aGlzLl9jb25maWcub2Zmc2V0K2UtdGhpcy5fZ2V0T2Zmc2V0SGVpZ2h0KCk7aWYodGhpcy5fc2Nyb2xsSGVpZ2h0IT09ZSYmdGhpcy5yZWZyZXNoKCksdD49bil7dmFyIGk9dGhpcy5fdGFyZ2V0c1t0aGlzLl90YXJnZXRzLmxlbmd0aC0xXTtyZXR1cm4gdm9pZCh0aGlzLl9hY3RpdmVUYXJnZXQhPT1pJiZ0aGlzLl9hY3RpdmF0ZShpKSl9aWYodGhpcy5fYWN0aXZlVGFyZ2V0JiZ0PHRoaXMuX29mZnNldHNbMF0mJnRoaXMuX29mZnNldHNbMF0+MClyZXR1cm4gdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdm9pZCB0aGlzLl9jbGVhcigpO2Zvcih2YXIgbz10aGlzLl9vZmZzZXRzLmxlbmd0aDtvLS07KXt2YXIgcj10aGlzLl9hY3RpdmVUYXJnZXQhPT10aGlzLl90YXJnZXRzW29dJiZ0Pj10aGlzLl9vZmZzZXRzW29dJiYodm9pZCAwPT09dGhpcy5fb2Zmc2V0c1tvKzFdfHx0PHRoaXMuX29mZnNldHNbbysxXSk7ciYmdGhpcy5fYWN0aXZhdGUodGhpcy5fdGFyZ2V0c1tvXSl9fSxoLnByb3RvdHlwZS5fYWN0aXZhdGU9ZnVuY3Rpb24oZSl7dGhpcy5fYWN0aXZlVGFyZ2V0PWUsdGhpcy5fY2xlYXIoKTt2YXIgbj10aGlzLl9zZWxlY3Rvci5zcGxpdChcIixcIik7bj1uLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdCsnW2RhdGEtdGFyZ2V0PVwiJytlKydcIl0sJysodCsnW2hyZWY9XCInK2UrJ1wiXScpfSk7dmFyIGk9dChuLmpvaW4oXCIsXCIpKTtpLmhhc0NsYXNzKF8uRFJPUERPV05fSVRFTSk/KGkuY2xvc2VzdChnLkRST1BET1dOKS5maW5kKGcuRFJPUERPV05fVE9HR0xFKS5hZGRDbGFzcyhfLkFDVElWRSksaS5hZGRDbGFzcyhfLkFDVElWRSkpOmkucGFyZW50cyhnLkxJKS5maW5kKFwiPiBcIitnLk5BVl9MSU5LUykuYWRkQ2xhc3MoXy5BQ1RJVkUpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkudHJpZ2dlcihmLkFDVElWQVRFLHtyZWxhdGVkVGFyZ2V0OmV9KX0saC5wcm90b3R5cGUuX2NsZWFyPWZ1bmN0aW9uKCl7dCh0aGlzLl9zZWxlY3RvcikuZmlsdGVyKGcuQUNUSVZFKS5yZW1vdmVDbGFzcyhfLkFDVElWRSl9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlO1xyXG5pZihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09bltlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtuW2VdKCl9fSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdX19XSksaH0oKTtyZXR1cm4gdCh3aW5kb3cpLm9uKGYuTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe2Zvcih2YXIgZT10Lm1ha2VBcnJheSh0KGcuREFUQV9TUFkpKSxuPWUubGVuZ3RoO24tLTspe3ZhciBpPXQoZVtuXSk7bS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoaSxpLmRhdGEoKSl9fSksdC5mbltlXT1tLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1tLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwidGFiXCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMudGFiXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0xNTAsdT17SElERTpcImhpZGVcIithLEhJRERFTjpcImhpZGRlblwiK2EsU0hPVzpcInNob3dcIithLFNIT1dOOlwic2hvd25cIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGQ9e0RST1BET1dOX01FTlU6XCJkcm9wZG93bi1tZW51XCIsQUNUSVZFOlwiYWN0aXZlXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sZj17QTpcImFcIixMSTpcImxpXCIsRFJPUERPV046XCIuZHJvcGRvd25cIixMSVNUOlwidWw6bm90KC5kcm9wZG93bi1tZW51KSwgb2w6bm90KC5kcm9wZG93bi1tZW51KSwgbmF2Om5vdCguZHJvcGRvd24tbWVudSlcIixGQURFX0NISUxEOlwiPiAubmF2LWl0ZW0gLmZhZGUsID4gLmZhZGVcIixBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0NISUxEOlwiPiAubmF2LWl0ZW0gPiAuYWN0aXZlLCA+IC5hY3RpdmVcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwidGFiXCJdLCBbZGF0YS10b2dnbGU9XCJwaWxsXCJdJyxEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCIsRFJPUERPV05fQUNUSVZFX0NISUxEOlwiPiAuZHJvcGRvd24tbWVudSAuYWN0aXZlXCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKCEodGhpcy5fZWxlbWVudC5wYXJlbnROb2RlJiZ0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhkLkFDVElWRSl8fHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZC5ESVNBQkxFRCkpKXt2YXIgbj12b2lkIDAsaT12b2lkIDAsbz10KHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoZi5MSVNUKVswXSxzPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtvJiYoaT10Lm1ha2VBcnJheSh0KG8pLmZpbmQoZi5BQ1RJVkUpKSxpPWlbaS5sZW5ndGgtMV0pO3ZhciBhPXQuRXZlbnQodS5ISURFLHtyZWxhdGVkVGFyZ2V0OnRoaXMuX2VsZW1lbnR9KSxsPXQuRXZlbnQodS5TSE9XLHtyZWxhdGVkVGFyZ2V0Oml9KTtpZihpJiZ0KGkpLnRyaWdnZXIoYSksdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGwpLCFsLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYhYS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7cyYmKG49dChzKVswXSksdGhpcy5fYWN0aXZhdGUodGhpcy5fZWxlbWVudCxvKTt2YXIgaD1mdW5jdGlvbigpe3ZhciBuPXQuRXZlbnQodS5ISURERU4se3JlbGF0ZWRUYXJnZXQ6ZS5fZWxlbWVudH0pLG89dC5FdmVudCh1LlNIT1dOLHtyZWxhdGVkVGFyZ2V0Oml9KTt0KGkpLnRyaWdnZXIobiksdChlLl9lbGVtZW50KS50cmlnZ2VyKG8pfTtuP3RoaXMuX2FjdGl2YXRlKG4sbi5wYXJlbnROb2RlLGgpOmgoKX19fSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50LHMpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2FjdGl2YXRlPWZ1bmN0aW9uKGUsbixpKXt2YXIgbz10aGlzLHM9dChuKS5maW5kKGYuQUNUSVZFX0NISUxEKVswXSxhPWkmJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihzJiZ0KHMpLmhhc0NsYXNzKGQuRkFERSl8fEJvb2xlYW4odChuKS5maW5kKGYuRkFERV9DSElMRClbMF0pKSxsPWZ1bmN0aW9uKCl7cmV0dXJuIG8uX3RyYW5zaXRpb25Db21wbGV0ZShlLHMsYSxpKX07cyYmYT90KHMpLm9uZShyLlRSQU5TSVRJT05fRU5ELGwpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpOmwoKSxzJiZ0KHMpLnJlbW92ZUNsYXNzKGQuU0hPVyl9LGUucHJvdG90eXBlLl90cmFuc2l0aW9uQ29tcGxldGU9ZnVuY3Rpb24oZSxuLGksbyl7aWYobil7dChuKS5yZW1vdmVDbGFzcyhkLkFDVElWRSk7dmFyIHM9dChuLnBhcmVudE5vZGUpLmZpbmQoZi5EUk9QRE9XTl9BQ1RJVkVfQ0hJTEQpWzBdO3MmJnQocykucmVtb3ZlQ2xhc3MoZC5BQ1RJVkUpLG4uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKX1pZih0KGUpLmFkZENsYXNzKGQuQUNUSVZFKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksaT8oci5yZWZsb3coZSksdChlKS5hZGRDbGFzcyhkLlNIT1cpKTp0KGUpLnJlbW92ZUNsYXNzKGQuRkFERSksZS5wYXJlbnROb2RlJiZ0KGUucGFyZW50Tm9kZSkuaGFzQ2xhc3MoZC5EUk9QRE9XTl9NRU5VKSl7dmFyIGE9dChlKS5jbG9zZXN0KGYuRFJPUERPV04pWzBdO2EmJnQoYSkuZmluZChmLkRST1BET1dOX1RPR0dMRSkuYWRkQ2xhc3MoZC5BQ1RJVkUpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKX1vJiZvKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtpZihvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PW9bbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7b1tuXSgpfX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxmLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKSxfLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KHRoaXMpLFwic2hvd1wiKX0pLHQuZm5bZV09Xy5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9Xyx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLF8uX2pRdWVyeUludGVyZmFjZX0sX30oalF1ZXJ5KSxmdW5jdGlvbih0KXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgVGV0aGVyKXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCB0b29sdGlwcyByZXF1aXJlIFRldGhlciAoaHR0cDovL3RldGhlci5pby8pXCIpO3ZhciBlPVwidG9vbHRpcFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLnRvb2x0aXBcIixsPVwiLlwiK2EsaD10LmZuW2VdLGM9MTUwLHU9XCJicy10ZXRoZXJcIixkPXthbmltYXRpb246ITAsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsdHJpZ2dlcjpcImhvdmVyIGZvY3VzXCIsdGl0bGU6XCJcIixkZWxheTowLGh0bWw6ITEsc2VsZWN0b3I6ITEscGxhY2VtZW50OlwidG9wXCIsb2Zmc2V0OlwiMCAwXCIsY29uc3RyYWludHM6W10sY29udGFpbmVyOiExfSxmPXthbmltYXRpb246XCJib29sZWFuXCIsdGVtcGxhdGU6XCJzdHJpbmdcIix0aXRsZTpcIihzdHJpbmd8ZWxlbWVudHxmdW5jdGlvbilcIix0cmlnZ2VyOlwic3RyaW5nXCIsZGVsYXk6XCIobnVtYmVyfG9iamVjdClcIixodG1sOlwiYm9vbGVhblwiLHNlbGVjdG9yOlwiKHN0cmluZ3xib29sZWFuKVwiLHBsYWNlbWVudDpcIihzdHJpbmd8ZnVuY3Rpb24pXCIsb2Zmc2V0Olwic3RyaW5nXCIsY29uc3RyYWludHM6XCJhcnJheVwiLGNvbnRhaW5lcjpcIihzdHJpbmd8ZWxlbWVudHxib29sZWFuKVwifSxfPXtUT1A6XCJib3R0b20gY2VudGVyXCIsUklHSFQ6XCJtaWRkbGUgbGVmdFwiLEJPVFRPTTpcInRvcCBjZW50ZXJcIixMRUZUOlwibWlkZGxlIHJpZ2h0XCJ9LGc9e1NIT1c6XCJzaG93XCIsT1VUOlwib3V0XCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxJTlNFUlRFRDpcImluc2VydGVkXCIrbCxDTElDSzpcImNsaWNrXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsRk9DVVNPVVQ6XCJmb2N1c291dFwiK2wsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitsLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrbH0sbT17RkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtUT09MVElQOlwiLnRvb2x0aXBcIixUT09MVElQX0lOTkVSOlwiLnRvb2x0aXAtaW5uZXJcIn0sdj17ZWxlbWVudDohMSxlbmFibGVkOiExfSxUPXtIT1ZFUjpcImhvdmVyXCIsRk9DVVM6XCJmb2N1c1wiLENMSUNLOlwiY2xpY2tcIixNQU5VQUw6XCJtYW51YWxcIn0sST1mdW5jdGlvbigpe2Z1bmN0aW9uIGgodCxlKXtuKHRoaXMsaCksdGhpcy5faXNFbmFibGVkPSEwLHRoaXMuX3RpbWVvdXQ9MCx0aGlzLl9ob3ZlclN0YXRlPVwiXCIsdGhpcy5fYWN0aXZlVHJpZ2dlcj17fSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fdGV0aGVyPW51bGwsdGhpcy5lbGVtZW50PXQsdGhpcy5jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGUpLHRoaXMudGlwPW51bGwsdGhpcy5fc2V0TGlzdGVuZXJzKCl9cmV0dXJuIGgucHJvdG90eXBlLmVuYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMH0saC5wcm90b3R5cGUuZGlzYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMX0saC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZD1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hdGhpcy5faXNFbmFibGVkfSxoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIG49dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSxpPXQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKG4pO2l8fChpPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShuLGkpKSxpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrPSFpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrLGkuX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKT9pLl9lbnRlcihudWxsLGkpOmkuX2xlYXZlKG51bGwsaSl9ZWxzZXtpZih0KHRoaXMuZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpKXJldHVybiB2b2lkIHRoaXMuX2xlYXZlKG51bGwsdGhpcyk7dGhpcy5fZW50ZXIobnVsbCx0aGlzKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCksdGhpcy5jbGVhbnVwVGV0aGVyKCksdC5yZW1vdmVEYXRhKHRoaXMuZWxlbWVudCx0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZKSx0KHRoaXMuZWxlbWVudCkub2ZmKHRoaXMuY29uc3RydWN0b3IuRVZFTlRfS0VZKSx0KHRoaXMuZWxlbWVudCkuY2xvc2VzdChcIi5tb2RhbFwiKS5vZmYoXCJoaWRlLmJzLm1vZGFsXCIpLHRoaXMudGlwJiZ0KHRoaXMudGlwKS5yZW1vdmUoKSx0aGlzLl9pc0VuYWJsZWQ9bnVsbCx0aGlzLl90aW1lb3V0PW51bGwsdGhpcy5faG92ZXJTdGF0ZT1udWxsLHRoaXMuX2FjdGl2ZVRyaWdnZXI9bnVsbCx0aGlzLl90ZXRoZXI9bnVsbCx0aGlzLmVsZW1lbnQ9bnVsbCx0aGlzLmNvbmZpZz1udWxsLHRoaXMudGlwPW51bGx9LGgucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKFwibm9uZVwiPT09dCh0aGlzLmVsZW1lbnQpLmNzcyhcImRpc3BsYXlcIikpdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIHVzZSBzaG93IG9uIHZpc2libGUgZWxlbWVudHNcIik7dmFyIG49dC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1cpO2lmKHRoaXMuaXNXaXRoQ29udGVudCgpJiZ0aGlzLl9pc0VuYWJsZWQpe2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJUb29sdGlwIGlzIHRyYW5zaXRpb25pbmdcIik7dCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIobik7dmFyIGk9dC5jb250YWlucyh0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsdGhpcy5lbGVtZW50KTtpZihuLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwhaSlyZXR1cm47dmFyIG89dGhpcy5nZXRUaXBFbGVtZW50KCkscz1yLmdldFVJRCh0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO28uc2V0QXR0cmlidXRlKFwiaWRcIixzKSx0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLHMpLHRoaXMuc2V0Q29udGVudCgpLHRoaXMuY29uZmlnLmFuaW1hdGlvbiYmdChvKS5hZGRDbGFzcyhtLkZBREUpO3ZhciBhPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLnBsYWNlbWVudD90aGlzLmNvbmZpZy5wbGFjZW1lbnQuY2FsbCh0aGlzLG8sdGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy5wbGFjZW1lbnQsbD10aGlzLl9nZXRBdHRhY2htZW50KGEpLGM9dGhpcy5jb25maWcuY29udGFpbmVyPT09ITE/ZG9jdW1lbnQuYm9keTp0KHRoaXMuY29uZmlnLmNvbnRhaW5lcik7dChvKS5kYXRhKHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVksdGhpcykuYXBwZW5kVG8oYyksdCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5JTlNFUlRFRCksdGhpcy5fdGV0aGVyPW5ldyBUZXRoZXIoe2F0dGFjaG1lbnQ6bCxlbGVtZW50Om8sdGFyZ2V0OnRoaXMuZWxlbWVudCxjbGFzc2VzOnYsY2xhc3NQcmVmaXg6dSxvZmZzZXQ6dGhpcy5jb25maWcub2Zmc2V0LGNvbnN0cmFpbnRzOnRoaXMuY29uZmlnLmNvbnN0cmFpbnRzLGFkZFRhcmdldENsYXNzZXM6ITF9KSxyLnJlZmxvdyhvKSx0aGlzLl90ZXRoZXIucG9zaXRpb24oKSx0KG8pLmFkZENsYXNzKG0uU0hPVyk7dmFyIGQ9ZnVuY3Rpb24oKXt2YXIgbj1lLl9ob3ZlclN0YXRlO2UuX2hvdmVyU3RhdGU9bnVsbCxlLl9pc1RyYW5zaXRpb25pbmc9ITEsdChlLmVsZW1lbnQpLnRyaWdnZXIoZS5jb25zdHJ1Y3Rvci5FdmVudC5TSE9XTiksbj09PWcuT1VUJiZlLl9sZWF2ZShudWxsLGUpfTtpZihyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMudGlwKS5oYXNDbGFzcyhtLkZBREUpKXJldHVybiB0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITAsdm9pZCB0KHRoaXMudGlwKS5vbmUoci5UUkFOU0lUSU9OX0VORCxkKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChoLl9UUkFOU0lUSU9OX0RVUkFUSU9OKTtkKCl9fSxoLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT10aGlzLmdldFRpcEVsZW1lbnQoKSxvPXQuRXZlbnQodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5ISURFKTtpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiVG9vbHRpcCBpcyB0cmFuc2l0aW9uaW5nXCIpO3ZhciBzPWZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZSE9PWcuU0hPVyYmaS5wYXJlbnROb2RlJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSksbi5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiksdChuLmVsZW1lbnQpLnRyaWdnZXIobi5jb25zdHJ1Y3Rvci5FdmVudC5ISURERU4pLG4uX2lzVHJhbnNpdGlvbmluZz0hMSxuLmNsZWFudXBUZXRoZXIoKSxlJiZlKCl9O3QodGhpcy5lbGVtZW50KS50cmlnZ2VyKG8pLG8uaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0KGkpLnJlbW92ZUNsYXNzKG0uU0hPVyksdGhpcy5fYWN0aXZlVHJpZ2dlcltULkNMSUNLXT0hMSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuRk9DVVNdPSExLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5IT1ZFUl09ITEsci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLnRpcCkuaGFzQ2xhc3MobS5GQURFKT8odGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwLHQoaSkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoYykpOnMoKSx0aGlzLl9ob3ZlclN0YXRlPVwiXCIpfSxoLnByb3RvdHlwZS5pc1dpdGhDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4odGhpcy5nZXRUaXRsZSgpKX0saC5wcm90b3R5cGUuZ2V0VGlwRWxlbWVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpcD10aGlzLnRpcHx8dCh0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF19LGgucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuZ2V0VGlwRWxlbWVudCgpKTt0aGlzLnNldEVsZW1lbnRDb250ZW50KGUuZmluZChFLlRPT0xUSVBfSU5ORVIpLHRoaXMuZ2V0VGl0bGUoKSksZS5yZW1vdmVDbGFzcyhtLkZBREUrXCIgXCIrbS5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0saC5wcm90b3R5cGUuc2V0RWxlbWVudENvbnRlbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgbz10aGlzLmNvbmZpZy5odG1sO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIG4/XCJ1bmRlZmluZWRcIjppKG4pKSYmKG4ubm9kZVR5cGV8fG4uanF1ZXJ5KT9vP3QobikucGFyZW50KCkuaXMoZSl8fGUuZW1wdHkoKS5hcHBlbmQobik6ZS50ZXh0KHQobikudGV4dCgpKTplW28/XCJodG1sXCI6XCJ0ZXh0XCJdKG4pfSxoLnByb3RvdHlwZS5nZXRUaXRsZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpO3JldHVybiB0fHwodD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy50aXRsZT90aGlzLmNvbmZpZy50aXRsZS5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcudGl0bGUpLHR9LGgucHJvdG90eXBlLmNsZWFudXBUZXRoZXI9ZnVuY3Rpb24oKXt0aGlzLl90ZXRoZXImJnRoaXMuX3RldGhlci5kZXN0cm95KCl9LGgucHJvdG90eXBlLl9nZXRBdHRhY2htZW50PWZ1bmN0aW9uKHQpe3JldHVybiBfW3QudG9VcHBlckNhc2UoKV19LGgucHJvdG90eXBlLl9zZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5jb25maWcudHJpZ2dlci5zcGxpdChcIiBcIik7bi5mb3JFYWNoKGZ1bmN0aW9uKG4pe2lmKFwiY2xpY2tcIj09PW4pdChlLmVsZW1lbnQpLm9uKGUuY29uc3RydWN0b3IuRXZlbnQuQ0xJQ0ssZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUudG9nZ2xlKHQpfSk7ZWxzZSBpZihuIT09VC5NQU5VQUwpe3ZhciBpPW49PT1ULkhPVkVSP2UuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VFTlRFUjplLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTSU4sbz1uPT09VC5IT1ZFUj9lLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFTEVBVkU6ZS5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU09VVDt0KGUuZWxlbWVudCkub24oaSxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS5fZW50ZXIodCl9KS5vbihvLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9sZWF2ZSh0KX0pfXQoZS5lbGVtZW50KS5jbG9zZXN0KFwiLm1vZGFsXCIpLm9uKFwiaGlkZS5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGUuaGlkZSgpfSl9KSx0aGlzLmNvbmZpZy5zZWxlY3Rvcj90aGlzLmNvbmZpZz10LmV4dGVuZCh7fSx0aGlzLmNvbmZpZyx7dHJpZ2dlcjpcIm1hbnVhbFwiLHNlbGVjdG9yOlwiXCJ9KTp0aGlzLl9maXhUaXRsZSgpfSxoLnByb3RvdHlwZS5fZml4VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD1pKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKTsodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInRpdGxlXCIpfHxcInN0cmluZ1wiIT09dCkmJih0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiLHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKXx8XCJcIiksdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsXCJcIikpfSxoLnByb3RvdHlwZS5fZW50ZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO3JldHVybiBuPW58fHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGkpLG58fChuPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpLG4pKSxlJiYobi5fYWN0aXZlVHJpZ2dlcltcImZvY3VzaW5cIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSEwKSx0KG4uZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpfHxuLl9ob3ZlclN0YXRlPT09Zy5TSE9XP3ZvaWQobi5faG92ZXJTdGF0ZT1nLlNIT1cpOihjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLlNIT1csbi5jb25maWcuZGVsYXkmJm4uY29uZmlnLmRlbGF5LnNob3c/dm9pZChuLl90aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlPT09Zy5TSE9XJiZuLnNob3coKX0sbi5jb25maWcuZGVsYXkuc2hvdykpOnZvaWQgbi5zaG93KCkpfSxoLnByb3RvdHlwZS5fbGVhdmU9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO2lmKG49bnx8dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSksbnx8KG49bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGksbikpLGUmJihuLl9hY3RpdmVUcmlnZ2VyW1wiZm9jdXNvdXRcIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSExKSwhbi5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKXJldHVybiBjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLk9VVCxuLmNvbmZpZy5kZWxheSYmbi5jb25maWcuZGVsYXkuaGlkZT92b2lkKG4uX3RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe24uX2hvdmVyU3RhdGU9PT1nLk9VVCYmbi5oaWRlKCl9LG4uY29uZmlnLmRlbGF5LmhpZGUpKTp2b2lkIG4uaGlkZSgpfSxoLnByb3RvdHlwZS5faXNXaXRoQWN0aXZlVHJpZ2dlcj1mdW5jdGlvbigpe2Zvcih2YXIgdCBpbiB0aGlzLl9hY3RpdmVUcmlnZ2VyKWlmKHRoaXMuX2FjdGl2ZVRyaWdnZXJbdF0pcmV0dXJuITA7cmV0dXJuITF9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LHQodGhpcy5lbGVtZW50KS5kYXRhKCksbiksbi5kZWxheSYmXCJudW1iZXJcIj09dHlwZW9mIG4uZGVsYXkmJihuLmRlbGF5PXtzaG93Om4uZGVsYXksaGlkZTpuLmRlbGF5fSksci50eXBlQ2hlY2tDb25maWcoZSxuLHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGUpLG59LGgucHJvdG90eXBlLl9nZXREZWxlZ2F0ZUNvbmZpZz1mdW5jdGlvbigpe3ZhciB0PXt9O2lmKHRoaXMuY29uZmlnKWZvcih2YXIgZSBpbiB0aGlzLmNvbmZpZyl0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRbZV0hPT10aGlzLmNvbmZpZ1tlXSYmKHRbZV09dGhpcy5jb25maWdbZV0pO3JldHVybiB0fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZTtpZigobnx8IS9kaXNwb3NlfGhpZGUvLnRlc3QoZSkpJiYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpKXtpZih2b2lkIDA9PT1uW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO25bZV0oKX19KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBhfX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksaH0oKTtyZXR1cm4gdC5mbltlXT1JLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1JLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsSS5falF1ZXJ5SW50ZXJmYWNlfSxJfShqUXVlcnkpKTsoZnVuY3Rpb24ocil7dmFyIGE9XCJwb3BvdmVyXCIsbD1cIjQuMC4wLWFscGhhLjZcIixoPVwiYnMucG9wb3ZlclwiLGM9XCIuXCIraCx1PXIuZm5bYV0sZD1yLmV4dGVuZCh7fSxzLkRlZmF1bHQse3BsYWNlbWVudDpcInJpZ2h0XCIsdHJpZ2dlcjpcImNsaWNrXCIsY29udGVudDpcIlwiLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2Pid9KSxmPXIuZXh0ZW5kKHt9LHMuRGVmYXVsdFR5cGUse2NvbnRlbnQ6XCIoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pXCJ9KSxfPXtGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LGc9e1RJVExFOlwiLnBvcG92ZXItdGl0bGVcIixDT05URU5UOlwiLnBvcG92ZXItY29udGVudFwifSxwPXtISURFOlwiaGlkZVwiK2MsSElEREVOOlwiaGlkZGVuXCIrYyxTSE9XOlwic2hvd1wiK2MsU0hPV046XCJzaG93blwiK2MsSU5TRVJURUQ6XCJpbnNlcnRlZFwiK2MsQ0xJQ0s6XCJjbGlja1wiK2MsRk9DVVNJTjpcImZvY3VzaW5cIitjLEZPQ1VTT1VUOlwiZm9jdXNvdXRcIitjLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrYyxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2N9LG09ZnVuY3Rpb24ocyl7ZnVuY3Rpb24gdSgpe3JldHVybiBuKHRoaXMsdSksdCh0aGlzLHMuYXBwbHkodGhpcyxhcmd1bWVudHMpKX1yZXR1cm4gZSh1LHMpLHUucHJvdG90eXBlLmlzV2l0aENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRUaXRsZSgpfHx0aGlzLl9nZXRDb250ZW50KCl9LHUucHJvdG90eXBlLmdldFRpcEVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aXA9dGhpcy50aXB8fHIodGhpcy5jb25maWcudGVtcGxhdGUpWzBdfSx1LnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIHQ9cih0aGlzLmdldFRpcEVsZW1lbnQoKSk7dGhpcy5zZXRFbGVtZW50Q29udGVudCh0LmZpbmQoZy5USVRMRSksdGhpcy5nZXRUaXRsZSgpKSx0aGlzLnNldEVsZW1lbnRDb250ZW50KHQuZmluZChnLkNPTlRFTlQpLHRoaXMuX2dldENvbnRlbnQoKSksdC5yZW1vdmVDbGFzcyhfLkZBREUrXCIgXCIrXy5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0sdS5wcm90b3R5cGUuX2dldENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29udGVudFwiKXx8KFwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLmNvbnRlbnQ/dGhpcy5jb25maWcuY29udGVudC5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcuY29udGVudCl9LHUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9cih0aGlzKS5kYXRhKGgpLG49XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOmkodCkpP3Q6bnVsbDtpZigoZXx8IS9kZXN0cm95fGhpZGUvLnRlc3QodCkpJiYoZXx8KGU9bmV3IHUodGhpcyxuKSxyKHRoaXMpLmRhdGEoaCxlKSksXCJzdHJpbmdcIj09dHlwZW9mIHQpKXtpZih2b2lkIDA9PT1lW3RdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJyt0KydcIicpO2VbdF0oKX19KX0sbyh1LG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBofX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGN9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksdX0ocyk7cmV0dXJuIHIuZm5bYV09bS5falF1ZXJ5SW50ZXJmYWNlLHIuZm5bYV0uQ29uc3RydWN0b3I9bSxyLmZuW2FdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5mblthXT11LG0uX2pRdWVyeUludGVyZmFjZX0sbX0pKGpRdWVyeSl9KCk7IiwiLypcclxuKiBBZGRzIGEgbmV3IGZpZWxkIHRvIHRoZSBET01cclxuKlxyXG4qIEBwYXJhbSBzdHJpbmcgICAgIGVsZW1lbnQgICAgIFRoZSBlbGVtZW50IHRvIGJlIGFkZGVkXHJcbiogQHBhcmFtIHN0cmluZyAgICAgcGFyZW50ICAgICAgVGhlIHBhcmVudCB3aGVyZSB0aGUgZWxlbWVudCBzaG91bGQgYmUgYWRkZWQgXHJcbiogQHBhcmFtIHN0cmluZyAgICAgd3JhcHBlciAgICAgV3JhcHBlciBvZiB0aGUgbmV3bHkgYWRkZWQgZWxlbWVudFxyXG4qIEBwYXJhbSBmdW5jdGlvbiAgIGNhbGxiYWNrICAgIFRoZSBjYWxsYmFjayBmdW5jdGlvblxyXG4qIEBwYXJhbSBib29sICAgICAgIHJlbW92ZV9saW5rIFt0cnVlXSB0byBpbmNsdWRlIHRoZSByZW1vdmUgbGluaywgW2ZhbHNlXSBvdGhlcndpc2VcclxuKi9cclxuZnVuY3Rpb24gYWRkRmllbGQoZWxlbWVudCwgcGFyZW50LCB3cmFwcGVyLCBjYWxsYmFjayA9ICcnLCByZW1vdmVfbGluayA9IHRydWUpe1xyXG4gICAgLy8gZ2V0IGFuZCBzZXQgdGhlIGVsZW1lbnQvY2xvbmUgSURcclxuICAgIHZhciBlbGVtZW50SWQgPSAkKGVsZW1lbnQpLmF0dHIoJ2lkJyk7XHJcbiAgICB2YXIgY2xvbmVJZCA9IGVsZW1lbnRJZCArICdfJyArIERhdGUubm93KCk7XHJcblxyXG4gICAgLy8gY3JlYXRlIHRoZSBlbGVtZW50IGNsb25lXHJcbiAgICB2YXIgY2xvbmUgPSAkKGVsZW1lbnQpLmNsb25lKCkuYXR0cignaWQnLCBjbG9uZUlkKS53cmFwKHdyYXBwZXIpLnBhcmVudCgpLmh0bWwoKTtcclxuXHJcbiAgICAvLyBhcHBlbmQgdG8gdGhlIHBhcmVudFxyXG4gICAgJChwYXJlbnQpLmFwcGVuZChjbG9uZSk7XHJcbiAgICBpZihyZW1vdmVfbGluaylcclxuICAgIHtcclxuICAgICAgICAkKHBhcmVudCkuYXBwZW5kKCcgPHNwYW4+PGEgaHJlZj1cIiNcIiBjbGFzcz1cInJlbW92ZV9maWVsZCB0ZXh0LWRhbmdlclwiIG9uY2xpY2s9XCJyZW1vdmVGaWVsZCgnK2Nsb25lSWQrJywgdGhpcywgJysgY2FsbGJhY2submFtZSArJylcIj5SZW1vdmU8L2E+PC9zcGFuPicpO1xyXG4gICAgfSAgXHJcblxyXG5cclxuICAgIGlmKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xyXG59XHJcblxyXG4vKlxyXG4qIFJlbW92ZXMgYSBmaWVsZCBmcm9tIHRoZSBET01cclxuKlxyXG4qIEBwYXJhbSBzdHJpbmcgICAgIGVsZW1lbnQgICAgIFRoZSBlbGVtZW50IHRvIGJlIHJlbW92ZWRcclxuKiBAcGFyYW0gc3RyaW5nICAgICBwYXJlbnQgICAgICBUaGUgcmVtb3ZlIGxpbmtcclxuKiBAcGFyYW0gZnVuY3Rpb24gICBjYWxsYmFjayAgICBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cclxuKi9cclxuZnVuY3Rpb24gcmVtb3ZlRmllbGQoZWxlbWVudCwgcmVtX2xpbmssIGNhbGxiYWNrKXtcclxuICAgICQoZWxlbWVudCkucmVtb3ZlKCk7XHJcbiAgICAkKHJlbV9saW5rKS5yZW1vdmUoKTtcclxuXHJcbiAgICBpZihjYWxsYmFjaykgY2FsbGJhY2soKTtcclxufVxyXG5cclxuLypcclxuKiBTZXQgdmFsdWUgb24gYSBmaWVsZCBvbmZvY3VzIGV2ZW50IGlmIGZpZWxkIHZhbHVlIGlzIGVtcHR5XHJcbipcclxuKiBAcGFyYW0gT2JqZWN0IGVsZW1lbnQgVGhlIGZpZWxkXHJcbiogQHBhcmFtIHN0cmluZyB2YWx1ZSAgIFRoZSB2YWx1ZSBcclxuKi9cclxuZnVuY3Rpb24gc2V0Rm9jdXNWYWx1ZShlbGVtZW50LCB2YWx1ZSl7XHJcbiAgICBpZighJChlbGVtZW50KS52YWwoKSlcclxuICAgIHtcclxuICAgICAgICAkKGVsZW1lbnQpLnZhbCh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiogQ29sbGFwc2VzIGFjY29yZGlvbihzKSBcclxuKlxyXG4qIEBwYXJhbSBlbGVtZW50ICAgIGFjY29yZGlvbiAgIFRoZSBhY2NvcmRpb24gZWxlbWVudFxyXG4qIEBwYXJhbSBzdHJpbmcgICAgIGFjdGlvbiAgICAgIFRoZSBhY3Rpb25cclxuKi9cclxuZnVuY3Rpb24gY29sbGFwc2VBbGwoYWNjb3JkaW9uLCBhY3Rpb24pXHJcbntcclxuICAgICQoYWNjb3JkaW9uKS5jb2xsYXBzZShhY3Rpb24pO1xyXG59XHJcblxyXG4vLyBDaGVja3MgYWxsIHRoZSBjaGVja2JveGVzIGNoaWxkcmVuIHdobyBoYXZlIHRoZSAuY2hlY2tBbGwgZWxlbWVudCBpZFxyXG4kKCcuY2hlY2tBbGwnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gZ2V0IHRoZSBpZFxyXG4gICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xyXG5cclxuICAgIC8vIGNoZWNrIGFsbCB0aGUgY2hlY2tib3hlcyB3aG8gaGF2ZSB0aGUgcGFyZW50IGlkIGFzIGNsYXNzXHJcbiAgICAkKCcuJyArIGlkKS5wcm9wKCdjaGVja2VkJywgdGhpcy5jaGVja2VkKTtcclxufSkiLCIkKCdzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCQodGhpcykudmFsKCkgPT0gXCJtb2RhbC10cmlnZ2VyXCIpIHtcclxuICAgICAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcbn0pOyIsIiQoJy5IYW1idXJnZXInKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdPcGVuJyk7XHJcbiAgICAkKCcuU3ViLWhlYWRlcl9iYXInKS50b2dnbGVDbGFzcygnSGFtYnVyZ2VyLW9wZW4nKTtcclxuICAgIGNvbnNvbGUubG9nKCd0b2dnbGVkJylcclxufSk7IiwiJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHsgICAgXHJcbiAgICB2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgIGlmIChzY3JvbGwgPj0gNTApIHtcclxuICAgICAgICAkKFwiLlN1Yi1oZWFkZXJfYmFyXCIpLmFkZENsYXNzKFwiU3RpY2t5LWhlYWRlclwiKTtcclxuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikuYWRkQ2xhc3MoXCJPbmx5XCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkKFwiLlN1Yi1oZWFkZXJfYmFyXCIpLnJlbW92ZUNsYXNzKFwiU3RpY2t5LWhlYWRlclwiKTtcclxuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikucmVtb3ZlQ2xhc3MoXCJPbmx5XCIpO1xyXG4gICAgfVxyXG59KTsiLCIiLCIvKlxyXG4qIEFkZHMgYSBtYXJrZXIgb24gdGhlIG1hcFxyXG4qXHJcbiogQHBhcmFtIE1hcFx0bWFwXHRcdFx0XHRUaGUgbWFwIHdoZXJlIHRvIGFkZCB0aGUgbWFya2VyXHJcbiogQHBhcmFtIGZsb2F0ICBsYXQgICAgIFx0XHRUaGUgcGxhY2UgbGF0aXR1ZGUgXHJcbiogQHBhcmFtIGZsb2F0ICBsb25nICAgIFx0XHRUaGUgcGxhY2UgbG9uZ2l0dWRlXHJcbiogQHBhcmFtIHN0cmluZyBjb250ZW50U3RyaW5nXHRUaGUgd2luZG93IGluZm8gY29udGVudFxyXG4qIEBwYXJhbSBzdHJpbmcgdHlwZSAgICBcdFx0VGhlIHBpbiB0eXBlLiBBdmFpbGFibGUgcGluczogW3JlZCxhbWJlcixncmVlbl1cclxuKiBAcGFyYW0gc3RyaW5nIGxhYmVsICAgXHRcdFRoZSBwaW4gbGFiZWwuIEF2YWlsYWJsZSBsYWJlbDogW2N5Y2xvbmUsY29uZmxpY3QsZWFydGhxdWFrZSx0c3VuYW1pLHN0b3JtLHZvbGNhbm8sdG9ybmFkbyxpbnNlY3QtaW5mZXN0YXRpb24sZGFuZ2Vyb3VzLWFyZWFdXHJcbiogQHJldHVybiB7TnVtYmVyfSBzdW1cclxuKi9cclxuZnVuY3Rpb24gYWRkTWFya2VyKG1hcCwgbGF0LCBsb25nLCBjb250ZW50U3RyaW5nLCB0eXBlICwgbGFiZWwgPSBudWxsKVxyXG57XHJcblx0dmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoe1xyXG5cdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsb25nKSxcclxuXHRcdG1hcDogbWFwLFxyXG5cdFx0aWNvbjogJ2ltZy9tYXJrZXJzLycgKyB0eXBlICsgJy5zdmcnLFxyXG5cdFx0bWFwX2ljb25fbGFiZWw6IChsYWJlbCAhPT0gbnVsbCkgPyAnPGkgY2xhc3M9XCJtYXAtaWNvbiBJY29uLS0nICsgbGFiZWwgKyAnIEljb24tLXNtXCI+PC9pPicgOiAnJ1xyXG5cdH0pO1xyXG4gXHRcclxuXHR2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcclxuICAgICAgICAgICAgY29udGVudDogY29udGVudFN0cmluZyxcclxuXHRcdFx0bWF4V2lkdGg6IDQ4MFxyXG5cdH0pO1xyXG5cclxuXHRtYXJrZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xyXG5cdH0pO1xyXG59IiwiJCgnLkl0ZW1fX3NlbGVjdGFibGUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdTZWxlY3RlZCcpO1xyXG59KTsiLCIkKFwiLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgLy9SZXNldCBhbGwgYWN0aXZlIGNsYXNzZXNcclxuICAgIGlmICggJCggdGhpcyApLmhhc0NsYXNzKCBcIkFjdGl2ZVwiICkgKSB7XHJcbiAgICAgICAgJChcIi5SaWJib25fX2hlYWRlcl9fd3JhcCwgLlJpYmJvbl9fcmVzcG9uc2UsIC5SaWJib25fX2hlYWRlcl9fY2hldnJvblwiKS5yZW1vdmVDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVVwKCk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgICQoXCIuUmliYm9uX19oZWFkZXJfX3dyYXAsIC5SaWJib25fX3Jlc3BvbnNlLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikucmVtb3ZlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xyXG5cclxuICAgICAgICAvL0FkZCBBY3RpdmUgdG8gUmliYm9uIEhlYWRlciBXcmFwXHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS50b2dnbGVDbGFzcygnQWN0aXZlJyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcblxyXG4kKFwiLmJ0bi1jb250aW51ZVwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIC8vUmVzZXQgYWxsIGFjdGl2ZSBjbGFzc2VzXHJcbiAgICAgICAgJChcIi5SaWJib25fX2hlYWRlcl9fd3JhcCwgLlJpYmJvbl9fcmVzcG9uc2UsIC5SaWJib25fX2hlYWRlcl9fY2hldnJvblwiKS5yZW1vdmVDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVVwKCk7XHJcblxyXG4gICAgICAgIC8vQWRkIEFjdGl2ZSB0byBuZXh0IHJpYmJvblxyXG4gICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkubmV4dCgpLm5leHQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVEb3duKCk7XHJcbn0pO1xyXG5cclxuLy8gSW52ZXJzZXMgYXJyb3cgb24gYWNjb3JkaW9uIGV4cGFuc2lvbiBvciBIaWRlL1Nob3cgbGlua1xyXG4kKCcuY29sbGFwc2UnKS5vbignc2hvd24uYnMuY29sbGFwc2UnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICQodGhpcykucHJldigpLmZpbmQoXCIuZmEtY2FyZXQtZG93blwiKS5yZW1vdmVDbGFzcyhcImZhLWNhcmV0LWRvd25cIikuYWRkQ2xhc3MoXCJmYS1jYXJldC11cFwiKTtcclxuICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuU2hvdy1hbGwnKS5oaWRlKCk7XHJcbiAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLkhpZGUtYWxsJykuc2hvdygpO1xyXG4gICAgfSkub24oJ2hpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKCl7XHJcbiAgICAkKHRoaXMpLnByZXYoKS5maW5kKFwiLmZhLWNhcmV0LXVwXCIpLnJlbW92ZUNsYXNzKFwiZmEtY2FyZXQtdXBcIikuYWRkQ2xhc3MoXCJmYS1jYXJldC1kb3duXCIpO1xyXG4gICAgICAgICQodGhpcykucHJldigpLmZpbmQoJy5TaG93LWFsbCcpLnNob3coKTtcclxuICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuSGlkZS1hbGwnKS5oaWRlKCk7XHJcbn0pOyJdfQ==
