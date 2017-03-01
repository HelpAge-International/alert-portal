"use strict";

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $(".Agency-preview").css("background-image", "url(" + e.target.result + ")");
            $(".Agency-preview").addClass("Selected");
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function() {
    readURL(this);
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

$(".Hamburger").click(function() {
    $(this).toggleClass("Open");
    $(".Sub-header_bar").toggleClass("Hamburger-open");
    console.log("toggled");
});

"use strict";

"use strict";

$("select").change(function() {
    if ($(this).val() == "modal-trigger") {
        $("#myModal").modal("show");
    }
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

(function($, window, document, undefined) {
    "use strict";
})(jQuery, window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImhhbWJ1cmdlci5qcyIsImlubGluZS1lZGl0YWJsZS5qcyIsIm1vZGFsLXNlbGVjdC10cmlnZ2VyLmpzIiwic3RpY2t5LW5hdi5qcyJdLCJuYW1lcyI6WyJyZWFkVVJMIiwiaW5wdXQiLCJmaWxlcyIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiJCIsImNzcyIsInRhcmdldCIsInJlc3VsdCIsImFkZENsYXNzIiwicmVhZEFzRGF0YVVSTCIsImNoYW5nZSIsInRoaXMiLCJqUXVlcnkiLCJFcnJvciIsInQiLCJmbiIsImpxdWVyeSIsInNwbGl0IiwiUmVmZXJlbmNlRXJyb3IiLCJfdHlwZW9mIiwiVHlwZUVycm9yIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwibiIsImkiLCJTeW1ib2wiLCJpdGVyYXRvciIsIm8iLCJsZW5ndGgiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInIiLCJ0b1N0cmluZyIsImNhbGwiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwibm9kZVR5cGUiLCJiaW5kVHlwZSIsImEiLCJlbmQiLCJkZWxlZ2F0ZVR5cGUiLCJoYW5kbGUiLCJpcyIsImhhbmRsZU9iaiIsImhhbmRsZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndpbmRvdyIsIlFVbml0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaCIsInN0eWxlIiwib25lIiwiYyIsIlRSQU5TSVRJT05fRU5EIiwic2V0VGltZW91dCIsInRyaWdnZXJUcmFuc2l0aW9uRW5kIiwicyIsImVtdWxhdGVUcmFuc2l0aW9uRW5kIiwic3VwcG9ydHNUcmFuc2l0aW9uRW5kIiwiZXZlbnQiLCJzcGVjaWFsIiwibCIsIldlYmtpdFRyYW5zaXRpb24iLCJNb3pUcmFuc2l0aW9uIiwiT1RyYW5zaXRpb24iLCJ0cmFuc2l0aW9uIiwiZ2V0VUlEIiwiTWF0aCIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCIsImdldEF0dHJpYnV0ZSIsInRlc3QiLCJyZWZsb3ciLCJvZmZzZXRIZWlnaHQiLCJ0cmlnZ2VyIiwiQm9vbGVhbiIsInR5cGVDaGVja0NvbmZpZyIsImhhc093blByb3BlcnR5IiwiUmVnRXhwIiwidG9VcHBlckNhc2UiLCJ1IiwiRElTTUlTUyIsImQiLCJDTE9TRSIsIkNMT1NFRCIsIkNMSUNLX0RBVEFfQVBJIiwiZiIsIkFMRVJUIiwiRkFERSIsIlNIT1ciLCJfIiwiX2VsZW1lbnQiLCJjbG9zZSIsIl9nZXRSb290RWxlbWVudCIsIl90cmlnZ2VyQ2xvc2VFdmVudCIsImlzRGVmYXVsdFByZXZlbnRlZCIsIl9yZW1vdmVFbGVtZW50IiwiZGlzcG9zZSIsInJlbW92ZURhdGEiLCJjbG9zZXN0IiwiRXZlbnQiLCJyZW1vdmVDbGFzcyIsImhhc0NsYXNzIiwiX2Rlc3Ryb3lFbGVtZW50IiwiZGV0YWNoIiwicmVtb3ZlIiwiX2pRdWVyeUludGVyZmFjZSIsImVhY2giLCJkYXRhIiwiX2hhbmRsZURpc21pc3MiLCJwcmV2ZW50RGVmYXVsdCIsImdldCIsIm9uIiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQUNUSVZFIiwiQlVUVE9OIiwiRk9DVVMiLCJEQVRBX1RPR0dMRV9DQVJST1QiLCJEQVRBX1RPR0dMRSIsIklOUFVUIiwiRk9DVVNfQkxVUl9EQVRBX0FQSSIsInRvZ2dsZSIsImZpbmQiLCJ0eXBlIiwiY2hlY2tlZCIsImZvY3VzIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlQ2xhc3MiLCJpbnRlcnZhbCIsImtleWJvYXJkIiwic2xpZGUiLCJwYXVzZSIsIndyYXAiLCJnIiwicCIsIk5FWFQiLCJQUkVWIiwiTEVGVCIsIlJJR0hUIiwibSIsIlNMSURFIiwiU0xJRCIsIktFWURPV04iLCJNT1VTRUVOVEVSIiwiTU9VU0VMRUFWRSIsIkxPQURfREFUQV9BUEkiLCJFIiwiQ0FST1VTRUwiLCJJVEVNIiwidiIsIkFDVElWRV9JVEVNIiwiTkVYVF9QUkVWIiwiSU5ESUNBVE9SUyIsIkRBVEFfU0xJREUiLCJEQVRBX1JJREUiLCJUIiwiX2l0ZW1zIiwiX2ludGVydmFsIiwiX2FjdGl2ZUVsZW1lbnQiLCJfaXNQYXVzZWQiLCJfaXNTbGlkaW5nIiwiX2NvbmZpZyIsIl9nZXRDb25maWciLCJfaW5kaWNhdG9yc0VsZW1lbnQiLCJfYWRkRXZlbnRMaXN0ZW5lcnMiLCJuZXh0IiwiX3NsaWRlIiwibmV4dFdoZW5WaXNpYmxlIiwiaGlkZGVuIiwicHJldiIsIlBSRVZJT1VTIiwiY3ljbGUiLCJjbGVhckludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJ2aXNpYmlsaXR5U3RhdGUiLCJiaW5kIiwidG8iLCJfZ2V0SXRlbUluZGV4Iiwib2ZmIiwiZXh0ZW5kIiwiX2tleWRvd24iLCJkb2N1bWVudEVsZW1lbnQiLCJ0YWdOYW1lIiwid2hpY2giLCJtYWtlQXJyYXkiLCJwYXJlbnQiLCJpbmRleE9mIiwiX2dldEl0ZW1CeURpcmVjdGlvbiIsIl90cmlnZ2VyU2xpZGVFdmVudCIsInJlbGF0ZWRUYXJnZXQiLCJkaXJlY3Rpb24iLCJfc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudCIsImNoaWxkcmVuIiwiX2RhdGFBcGlDbGlja0hhbmRsZXIiLCJTSE9XTiIsIkhJREUiLCJISURERU4iLCJDT0xMQVBTRSIsIkNPTExBUFNJTkciLCJDT0xMQVBTRUQiLCJXSURUSCIsIkhFSUdIVCIsIkFDVElWRVMiLCJfaXNUcmFuc2l0aW9uaW5nIiwiX3RyaWdnZXJBcnJheSIsImlkIiwiX3BhcmVudCIsIl9nZXRQYXJlbnQiLCJfYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzIiwiaGlkZSIsInNob3ciLCJfZ2V0RGltZW5zaW9uIiwiYXR0ciIsInNldFRyYW5zaXRpb25pbmciLCJzbGljZSIsIl9nZXRUYXJnZXRGcm9tRWxlbWVudCIsIkNMSUNLIiwiRk9DVVNJTl9EQVRBX0FQSSIsIktFWURPV05fREFUQV9BUEkiLCJCQUNLRFJPUCIsIkRJU0FCTEVEIiwiRk9STV9DSElMRCIsIlJPTEVfTUVOVSIsIlJPTEVfTElTVEJPWCIsIk5BVkJBUl9OQVYiLCJWSVNJQkxFX0lURU1TIiwiZGlzYWJsZWQiLCJfZ2V0UGFyZW50RnJvbUVsZW1lbnQiLCJfY2xlYXJNZW51cyIsImNsYXNzTmFtZSIsImluc2VydEJlZm9yZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImNvbnRhaW5zIiwiX2RhdGFBcGlLZXlkb3duSGFuZGxlciIsInN0b3BQcm9wYWdhdGlvbiIsImJhY2tkcm9wIiwiRk9DVVNJTiIsIlJFU0laRSIsIkNMSUNLX0RJU01JU1MiLCJLRVlET1dOX0RJU01JU1MiLCJNT1VTRVVQX0RJU01JU1MiLCJNT1VTRURPV05fRElTTUlTUyIsIlNDUk9MTEJBUl9NRUFTVVJFUiIsIk9QRU4iLCJESUFMT0ciLCJEQVRBX0RJU01JU1MiLCJGSVhFRF9DT05URU5UIiwiX2RpYWxvZyIsIl9iYWNrZHJvcCIsIl9pc1Nob3duIiwiX2lzQm9keU92ZXJmbG93aW5nIiwiX2lnbm9yZUJhY2tkcm9wQ2xpY2siLCJfb3JpZ2luYWxCb2R5UGFkZGluZyIsIl9zY3JvbGxiYXJXaWR0aCIsIl9jaGVja1Njcm9sbGJhciIsIl9zZXRTY3JvbGxiYXIiLCJib2R5IiwiX3NldEVzY2FwZUV2ZW50IiwiX3NldFJlc2l6ZUV2ZW50IiwiX3Nob3dCYWNrZHJvcCIsIl9zaG93RWxlbWVudCIsIl9oaWRlTW9kYWwiLCJOb2RlIiwiRUxFTUVOVF9OT0RFIiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5IiwicmVtb3ZlQXR0cmlidXRlIiwic2Nyb2xsVG9wIiwiX2VuZm9yY2VGb2N1cyIsImhhcyIsIl9oYW5kbGVVcGRhdGUiLCJfcmVzZXRBZGp1c3RtZW50cyIsIl9yZXNldFNjcm9sbGJhciIsIl9yZW1vdmVCYWNrZHJvcCIsImFwcGVuZFRvIiwiY3VycmVudFRhcmdldCIsIl9hZGp1c3REaWFsb2ciLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsImNsaWVudFdpZHRoIiwiaW5uZXJXaWR0aCIsIl9nZXRTY3JvbGxiYXJXaWR0aCIsInBhcnNlSW50Iiwib2Zmc2V0V2lkdGgiLCJEZWZhdWx0Iiwib2Zmc2V0IiwibWV0aG9kIiwiQUNUSVZBVEUiLCJTQ1JPTEwiLCJEUk9QRE9XTl9JVEVNIiwiRFJPUERPV05fTUVOVSIsIk5BVl9MSU5LIiwiTkFWIiwiREFUQV9TUFkiLCJMSVNUX0lURU0iLCJMSSIsIkxJX0RST1BET1dOIiwiTkFWX0xJTktTIiwiRFJPUERPV04iLCJEUk9QRE9XTl9JVEVNUyIsIkRST1BET1dOX1RPR0dMRSIsIk9GRlNFVCIsIlBPU0lUSU9OIiwiX3Njcm9sbEVsZW1lbnQiLCJfc2VsZWN0b3IiLCJfb2Zmc2V0cyIsIl90YXJnZXRzIiwiX2FjdGl2ZVRhcmdldCIsIl9zY3JvbGxIZWlnaHQiLCJfcHJvY2VzcyIsInJlZnJlc2giLCJfZ2V0U2Nyb2xsVG9wIiwiX2dldFNjcm9sbEhlaWdodCIsIm1hcCIsInRvcCIsImZpbHRlciIsInNvcnQiLCJmb3JFYWNoIiwicHVzaCIsInBhZ2VZT2Zmc2V0IiwibWF4IiwiX2dldE9mZnNldEhlaWdodCIsImlubmVySGVpZ2h0IiwiX2FjdGl2YXRlIiwiX2NsZWFyIiwiam9pbiIsInBhcmVudHMiLCJBIiwiTElTVCIsIkZBREVfQ0hJTEQiLCJBQ1RJVkVfQ0hJTEQiLCJEUk9QRE9XTl9BQ1RJVkVfQ0hJTEQiLCJfdHJhbnNpdGlvbkNvbXBsZXRlIiwiVGV0aGVyIiwiYW5pbWF0aW9uIiwidGVtcGxhdGUiLCJ0aXRsZSIsImRlbGF5IiwiaHRtbCIsInNlbGVjdG9yIiwicGxhY2VtZW50IiwiY29uc3RyYWludHMiLCJjb250YWluZXIiLCJUT1AiLCJCT1RUT00iLCJPVVQiLCJJTlNFUlRFRCIsIkZPQ1VTT1VUIiwiVE9PTFRJUCIsIlRPT0xUSVBfSU5ORVIiLCJlbGVtZW50IiwiZW5hYmxlZCIsIkhPVkVSIiwiTUFOVUFMIiwiSSIsIl9pc0VuYWJsZWQiLCJfdGltZW91dCIsIl9ob3ZlclN0YXRlIiwiX2FjdGl2ZVRyaWdnZXIiLCJfdGV0aGVyIiwiY29uZmlnIiwidGlwIiwiX3NldExpc3RlbmVycyIsImVuYWJsZSIsImRpc2FibGUiLCJ0b2dnbGVFbmFibGVkIiwiREFUQV9LRVkiLCJfZ2V0RGVsZWdhdGVDb25maWciLCJjbGljayIsIl9pc1dpdGhBY3RpdmVUcmlnZ2VyIiwiX2VudGVyIiwiX2xlYXZlIiwiZ2V0VGlwRWxlbWVudCIsImNsZWFyVGltZW91dCIsImNsZWFudXBUZXRoZXIiLCJFVkVOVF9LRVkiLCJpc1dpdGhDb250ZW50Iiwib3duZXJEb2N1bWVudCIsIk5BTUUiLCJzZXRDb250ZW50IiwiX2dldEF0dGFjaG1lbnQiLCJhdHRhY2htZW50IiwiY2xhc3NlcyIsImNsYXNzUHJlZml4IiwiYWRkVGFyZ2V0Q2xhc3NlcyIsInBvc2l0aW9uIiwiX1RSQU5TSVRJT05fRFVSQVRJT04iLCJnZXRUaXRsZSIsInNldEVsZW1lbnRDb250ZW50IiwiZW1wdHkiLCJhcHBlbmQiLCJ0ZXh0IiwiZGVzdHJveSIsIl9maXhUaXRsZSIsIkRlZmF1bHRUeXBlIiwiY29udGVudCIsIlRJVExFIiwiQ09OVEVOVCIsIl9nZXRDb250ZW50IiwiY29uc29sZSIsImxvZyIsInZhbCIsIm1vZGFsIiwic2Nyb2xsIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLFFBQVFDO0lBQ2YsSUFBSUEsTUFBTUMsU0FBU0QsTUFBTUMsTUFBTSxJQUFJO1FBQy9CLElBQUlDLFNBQVMsSUFBSUM7UUFFakJELE9BQU9FLFNBQVMsU0FBVUM7WUFDdEJDLEVBQUUsbUJBQW1CQyxJQUFJLG9CQUFvQixTQUFTRixFQUFFRyxPQUFPQyxTQUFTO1lBQ3hFSCxFQUFFLG1CQUFtQkksU0FBUzs7UUFHbENSLE9BQU9TLGNBQWNYLE1BQU1DLE1BQU07Ozs7QUFJdkNLLEVBQUUsV0FBV00sT0FBTztJQUNsQmIs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b0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPL0Q7OztnQkFBS3JCLEtBQUk7Z0JBQVFvRixLQUFJLFNBQUFBO29CQUFXLE9BQU93Qjs7O2dCQUFLNUcsS0FBSTtnQkFBWW9GLEtBQUksU0FBQUE7b0JBQVcsT0FBTzVEOzs7Z0JBQUt4QixLQUFJO2dCQUFjb0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPekI7O2tCQUFNTjtVQUFHekI7UUFBRyxPQUFPM0IsRUFBRXhCLEdBQUcrQixLQUFHeUcsRUFBRWxDLGtCQUFpQjlFLEVBQUV4QixHQUFHK0IsR0FBRzhFLGNBQVkyQixHQUFFaEgsRUFBRXhCLEdBQUcrQixHQUFHK0UsYUFBVztZQUFXLE9BQU90RixFQUFFeEIsR0FBRytCLEtBQUc2QyxHQUFFNEQsRUFBRWxDO1dBQWtCa0M7T0FBSTNJOzs7OztBQ05wL2JSLEVBQUUsY0FBYzJYLE1BQU07SUFDbEIzWCxFQUFFTyxNQUFNZ0ksWUFBWTtJQUNwQnZJLEVBQUUsbUJBQW1CdUksWUFBWTtJQUNqQ21SLFFBQVFDLElBQUk7OztBQ0hoQjs7OztBQ0FBM1osRUFBRSxVQUFVTSxPQUFPO0lBQ2YsSUFBSU4sRUFBRU8sTUFBTXFaLFNBQVMsaUJBQWlCO1FBQ2xDNVosRUFBRSxZQUFZNlosTUFBTTs7Ozs7O0FDRjVCN1osRUFBRW1ELFFBQVEyVyxPQUFPO0lBQ2IsSUFBSUEsU0FBUzlaLEVBQUVtRCxRQUFRaU87SUFFdkIsSUFBSTBJLFVBQVUsSUFBSTtRQUNkOVosRUFBRSxtQkFBbUJJLFNBQVM7UUFDOUJKLEVBQUUsZUFBZUksU0FBUztXQUN2QjtRQUNISixFQUFFLG1CQUFtQjRHLFlBQVk7UUFDakM1RyxFQUFFLGVBQWU0RyxZQUFZOzs7Ozs7Q0xQbkMsU0FBQTVHLEdBQUFtRCxRQUFJekQsVUFBZUE7SUFDZjtHQUlJTSxRQUFBQSxRQUFFcUQiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHJlYWRVUkwoaW5wdXQpIHtcbiAgaWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzWzBdKSB7XG4gICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIFxuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgJCgnLkFnZW5jeS1wcmV2aWV3JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZS50YXJnZXQucmVzdWx0ICsgJyknKTtcbiAgICAgICAgICAkKCcuQWdlbmN5LXByZXZpZXcnKS5hZGRDbGFzcygnU2VsZWN0ZWQnKVxuICAgICAgfVxuICAgICAgXG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbnB1dC5maWxlc1swXSk7XG4gIH1cbn1cblxuJChcIiNpbWdJbnBcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gIHJlYWRVUkwodGhpcyk7XG59KTsiLCIvKiFcbiAqIEJvb3RzdHJhcCB2NC4wLjAtYWxwaGEuNiAoaHR0cHM6Ly9nZXRib290c3RyYXAuY29tKVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNyBUaGUgQm9vdHN0cmFwIEF1dGhvcnMgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ncmFwaHMvY29udHJpYnV0b3JzKVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqL1xuaWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGpRdWVyeSl0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeS4galF1ZXJ5IG11c3QgYmUgaW5jbHVkZWQgYmVmb3JlIEJvb3RzdHJhcCdzIEphdmFTY3JpcHQuXCIpOytmdW5jdGlvbih0KXt2YXIgZT10LmZuLmpxdWVyeS5zcGxpdChcIiBcIilbMF0uc3BsaXQoXCIuXCIpO2lmKGVbMF08MiYmZVsxXTw5fHwxPT1lWzBdJiY5PT1lWzFdJiZlWzJdPDF8fGVbMF0+PTQpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBhdCBsZWFzdCBqUXVlcnkgdjEuOS4xIGJ1dCBsZXNzIHRoYW4gdjQuMC4wXCIpfShqUXVlcnkpLCtmdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtpZighdCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP3Q6ZX1mdW5jdGlvbiBlKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIrdHlwZW9mIGUpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJihPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKHQsZSk6dC5fX3Byb3RvX189ZSl9ZnVuY3Rpb24gbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0sbz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpLHI9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0KXtyZXR1cm57fS50b1N0cmluZy5jYWxsKHQpLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbih0KXtyZXR1cm4odFswXXx8dCkubm9kZVR5cGV9ZnVuY3Rpb24gaSgpe3JldHVybntiaW5kVHlwZTphLmVuZCxkZWxlZ2F0ZVR5cGU6YS5lbmQsaGFuZGxlOmZ1bmN0aW9uKGUpe2lmKHQoZS50YXJnZXQpLmlzKHRoaXMpKXJldHVybiBlLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19fWZ1bmN0aW9uIG8oKXtpZih3aW5kb3cuUVVuaXQpcmV0dXJuITE7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvb3RzdHJhcFwiKTtmb3IodmFyIGUgaW4gaClpZih2b2lkIDAhPT10LnN0eWxlW2VdKXJldHVybntlbmQ6aFtlXX07cmV0dXJuITF9ZnVuY3Rpb24gcihlKXt2YXIgbj10aGlzLGk9ITE7cmV0dXJuIHQodGhpcykub25lKGMuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24oKXtpPSEwfSksc2V0VGltZW91dChmdW5jdGlvbigpe2l8fGMudHJpZ2dlclRyYW5zaXRpb25FbmQobil9LGUpLHRoaXN9ZnVuY3Rpb24gcygpe2E9bygpLHQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQ9cixjLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiYodC5ldmVudC5zcGVjaWFsW2MuVFJBTlNJVElPTl9FTkRdPWkoKSl9dmFyIGE9ITEsbD0xZTYsaD17V2Via2l0VHJhbnNpdGlvbjpcIndlYmtpdFRyYW5zaXRpb25FbmRcIixNb3pUcmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwiLE9UcmFuc2l0aW9uOlwib1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmRcIix0cmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwifSxjPXtUUkFOU0lUSU9OX0VORDpcImJzVHJhbnNpdGlvbkVuZFwiLGdldFVJRDpmdW5jdGlvbih0KXtkbyB0Kz1+fihNYXRoLnJhbmRvbSgpKmwpO3doaWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHQpKTtyZXR1cm4gdH0sZ2V0U2VsZWN0b3JGcm9tRWxlbWVudDpmdW5jdGlvbih0KXt2YXIgZT10LmdldEF0dHJpYnV0ZShcImRhdGEtdGFyZ2V0XCIpO3JldHVybiBlfHwoZT10LmdldEF0dHJpYnV0ZShcImhyZWZcIil8fFwiXCIsZT0vXiNbYS16XS9pLnRlc3QoZSk/ZTpudWxsKSxlfSxyZWZsb3c6ZnVuY3Rpb24odCl7cmV0dXJuIHQub2Zmc2V0SGVpZ2h0fSx0cmlnZ2VyVHJhbnNpdGlvbkVuZDpmdW5jdGlvbihlKXt0KGUpLnRyaWdnZXIoYS5lbmQpfSxzdXBwb3J0c1RyYW5zaXRpb25FbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gQm9vbGVhbihhKX0sdHlwZUNoZWNrQ29uZmlnOmZ1bmN0aW9uKHQsaSxvKXtmb3IodmFyIHIgaW4gbylpZihvLmhhc093blByb3BlcnR5KHIpKXt2YXIgcz1vW3JdLGE9aVtyXSxsPWEmJm4oYSk/XCJlbGVtZW50XCI6ZShhKTtpZighbmV3IFJlZ0V4cChzKS50ZXN0KGwpKXRocm93IG5ldyBFcnJvcih0LnRvVXBwZXJDYXNlKCkrXCI6IFwiKygnT3B0aW9uIFwiJytyKydcIiBwcm92aWRlZCB0eXBlIFwiJytsKydcIiAnKSsoJ2J1dCBleHBlY3RlZCB0eXBlIFwiJytzKydcIi4nKSl9fX07cmV0dXJuIHMoKSxjfShqUXVlcnkpLHM9KGZ1bmN0aW9uKHQpe3ZhciBlPVwiYWxlcnRcIixpPVwiNC4wLjAtYWxwaGEuNlwiLHM9XCJicy5hbGVydFwiLGE9XCIuXCIrcyxsPVwiLmRhdGEtYXBpXCIsaD10LmZuW2VdLGM9MTUwLHU9e0RJU01JU1M6J1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXSd9LGQ9e0NMT1NFOlwiY2xvc2VcIithLENMT1NFRDpcImNsb3NlZFwiK2EsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2ErbH0sZj17QUxFUlQ6XCJhbGVydFwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sXz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dH1yZXR1cm4gZS5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24odCl7dD10fHx0aGlzLl9lbGVtZW50O3ZhciBlPXRoaXMuX2dldFJvb3RFbGVtZW50KHQpLG49dGhpcy5fdHJpZ2dlckNsb3NlRXZlbnQoZSk7bi5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8dGhpcy5fcmVtb3ZlRWxlbWVudChlKX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LHMpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2dldFJvb3RFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKSxpPSExO3JldHVybiBuJiYoaT10KG4pWzBdKSxpfHwoaT10KGUpLmNsb3Nlc3QoXCIuXCIrZi5BTEVSVClbMF0pLGl9LGUucHJvdG90eXBlLl90cmlnZ2VyQ2xvc2VFdmVudD1mdW5jdGlvbihlKXt2YXIgbj10LkV2ZW50KGQuQ0xPU0UpO3JldHVybiB0KGUpLnRyaWdnZXIobiksbn0sZS5wcm90b3R5cGUuX3JlbW92ZUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztyZXR1cm4gdChlKS5yZW1vdmVDbGFzcyhmLlNIT1cpLHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQoZSkuaGFzQ2xhc3MoZi5GQURFKT92b2lkIHQoZSkub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24odCl7cmV0dXJuIG4uX2Rlc3Ryb3lFbGVtZW50KGUsdCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjKTp2b2lkIHRoaXMuX2Rlc3Ryb3lFbGVtZW50KGUpfSxlLnByb3RvdHlwZS5fZGVzdHJveUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dChlKS5kZXRhY2goKS50cmlnZ2VyKGQuQ0xPU0VEKS5yZW1vdmUoKX0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLG89aS5kYXRhKHMpO298fChvPW5ldyBlKHRoaXMpLGkuZGF0YShzLG8pKSxcImNsb3NlXCI9PT1uJiZvW25dKHRoaXMpfSl9LGUuX2hhbmRsZURpc21pc3M9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2UmJmUucHJldmVudERlZmF1bHQoKSx0LmNsb3NlKHRoaXMpfX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKGQuQ0xJQ0tfREFUQV9BUEksdS5ESVNNSVNTLF8uX2hhbmRsZURpc21pc3MobmV3IF8pKSx0LmZuW2VdPV8uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPV8sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxfLl9qUXVlcnlJbnRlcmZhY2V9LF99KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJidXR0b25cIixpPVwiNC4wLjAtYWxwaGEuNlwiLHI9XCJicy5idXR0b25cIixzPVwiLlwiK3IsYT1cIi5kYXRhLWFwaVwiLGw9dC5mbltlXSxoPXtBQ1RJVkU6XCJhY3RpdmVcIixCVVRUT046XCJidG5cIixGT0NVUzpcImZvY3VzXCJ9LGM9e0RBVEFfVE9HR0xFX0NBUlJPVDonW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nLElOUFVUOlwiaW5wdXRcIixBQ1RJVkU6XCIuYWN0aXZlXCIsQlVUVE9OOlwiLmJ0blwifSx1PXtDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrcythLEZPQ1VTX0JMVVJfREFUQV9BUEk6XCJmb2N1c1wiK3MrYStcIiBcIisoXCJibHVyXCIrcythKX0sZD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dH1yZXR1cm4gZS5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dmFyIGU9ITAsbj10KHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoYy5EQVRBX1RPR0dMRSlbMF07aWYobil7dmFyIGk9dCh0aGlzLl9lbGVtZW50KS5maW5kKGMuSU5QVVQpWzBdO2lmKGkpe2lmKFwicmFkaW9cIj09PWkudHlwZSlpZihpLmNoZWNrZWQmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoaC5BQ1RJVkUpKWU9ITE7ZWxzZXt2YXIgbz10KG4pLmZpbmQoYy5BQ1RJVkUpWzBdO28mJnQobykucmVtb3ZlQ2xhc3MoaC5BQ1RJVkUpfWUmJihpLmNoZWNrZWQ9IXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoaC5BQ1RJVkUpLHQoaSkudHJpZ2dlcihcImNoYW5nZVwiKSksaS5mb2N1cygpfX10aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtcHJlc3NlZFwiLCF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSksZSYmdCh0aGlzLl9lbGVtZW50KS50b2dnbGVDbGFzcyhoLkFDVElWRSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxyKSx0aGlzLl9lbGVtZW50PW51bGx9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKS5kYXRhKHIpO2l8fChpPW5ldyBlKHRoaXMpLHQodGhpcykuZGF0YShyLGkpKSxcInRvZ2dsZVwiPT09biYmaVtuXSgpfSl9LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbih1LkNMSUNLX0RBVEFfQVBJLGMuREFUQV9UT0dHTEVfQ0FSUk9ULGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt2YXIgbj1lLnRhcmdldDt0KG4pLmhhc0NsYXNzKGguQlVUVE9OKXx8KG49dChuKS5jbG9zZXN0KGMuQlVUVE9OKSksZC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChuKSxcInRvZ2dsZVwiKX0pLm9uKHUuRk9DVVNfQkxVUl9EQVRBX0FQSSxjLkRBVEFfVE9HR0xFX0NBUlJPVCxmdW5jdGlvbihlKXt2YXIgbj10KGUudGFyZ2V0KS5jbG9zZXN0KGMuQlVUVE9OKVswXTt0KG4pLnRvZ2dsZUNsYXNzKGguRk9DVVMsL15mb2N1cyhpbik/JC8udGVzdChlLnR5cGUpKX0pLHQuZm5bZV09ZC5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9ZCx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1sLGQuX2pRdWVyeUludGVyZmFjZX0sZH0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImNhcm91c2VsXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMuY2Fyb3VzZWxcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTYwMCxkPTM3LGY9MzksXz17aW50ZXJ2YWw6NWUzLGtleWJvYXJkOiEwLHNsaWRlOiExLHBhdXNlOlwiaG92ZXJcIix3cmFwOiEwfSxnPXtpbnRlcnZhbDpcIihudW1iZXJ8Ym9vbGVhbilcIixrZXlib2FyZDpcImJvb2xlYW5cIixzbGlkZTpcIihib29sZWFufHN0cmluZylcIixwYXVzZTpcIihzdHJpbmd8Ym9vbGVhbilcIix3cmFwOlwiYm9vbGVhblwifSxwPXtORVhUOlwibmV4dFwiLFBSRVY6XCJwcmV2XCIsTEVGVDpcImxlZnRcIixSSUdIVDpcInJpZ2h0XCJ9LG09e1NMSURFOlwic2xpZGVcIitsLFNMSUQ6XCJzbGlkXCIrbCxLRVlET1dOOlwia2V5ZG93blwiK2wsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitsLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrbCxMT0FEX0RBVEFfQVBJOlwibG9hZFwiK2wraCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxFPXtDQVJPVVNFTDpcImNhcm91c2VsXCIsQUNUSVZFOlwiYWN0aXZlXCIsU0xJREU6XCJzbGlkZVwiLFJJR0hUOlwiY2Fyb3VzZWwtaXRlbS1yaWdodFwiLExFRlQ6XCJjYXJvdXNlbC1pdGVtLWxlZnRcIixORVhUOlwiY2Fyb3VzZWwtaXRlbS1uZXh0XCIsUFJFVjpcImNhcm91c2VsLWl0ZW0tcHJldlwiLElURU06XCJjYXJvdXNlbC1pdGVtXCJ9LHY9e0FDVElWRTpcIi5hY3RpdmVcIixBQ1RJVkVfSVRFTTpcIi5hY3RpdmUuY2Fyb3VzZWwtaXRlbVwiLElURU06XCIuY2Fyb3VzZWwtaXRlbVwiLE5FWFRfUFJFVjpcIi5jYXJvdXNlbC1pdGVtLW5leHQsIC5jYXJvdXNlbC1pdGVtLXByZXZcIixJTkRJQ0FUT1JTOlwiLmNhcm91c2VsLWluZGljYXRvcnNcIixEQVRBX1NMSURFOlwiW2RhdGEtc2xpZGVdLCBbZGF0YS1zbGlkZS10b11cIixEQVRBX1JJREU6J1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXSd9LFQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKGUsaSl7bih0aGlzLGgpLHRoaXMuX2l0ZW1zPW51bGwsdGhpcy5faW50ZXJ2YWw9bnVsbCx0aGlzLl9hY3RpdmVFbGVtZW50PW51bGwsdGhpcy5faXNQYXVzZWQ9ITEsdGhpcy5faXNTbGlkaW5nPSExLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fZWxlbWVudD10KGUpWzBdLHRoaXMuX2luZGljYXRvcnNFbGVtZW50PXQodGhpcy5fZWxlbWVudCkuZmluZCh2LklORElDQVRPUlMpWzBdLHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCl9cmV0dXJuIGgucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXtpZih0aGlzLl9pc1NsaWRpbmcpdGhyb3cgbmV3IEVycm9yKFwiQ2Fyb3VzZWwgaXMgc2xpZGluZ1wiKTt0aGlzLl9zbGlkZShwLk5FWFQpfSxoLnByb3RvdHlwZS5uZXh0V2hlblZpc2libGU9ZnVuY3Rpb24oKXtkb2N1bWVudC5oaWRkZW58fHRoaXMubmV4dCgpfSxoLnByb3RvdHlwZS5wcmV2PWZ1bmN0aW9uKCl7aWYodGhpcy5faXNTbGlkaW5nKXRocm93IG5ldyBFcnJvcihcIkNhcm91c2VsIGlzIHNsaWRpbmdcIik7dGhpcy5fc2xpZGUocC5QUkVWSU9VUyl9LGgucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKGUpe2V8fCh0aGlzLl9pc1BhdXNlZD0hMCksdCh0aGlzLl9lbGVtZW50KS5maW5kKHYuTkVYVF9QUkVWKVswXSYmci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHIudHJpZ2dlclRyYW5zaXRpb25FbmQodGhpcy5fZWxlbWVudCksdGhpcy5jeWNsZSghMCkpLGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpLHRoaXMuX2ludGVydmFsPW51bGx9LGgucHJvdG90eXBlLmN5Y2xlPWZ1bmN0aW9uKHQpe3R8fCh0aGlzLl9pc1BhdXNlZD0hMSksdGhpcy5faW50ZXJ2YWwmJihjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsKSx0aGlzLl9pbnRlcnZhbD1udWxsKSx0aGlzLl9jb25maWcuaW50ZXJ2YWwmJiF0aGlzLl9pc1BhdXNlZCYmKHRoaXMuX2ludGVydmFsPXNldEludGVydmFsKChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGU/dGhpcy5uZXh0V2hlblZpc2libGU6dGhpcy5uZXh0KS5iaW5kKHRoaXMpLHRoaXMuX2NvbmZpZy5pbnRlcnZhbCkpfSxoLnByb3RvdHlwZS50bz1mdW5jdGlvbihlKXt2YXIgbj10aGlzO3RoaXMuX2FjdGl2ZUVsZW1lbnQ9dCh0aGlzLl9lbGVtZW50KS5maW5kKHYuQUNUSVZFX0lURU0pWzBdO3ZhciBpPXRoaXMuX2dldEl0ZW1JbmRleCh0aGlzLl9hY3RpdmVFbGVtZW50KTtpZighKGU+dGhpcy5faXRlbXMubGVuZ3RoLTF8fGU8MCkpe2lmKHRoaXMuX2lzU2xpZGluZylyZXR1cm4gdm9pZCB0KHRoaXMuX2VsZW1lbnQpLm9uZShtLlNMSUQsZnVuY3Rpb24oKXtyZXR1cm4gbi50byhlKX0pO2lmKGk9PT1lKXJldHVybiB0aGlzLnBhdXNlKCksdm9pZCB0aGlzLmN5Y2xlKCk7dmFyIG89ZT5pP3AuTkVYVDpwLlBSRVZJT1VTO3RoaXMuX3NsaWRlKG8sdGhpcy5faXRlbXNbZV0pfX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkub2ZmKGwpLHQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHRoaXMuX2l0ZW1zPW51bGwsdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX2ludGVydmFsPW51bGwsdGhpcy5faXNQYXVzZWQ9bnVsbCx0aGlzLl9pc1NsaWRpbmc9bnVsbCx0aGlzLl9hY3RpdmVFbGVtZW50PW51bGwsdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQ9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxfLG4pLHIudHlwZUNoZWNrQ29uZmlnKGUsbixnKSxufSxoLnByb3RvdHlwZS5fYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2NvbmZpZy5rZXlib2FyZCYmdCh0aGlzLl9lbGVtZW50KS5vbihtLktFWURPV04sZnVuY3Rpb24odCl7cmV0dXJuIGUuX2tleWRvd24odCl9KSxcImhvdmVyXCIhPT10aGlzLl9jb25maWcucGF1c2V8fFwib250b3VjaHN0YXJ0XCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnR8fHQodGhpcy5fZWxlbWVudCkub24obS5NT1VTRUVOVEVSLGZ1bmN0aW9uKHQpe3JldHVybiBlLnBhdXNlKHQpfSkub24obS5NT1VTRUxFQVZFLGZ1bmN0aW9uKHQpe3JldHVybiBlLmN5Y2xlKHQpfSl9LGgucHJvdG90eXBlLl9rZXlkb3duPWZ1bmN0aW9uKHQpe2lmKCEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KHQudGFyZ2V0LnRhZ05hbWUpKXN3aXRjaCh0LndoaWNoKXtjYXNlIGQ6dC5wcmV2ZW50RGVmYXVsdCgpLHRoaXMucHJldigpO2JyZWFrO2Nhc2UgZjp0LnByZXZlbnREZWZhdWx0KCksdGhpcy5uZXh0KCk7YnJlYWs7ZGVmYXVsdDpyZXR1cm59fSxoLnByb3RvdHlwZS5fZ2V0SXRlbUluZGV4PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLl9pdGVtcz10Lm1ha2VBcnJheSh0KGUpLnBhcmVudCgpLmZpbmQodi5JVEVNKSksdGhpcy5faXRlbXMuaW5kZXhPZihlKX0saC5wcm90b3R5cGUuX2dldEl0ZW1CeURpcmVjdGlvbj1mdW5jdGlvbih0LGUpe3ZhciBuPXQ9PT1wLk5FWFQsaT10PT09cC5QUkVWSU9VUyxvPXRoaXMuX2dldEl0ZW1JbmRleChlKSxyPXRoaXMuX2l0ZW1zLmxlbmd0aC0xLHM9aSYmMD09PW98fG4mJm89PT1yO2lmKHMmJiF0aGlzLl9jb25maWcud3JhcClyZXR1cm4gZTt2YXIgYT10PT09cC5QUkVWSU9VUz8tMToxLGw9KG8rYSkldGhpcy5faXRlbXMubGVuZ3RoO3JldHVybiBsPT09LTE/dGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdOnRoaXMuX2l0ZW1zW2xdfSxoLnByb3RvdHlwZS5fdHJpZ2dlclNsaWRlRXZlbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgaT10LkV2ZW50KG0uU0xJREUse3JlbGF0ZWRUYXJnZXQ6ZSxkaXJlY3Rpb246bn0pO3JldHVybiB0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoaSksaX0saC5wcm90b3R5cGUuX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQ9ZnVuY3Rpb24oZSl7aWYodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpe3QodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpLmZpbmQodi5BQ1RJVkUpLnJlbW92ZUNsYXNzKEUuQUNUSVZFKTt2YXIgbj10aGlzLl9pbmRpY2F0b3JzRWxlbWVudC5jaGlsZHJlblt0aGlzLl9nZXRJdGVtSW5kZXgoZSldO24mJnQobikuYWRkQ2xhc3MoRS5BQ1RJVkUpfX0saC5wcm90b3R5cGUuX3NsaWRlPWZ1bmN0aW9uKGUsbil7dmFyIGk9dGhpcyxvPXQodGhpcy5fZWxlbWVudCkuZmluZCh2LkFDVElWRV9JVEVNKVswXSxzPW58fG8mJnRoaXMuX2dldEl0ZW1CeURpcmVjdGlvbihlLG8pLGE9Qm9vbGVhbih0aGlzLl9pbnRlcnZhbCksbD12b2lkIDAsaD12b2lkIDAsYz12b2lkIDA7aWYoZT09PXAuTkVYVD8obD1FLkxFRlQsaD1FLk5FWFQsYz1wLkxFRlQpOihsPUUuUklHSFQsaD1FLlBSRVYsYz1wLlJJR0hUKSxzJiZ0KHMpLmhhc0NsYXNzKEUuQUNUSVZFKSlyZXR1cm4gdm9pZCh0aGlzLl9pc1NsaWRpbmc9ITEpO3ZhciBkPXRoaXMuX3RyaWdnZXJTbGlkZUV2ZW50KHMsYyk7aWYoIWQuaXNEZWZhdWx0UHJldmVudGVkKCkmJm8mJnMpe3RoaXMuX2lzU2xpZGluZz0hMCxhJiZ0aGlzLnBhdXNlKCksdGhpcy5fc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudChzKTt2YXIgZj10LkV2ZW50KG0uU0xJRCx7cmVsYXRlZFRhcmdldDpzLGRpcmVjdGlvbjpjfSk7ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhFLlNMSURFKT8odChzKS5hZGRDbGFzcyhoKSxyLnJlZmxvdyhzKSx0KG8pLmFkZENsYXNzKGwpLHQocykuYWRkQ2xhc3MobCksdChvKS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbigpe3QocykucmVtb3ZlQ2xhc3MobCtcIiBcIitoKS5hZGRDbGFzcyhFLkFDVElWRSksdChvKS5yZW1vdmVDbGFzcyhFLkFDVElWRStcIiBcIitoK1wiIFwiK2wpLGkuX2lzU2xpZGluZz0hMSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cmV0dXJuIHQoaS5fZWxlbWVudCkudHJpZ2dlcihmKX0sMCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KSk6KHQobykucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUpLHQocykuYWRkQ2xhc3MoRS5BQ1RJVkUpLHRoaXMuX2lzU2xpZGluZz0hMSx0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoZikpLGEmJnRoaXMuY3ljbGUoKX19LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89dC5leHRlbmQoe30sXyx0KHRoaXMpLmRhdGEoKSk7XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZ0LmV4dGVuZChvLGUpO3ZhciByPVwic3RyaW5nXCI9PXR5cGVvZiBlP2U6by5zbGlkZTtpZihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcIm51bWJlclwiPT10eXBlb2YgZSluLnRvKGUpO2Vsc2UgaWYoXCJzdHJpbmdcIj09dHlwZW9mIHIpe2lmKHZvaWQgMD09PW5bcl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK3IrJ1wiJyk7bltyXSgpfWVsc2Ugby5pbnRlcnZhbCYmKG4ucGF1c2UoKSxuLmN5Y2xlKCkpfSl9LGguX2RhdGFBcGlDbGlja0hhbmRsZXI9ZnVuY3Rpb24oZSl7dmFyIG49ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpO2lmKG4pe3ZhciBpPXQobilbMF07aWYoaSYmdChpKS5oYXNDbGFzcyhFLkNBUk9VU0VMKSl7dmFyIG89dC5leHRlbmQoe30sdChpKS5kYXRhKCksdCh0aGlzKS5kYXRhKCkpLHM9dGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlLXRvXCIpO3MmJihvLmludGVydmFsPSExKSxoLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KGkpLG8pLHMmJnQoaSkuZGF0YShhKS50byhzKSxlLnByZXZlbnREZWZhdWx0KCl9fX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBffX1dKSxofSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihtLkNMSUNLX0RBVEFfQVBJLHYuREFUQV9TTElERSxULl9kYXRhQXBpQ2xpY2tIYW5kbGVyKSx0KHdpbmRvdykub24obS5MT0FEX0RBVEFfQVBJLGZ1bmN0aW9uKCl7dCh2LkRBVEFfUklERSkuZWFjaChmdW5jdGlvbigpe3ZhciBlPXQodGhpcyk7VC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoZSxlLmRhdGEoKSl9KX0pLHQuZm5bZV09VC5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9VCx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLFQuX2pRdWVyeUludGVyZmFjZX0sVH0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImNvbGxhcHNlXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMuY29sbGFwc2VcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTYwMCxkPXt0b2dnbGU6ITAscGFyZW50OlwiXCJ9LGY9e3RvZ2dsZTpcImJvb2xlYW5cIixwYXJlbnQ6XCJzdHJpbmdcIn0sXz17U0hPVzpcInNob3dcIitsLFNIT1dOOlwic2hvd25cIitsLEhJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LGc9e1NIT1c6XCJzaG93XCIsQ09MTEFQU0U6XCJjb2xsYXBzZVwiLENPTExBUFNJTkc6XCJjb2xsYXBzaW5nXCIsQ09MTEFQU0VEOlwiY29sbGFwc2VkXCJ9LHA9e1dJRFRIOlwid2lkdGhcIixIRUlHSFQ6XCJoZWlnaHRcIn0sbT17QUNUSVZFUzpcIi5jYXJkID4gLnNob3csIC5jYXJkID4gLmNvbGxhcHNpbmdcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nfSxFPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChlLGkpe24odGhpcyxsKSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fZWxlbWVudD1lLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fdHJpZ2dlckFycmF5PXQubWFrZUFycmF5KHQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJytlLmlkKydcIl0sJysoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycrZS5pZCsnXCJdJykpKSx0aGlzLl9wYXJlbnQ9dGhpcy5fY29uZmlnLnBhcmVudD90aGlzLl9nZXRQYXJlbnQoKTpudWxsLHRoaXMuX2NvbmZpZy5wYXJlbnR8fHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLl9lbGVtZW50LHRoaXMuX3RyaWdnZXJBcnJheSksdGhpcy5fY29uZmlnLnRvZ2dsZSYmdGhpcy50b2dnbGUoKX1yZXR1cm4gbC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhnLlNIT1cpP3RoaXMuaGlkZSgpOnRoaXMuc2hvdygpfSxsLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiQ29sbGFwc2UgaXMgdHJhbnNpdGlvbmluZ1wiKTtpZighdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhnLlNIT1cpKXt2YXIgbj12b2lkIDAsaT12b2lkIDA7aWYodGhpcy5fcGFyZW50JiYobj10Lm1ha2VBcnJheSh0KHRoaXMuX3BhcmVudCkuZmluZChtLkFDVElWRVMpKSxuLmxlbmd0aHx8KG49bnVsbCkpLCEobiYmKGk9dChuKS5kYXRhKGEpLGkmJmkuX2lzVHJhbnNpdGlvbmluZykpKXt2YXIgbz10LkV2ZW50KF8uU0hPVyk7aWYodCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKG8pLCFvLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtuJiYobC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChuKSxcImhpZGVcIiksaXx8dChuKS5kYXRhKGEsbnVsbCkpO3ZhciBzPXRoaXMuX2dldERpbWVuc2lvbigpO3QodGhpcy5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRSkuYWRkQ2xhc3MoZy5DT0xMQVBTSU5HKSx0aGlzLl9lbGVtZW50LnN0eWxlW3NdPTAsdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMuX3RyaWdnZXJBcnJheS5sZW5ndGgmJnQodGhpcy5fdHJpZ2dlckFycmF5KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFRCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksdGhpcy5zZXRUcmFuc2l0aW9uaW5nKCEwKTt2YXIgaD1mdW5jdGlvbigpe3QoZS5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTSU5HKS5hZGRDbGFzcyhnLkNPTExBUFNFKS5hZGRDbGFzcyhnLlNIT1cpLGUuX2VsZW1lbnQuc3R5bGVbc109XCJcIixlLnNldFRyYW5zaXRpb25pbmcoITEpLHQoZS5fZWxlbWVudCkudHJpZ2dlcihfLlNIT1dOKX07aWYoIXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkpcmV0dXJuIHZvaWQgaCgpO3ZhciBjPXNbMF0udG9VcHBlckNhc2UoKStzLnNsaWNlKDEpLGQ9XCJzY3JvbGxcIitjO3QodGhpcy5fZWxlbWVudCkub25lKHIuVFJBTlNJVElPTl9FTkQsaCkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSksdGhpcy5fZWxlbWVudC5zdHlsZVtzXT10aGlzLl9lbGVtZW50W2RdK1wicHhcIn19fX0sbC5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIkNvbGxhcHNlIGlzIHRyYW5zaXRpb25pbmdcIik7aWYodCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhnLlNIT1cpKXt2YXIgbj10LkV2ZW50KF8uSElERSk7aWYodCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKG4pLCFuLmlzRGVmYXVsdFByZXZlbnRlZCgpKXt2YXIgaT10aGlzLl9nZXREaW1lbnNpb24oKSxvPWk9PT1wLldJRFRIP1wib2Zmc2V0V2lkdGhcIjpcIm9mZnNldEhlaWdodFwiO3RoaXMuX2VsZW1lbnQuc3R5bGVbaV09dGhpcy5fZWxlbWVudFtvXStcInB4XCIsci5yZWZsb3codGhpcy5fZWxlbWVudCksdCh0aGlzLl9lbGVtZW50KS5hZGRDbGFzcyhnLkNPTExBUFNJTkcpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0UpLnJlbW92ZUNsYXNzKGcuU0hPVyksdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuX3RyaWdnZXJBcnJheS5sZW5ndGgmJnQodGhpcy5fdHJpZ2dlckFycmF5KS5hZGRDbGFzcyhnLkNPTExBUFNFRCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMSksdGhpcy5zZXRUcmFuc2l0aW9uaW5nKCEwKTt2YXIgcz1mdW5jdGlvbigpe2Uuc2V0VHJhbnNpdGlvbmluZyghMSksdChlLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNJTkcpLmFkZENsYXNzKGcuQ09MTEFQU0UpLnRyaWdnZXIoXy5ISURERU4pfTtyZXR1cm4gdGhpcy5fZWxlbWVudC5zdHlsZVtpXT1cIlwiLHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCk/dm9pZCB0KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnZvaWQgcygpfX19LGwucHJvdG90eXBlLnNldFRyYW5zaXRpb25pbmc9ZnVuY3Rpb24odCl7dGhpcy5faXNUcmFuc2l0aW9uaW5nPXR9LGwucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9wYXJlbnQ9bnVsbCx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5fdHJpZ2dlckFycmF5PW51bGwsdGhpcy5faXNUcmFuc2l0aW9uaW5nPW51bGx9LGwucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sZCxuKSxuLnRvZ2dsZT1Cb29sZWFuKG4udG9nZ2xlKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZiksbn0sbC5wcm90b3R5cGUuX2dldERpbWVuc2lvbj1mdW5jdGlvbigpe3ZhciBlPXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MocC5XSURUSCk7cmV0dXJuIGU/cC5XSURUSDpwLkhFSUdIVH0sbC5wcm90b3R5cGUuX2dldFBhcmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXMsbj10KHRoaXMuX2NvbmZpZy5wYXJlbnQpWzBdLGk9J1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyt0aGlzLl9jb25maWcucGFyZW50KydcIl0nO3JldHVybiB0KG4pLmZpbmQoaSkuZWFjaChmdW5jdGlvbih0LG4pe2UuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhsLl9nZXRUYXJnZXRGcm9tRWxlbWVudChuKSxbbl0pfSksbn0sbC5wcm90b3R5cGUuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcz1mdW5jdGlvbihlLG4pe2lmKGUpe3ZhciBpPXQoZSkuaGFzQ2xhc3MoZy5TSE9XKTtlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIixpKSxuLmxlbmd0aCYmdChuKS50b2dnbGVDbGFzcyhnLkNPTExBUFNFRCwhaSkuYXR0cihcImFyaWEtZXhwYW5kZWRcIixpKX19LGwuX2dldFRhcmdldEZyb21FbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKTtyZXR1cm4gbj90KG4pWzBdOm51bGx9LGwuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKSxvPW4uZGF0YShhKSxyPXQuZXh0ZW5kKHt9LGQsbi5kYXRhKCksXCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlKTtpZighbyYmci50b2dnbGUmJi9zaG93fGhpZGUvLnRlc3QoZSkmJihyLnRvZ2dsZT0hMSksb3x8KG89bmV3IGwodGhpcyxyKSxuLmRhdGEoYSxvKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW9bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7b1tlXSgpfX0pfSxvKGwsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGR9fV0pLGx9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKF8uQ0xJQ0tfREFUQV9BUEksbS5EQVRBX1RPR0dMRSxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIG49RS5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQodGhpcyksaT10KG4pLmRhdGEoYSksbz1pP1widG9nZ2xlXCI6dCh0aGlzKS5kYXRhKCk7RS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChuKSxvKX0pLHQuZm5bZV09RS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9RSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLEUuX2pRdWVyeUludGVyZmFjZX0sRX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImRyb3Bkb3duXCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMuZHJvcGRvd25cIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTI3LHU9MzgsZD00MCxmPTMsXz17SElERTpcImhpZGVcIithLEhJRERFTjpcImhpZGRlblwiK2EsU0hPVzpcInNob3dcIithLFNIT1dOOlwic2hvd25cIithLENMSUNLOlwiY2xpY2tcIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2wsRk9DVVNJTl9EQVRBX0FQSTpcImZvY3VzaW5cIithK2wsS0VZRE9XTl9EQVRBX0FQSTpcImtleWRvd25cIithK2x9LGc9e0JBQ0tEUk9QOlwiZHJvcGRvd24tYmFja2Ryb3BcIixESVNBQkxFRDpcImRpc2FibGVkXCIsU0hPVzpcInNob3dcIn0scD17QkFDS0RST1A6XCIuZHJvcGRvd24tYmFja2Ryb3BcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLEZPUk1fQ0hJTEQ6XCIuZHJvcGRvd24gZm9ybVwiLFJPTEVfTUVOVTonW3JvbGU9XCJtZW51XCJdJyxST0xFX0xJU1RCT1g6J1tyb2xlPVwibGlzdGJveFwiXScsTkFWQkFSX05BVjpcIi5uYXZiYXItbmF2XCIsVklTSUJMRV9JVEVNUzonW3JvbGU9XCJtZW51XCJdIGxpOm5vdCguZGlzYWJsZWQpIGEsIFtyb2xlPVwibGlzdGJveFwiXSBsaTpub3QoLmRpc2FibGVkKSBhJ30sbT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dCx0aGlzLl9hZGRFdmVudExpc3RlbmVycygpfXJldHVybiBlLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXtpZih0aGlzLmRpc2FibGVkfHx0KHRoaXMpLmhhc0NsYXNzKGcuRElTQUJMRUQpKXJldHVybiExO3ZhciBuPWUuX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMpLGk9dChuKS5oYXNDbGFzcyhnLlNIT1cpO2lmKGUuX2NsZWFyTWVudXMoKSxpKXJldHVybiExO2lmKFwib250b3VjaHN0YXJ0XCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQmJiF0KG4pLmNsb3Nlc3QocC5OQVZCQVJfTkFWKS5sZW5ndGgpe3ZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7by5jbGFzc05hbWU9Zy5CQUNLRFJPUCx0KG8pLmluc2VydEJlZm9yZSh0aGlzKSx0KG8pLm9uKFwiY2xpY2tcIixlLl9jbGVhck1lbnVzKX12YXIgcj17cmVsYXRlZFRhcmdldDp0aGlzfSxzPXQuRXZlbnQoXy5TSE9XLHIpO3JldHVybiB0KG4pLnRyaWdnZXIocyksIXMuaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLmZvY3VzKCksdGhpcy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApLHQobikudG9nZ2xlQ2xhc3MoZy5TSE9XKSx0KG4pLnRyaWdnZXIodC5FdmVudChfLlNIT1dOLHIpKSwhMSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxzKSx0KHRoaXMuX2VsZW1lbnQpLm9mZihhKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9hZGRFdmVudExpc3RlbmVycz1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkub24oXy5DTElDSyx0aGlzLnRvZ2dsZSl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKS5kYXRhKHMpO2lmKGl8fChpPW5ldyBlKHRoaXMpLHQodGhpcykuZGF0YShzLGkpKSxcInN0cmluZ1wiPT10eXBlb2Ygbil7aWYodm9pZCAwPT09aVtuXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrbisnXCInKTtpW25dLmNhbGwodGhpcyl9fSl9LGUuX2NsZWFyTWVudXM9ZnVuY3Rpb24obil7aWYoIW58fG4ud2hpY2ghPT1mKXt2YXIgaT10KHAuQkFDS0RST1ApWzBdO2kmJmkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpKTtmb3IodmFyIG89dC5tYWtlQXJyYXkodChwLkRBVEFfVE9HR0xFKSkscj0wO3I8by5sZW5ndGg7cisrKXt2YXIgcz1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudChvW3JdKSxhPXtyZWxhdGVkVGFyZ2V0Om9bcl19O2lmKHQocykuaGFzQ2xhc3MoZy5TSE9XKSYmIShuJiYoXCJjbGlja1wiPT09bi50eXBlJiYvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KG4udGFyZ2V0LnRhZ05hbWUpfHxcImZvY3VzaW5cIj09PW4udHlwZSkmJnQuY29udGFpbnMocyxuLnRhcmdldCkpKXt2YXIgbD10LkV2ZW50KF8uSElERSxhKTt0KHMpLnRyaWdnZXIobCksbC5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KG9bcl0uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLFwiZmFsc2VcIiksdChzKS5yZW1vdmVDbGFzcyhnLlNIT1cpLnRyaWdnZXIodC5FdmVudChfLkhJRERFTixhKSkpfX19fSxlLl9nZXRQYXJlbnRGcm9tRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj12b2lkIDAsaT1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIGkmJihuPXQoaSlbMF0pLG58fGUucGFyZW50Tm9kZX0sZS5fZGF0YUFwaUtleWRvd25IYW5kbGVyPWZ1bmN0aW9uKG4pe2lmKC8oMzh8NDB8Mjd8MzIpLy50ZXN0KG4ud2hpY2gpJiYhL2lucHV0fHRleHRhcmVhL2kudGVzdChuLnRhcmdldC50YWdOYW1lKSYmKG4ucHJldmVudERlZmF1bHQoKSxuLnN0b3BQcm9wYWdhdGlvbigpLCF0aGlzLmRpc2FibGVkJiYhdCh0aGlzKS5oYXNDbGFzcyhnLkRJU0FCTEVEKSkpe3ZhciBpPWUuX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMpLG89dChpKS5oYXNDbGFzcyhnLlNIT1cpO2lmKCFvJiZuLndoaWNoIT09Y3x8byYmbi53aGljaD09PWMpe2lmKG4ud2hpY2g9PT1jKXt2YXIgcj10KGkpLmZpbmQocC5EQVRBX1RPR0dMRSlbMF07dChyKS50cmlnZ2VyKFwiZm9jdXNcIil9cmV0dXJuIHZvaWQgdCh0aGlzKS50cmlnZ2VyKFwiY2xpY2tcIil9dmFyIHM9dChpKS5maW5kKHAuVklTSUJMRV9JVEVNUykuZ2V0KCk7aWYocy5sZW5ndGgpe3ZhciBhPXMuaW5kZXhPZihuLnRhcmdldCk7bi53aGljaD09PXUmJmE+MCYmYS0tLG4ud2hpY2g9PT1kJiZhPHMubGVuZ3RoLTEmJmErKyxhPDAmJihhPTApLHNbYV0uZm9jdXMoKX19fSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuREFUQV9UT0dHTEUsbS5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihfLktFWURPV05fREFUQV9BUEkscC5ST0xFX01FTlUsbS5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihfLktFWURPV05fREFUQV9BUEkscC5ST0xFX0xJU1RCT1gsbS5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihfLkNMSUNLX0RBVEFfQVBJK1wiIFwiK18uRk9DVVNJTl9EQVRBX0FQSSxtLl9jbGVhck1lbnVzKS5vbihfLkNMSUNLX0RBVEFfQVBJLHAuREFUQV9UT0dHTEUsbS5wcm90b3R5cGUudG9nZ2xlKS5vbihfLkNMSUNLX0RBVEFfQVBJLHAuRk9STV9DSElMRCxmdW5jdGlvbih0KXt0LnN0b3BQcm9wYWdhdGlvbigpfSksdC5mbltlXT1tLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1tLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwibW9kYWxcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5tb2RhbFwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9MzAwLGQ9MTUwLGY9MjcsXz17YmFja2Ryb3A6ITAsa2V5Ym9hcmQ6ITAsZm9jdXM6ITAsc2hvdzohMH0sZz17YmFja2Ryb3A6XCIoYm9vbGVhbnxzdHJpbmcpXCIsa2V5Ym9hcmQ6XCJib29sZWFuXCIsZm9jdXM6XCJib29sZWFuXCIsc2hvdzpcImJvb2xlYW5cIn0scD17SElERTpcImhpZGVcIitsLEhJRERFTjpcImhpZGRlblwiK2wsU0hPVzpcInNob3dcIitsLFNIT1dOOlwic2hvd25cIitsLEZPQ1VTSU46XCJmb2N1c2luXCIrbCxSRVNJWkU6XCJyZXNpemVcIitsLENMSUNLX0RJU01JU1M6XCJjbGljay5kaXNtaXNzXCIrbCxLRVlET1dOX0RJU01JU1M6XCJrZXlkb3duLmRpc21pc3NcIitsLE1PVVNFVVBfRElTTUlTUzpcIm1vdXNldXAuZGlzbWlzc1wiK2wsTU9VU0VET1dOX0RJU01JU1M6XCJtb3VzZWRvd24uZGlzbWlzc1wiK2wsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sbT17U0NST0xMQkFSX01FQVNVUkVSOlwibW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmVcIixCQUNLRFJPUDpcIm1vZGFsLWJhY2tkcm9wXCIsT1BFTjpcIm1vZGFsLW9wZW5cIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LEU9e0RJQUxPRzpcIi5tb2RhbC1kaWFsb2dcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLERBVEFfRElTTUlTUzonW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJyxGSVhFRF9DT05URU5UOlwiLmZpeGVkLXRvcCwgLmZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkLCAuc3RpY2t5LXRvcFwifSx2PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe24odGhpcyxoKSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9kaWFsb2c9dChlKS5maW5kKEUuRElBTE9HKVswXSx0aGlzLl9iYWNrZHJvcD1udWxsLHRoaXMuX2lzU2hvd249ITEsdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmc9ITEsdGhpcy5faWdub3JlQmFja2Ryb3BDbGljaz0hMSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz0wLHRoaXMuX3Njcm9sbGJhcldpZHRoPTB9cmV0dXJuIGgucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5faXNTaG93bj90aGlzLmhpZGUoKTp0aGlzLnNob3codCl9LGgucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiTW9kYWwgaXMgdHJhbnNpdGlvbmluZ1wiKTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSkmJih0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITApO3ZhciBpPXQuRXZlbnQocC5TSE9XLHtyZWxhdGVkVGFyZ2V0OmV9KTt0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoaSksdGhpcy5faXNTaG93bnx8aS5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KHRoaXMuX2lzU2hvd249ITAsdGhpcy5fY2hlY2tTY3JvbGxiYXIoKSx0aGlzLl9zZXRTY3JvbGxiYXIoKSx0KGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKG0uT1BFTiksdGhpcy5fc2V0RXNjYXBlRXZlbnQoKSx0aGlzLl9zZXRSZXNpemVFdmVudCgpLHQodGhpcy5fZWxlbWVudCkub24ocC5DTElDS19ESVNNSVNTLEUuREFUQV9ESVNNSVNTLGZ1bmN0aW9uKHQpe3JldHVybiBuLmhpZGUodCl9KSx0KHRoaXMuX2RpYWxvZykub24ocC5NT1VTRURPV05fRElTTUlTUyxmdW5jdGlvbigpe3Qobi5fZWxlbWVudCkub25lKHAuTU9VU0VVUF9ESVNNSVNTLGZ1bmN0aW9uKGUpe3QoZS50YXJnZXQpLmlzKG4uX2VsZW1lbnQpJiYobi5faWdub3JlQmFja2Ryb3BDbGljaz0hMCl9KX0pLHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbigpe3JldHVybiBuLl9zaG93RWxlbWVudChlKX0pKX0saC5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbihlKXt2YXIgbj10aGlzO2lmKGUmJmUucHJldmVudERlZmF1bHQoKSx0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiTW9kYWwgaXMgdHJhbnNpdGlvbmluZ1wiKTt2YXIgaT1yLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk7aSYmKHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCk7dmFyIG89dC5FdmVudChwLkhJREUpO3QodGhpcy5fZWxlbWVudCkudHJpZ2dlcihvKSx0aGlzLl9pc1Nob3duJiYhby5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmKHRoaXMuX2lzU2hvd249ITEsdGhpcy5fc2V0RXNjYXBlRXZlbnQoKSx0aGlzLl9zZXRSZXNpemVFdmVudCgpLHQoZG9jdW1lbnQpLm9mZihwLkZPQ1VTSU4pLHQodGhpcy5fZWxlbWVudCkucmVtb3ZlQ2xhc3MobS5TSE9XKSx0KHRoaXMuX2VsZW1lbnQpLm9mZihwLkNMSUNLX0RJU01JU1MpLHQodGhpcy5fZGlhbG9nKS5vZmYocC5NT1VTRURPV05fRElTTUlTUyksaT90KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKHQpe3JldHVybiBuLl9oaWRlTW9kYWwodCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTp0aGlzLl9oaWRlTW9kYWwoKSl9LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0KHdpbmRvdyxkb2N1bWVudCx0aGlzLl9lbGVtZW50LHRoaXMuX2JhY2tkcm9wKS5vZmYobCksdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX2RpYWxvZz1udWxsLHRoaXMuX2JhY2tkcm9wPW51bGwsdGhpcy5faXNTaG93bj1udWxsLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nPW51bGwsdGhpcy5faWdub3JlQmFja2Ryb3BDbGljaz1udWxsLHRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9bnVsbCx0aGlzLl9zY3JvbGxiYXJXaWR0aD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LF8sbiksci50eXBlQ2hlY2tDb25maWcoZSxuLGcpLG59LGgucHJvdG90eXBlLl9zaG93RWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpO3RoaXMuX2VsZW1lbnQucGFyZW50Tm9kZSYmdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlPT09Tm9kZS5FTEVNRU5UX05PREV8fGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbWVudCksdGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIix0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpLHRoaXMuX2VsZW1lbnQuc2Nyb2xsVG9wPTAsaSYmci5yZWZsb3codGhpcy5fZWxlbWVudCksdCh0aGlzLl9lbGVtZW50KS5hZGRDbGFzcyhtLlNIT1cpLHRoaXMuX2NvbmZpZy5mb2N1cyYmdGhpcy5fZW5mb3JjZUZvY3VzKCk7dmFyIG89dC5FdmVudChwLlNIT1dOLHtyZWxhdGVkVGFyZ2V0OmV9KSxzPWZ1bmN0aW9uKCl7bi5fY29uZmlnLmZvY3VzJiZuLl9lbGVtZW50LmZvY3VzKCksbi5faXNUcmFuc2l0aW9uaW5nPSExLHQobi5fZWxlbWVudCkudHJpZ2dlcihvKX07aT90KHRoaXMuX2RpYWxvZykub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6cygpfSxoLnByb3RvdHlwZS5fZW5mb3JjZUZvY3VzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0KGRvY3VtZW50KS5vZmYocC5GT0NVU0lOKS5vbihwLkZPQ1VTSU4sZnVuY3Rpb24obil7ZG9jdW1lbnQ9PT1uLnRhcmdldHx8ZS5fZWxlbWVudD09PW4udGFyZ2V0fHx0KGUuX2VsZW1lbnQpLmhhcyhuLnRhcmdldCkubGVuZ3RofHxlLl9lbGVtZW50LmZvY3VzKCl9KX0saC5wcm90b3R5cGUuX3NldEVzY2FwZUV2ZW50PWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9pc1Nob3duJiZ0aGlzLl9jb25maWcua2V5Ym9hcmQ/dCh0aGlzLl9lbGVtZW50KS5vbihwLktFWURPV05fRElTTUlTUyxmdW5jdGlvbih0KXt0LndoaWNoPT09ZiYmZS5oaWRlKCl9KTp0aGlzLl9pc1Nob3dufHx0KHRoaXMuX2VsZW1lbnQpLm9mZihwLktFWURPV05fRElTTUlTUyl9LGgucHJvdG90eXBlLl9zZXRSZXNpemVFdmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5faXNTaG93bj90KHdpbmRvdykub24ocC5SRVNJWkUsZnVuY3Rpb24odCl7cmV0dXJuIGUuX2hhbmRsZVVwZGF0ZSh0KX0pOnQod2luZG93KS5vZmYocC5SRVNJWkUpfSxoLnByb3RvdHlwZS5faGlkZU1vZGFsPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXk9XCJub25lXCIsdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7dChkb2N1bWVudC5ib2R5KS5yZW1vdmVDbGFzcyhtLk9QRU4pLGUuX3Jlc2V0QWRqdXN0bWVudHMoKSxlLl9yZXNldFNjcm9sbGJhcigpLHQoZS5fZWxlbWVudCkudHJpZ2dlcihwLkhJRERFTil9KX0saC5wcm90b3R5cGUuX3JlbW92ZUJhY2tkcm9wPWZ1bmN0aW9uKCl7dGhpcy5fYmFja2Ryb3AmJih0KHRoaXMuX2JhY2tkcm9wKS5yZW1vdmUoKSx0aGlzLl9iYWNrZHJvcD1udWxsKX0saC5wcm90b3R5cGUuX3Nob3dCYWNrZHJvcD1mdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpP20uRkFERTpcIlwiO2lmKHRoaXMuX2lzU2hvd24mJnRoaXMuX2NvbmZpZy5iYWNrZHJvcCl7dmFyIG89ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmaTtpZih0aGlzLl9iYWNrZHJvcD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHRoaXMuX2JhY2tkcm9wLmNsYXNzTmFtZT1tLkJBQ0tEUk9QLGkmJnQodGhpcy5fYmFja2Ryb3ApLmFkZENsYXNzKGkpLHQodGhpcy5fYmFja2Ryb3ApLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpLHQodGhpcy5fZWxlbWVudCkub24ocC5DTElDS19ESVNNSVNTLGZ1bmN0aW9uKHQpe3JldHVybiBuLl9pZ25vcmVCYWNrZHJvcENsaWNrP3ZvaWQobi5faWdub3JlQmFja2Ryb3BDbGljaz0hMSk6dm9pZCh0LnRhcmdldD09PXQuY3VycmVudFRhcmdldCYmKFwic3RhdGljXCI9PT1uLl9jb25maWcuYmFja2Ryb3A/bi5fZWxlbWVudC5mb2N1cygpOm4uaGlkZSgpKSl9KSxvJiZyLnJlZmxvdyh0aGlzLl9iYWNrZHJvcCksdCh0aGlzLl9iYWNrZHJvcCkuYWRkQ2xhc3MobS5TSE9XKSwhZSlyZXR1cm47aWYoIW8pcmV0dXJuIHZvaWQgZSgpO3QodGhpcy5fYmFja2Ryb3ApLm9uZShyLlRSQU5TSVRJT05fRU5ELGUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGQpfWVsc2UgaWYoIXRoaXMuX2lzU2hvd24mJnRoaXMuX2JhY2tkcm9wKXt0KHRoaXMuX2JhY2tkcm9wKS5yZW1vdmVDbGFzcyhtLlNIT1cpO3ZhciBzPWZ1bmN0aW9uKCl7bi5fcmVtb3ZlQmFja2Ryb3AoKSxlJiZlKCl9O3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKT90KHRoaXMuX2JhY2tkcm9wKS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkKTpzKCl9ZWxzZSBlJiZlKCl9LGgucHJvdG90eXBlLl9oYW5kbGVVcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLl9hZGp1c3REaWFsb2coKX0saC5wcm90b3R5cGUuX2FkanVzdERpYWxvZz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2VsZW1lbnQuc2Nyb2xsSGVpZ2h0PmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7IXRoaXMuX2lzQm9keU92ZXJmbG93aW5nJiZ0JiYodGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdD10aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nJiYhdCYmKHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0PXRoaXMuX3Njcm9sbGJhcldpZHRoK1wicHhcIil9LGgucHJvdG90eXBlLl9yZXNldEFkanVzdG1lbnRzPWZ1bmN0aW9uKCl7dGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdD1cIlwiLHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0PVwiXCJ9LGgucHJvdG90eXBlLl9jaGVja1Njcm9sbGJhcj1mdW5jdGlvbigpe3RoaXMuX2lzQm9keU92ZXJmbG93aW5nPWRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg8d2luZG93LmlubmVyV2lkdGgsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9dGhpcy5fZ2V0U2Nyb2xsYmFyV2lkdGgoKX0saC5wcm90b3R5cGUuX3NldFNjcm9sbGJhcj1mdW5jdGlvbigpe3ZhciBlPXBhcnNlSW50KHQoRS5GSVhFRF9DT05URU5UKS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpfHwwLDEwKTt0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPWRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0fHxcIlwiLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nJiYoZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQ9ZSt0aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpfSxoLnByb3RvdHlwZS5fcmVzZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXtkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodD10aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nfSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsYmFyV2lkdGg9ZnVuY3Rpb24oKXt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3QuY2xhc3NOYW1lPW0uU0NST0xMQkFSX01FQVNVUkVSLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodCk7dmFyIGU9dC5vZmZzZXRXaWR0aC10LmNsaWVudFdpZHRoO3JldHVybiBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHQpLGV9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlLG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbz10KHRoaXMpLmRhdGEoYSkscj10LmV4dGVuZCh7fSxoLkRlZmF1bHQsdCh0aGlzKS5kYXRhKCksXCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlKTtpZihvfHwobz1uZXcgaCh0aGlzLHIpLHQodGhpcykuZGF0YShhLG8pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09b1tlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtvW2VdKG4pfWVsc2Ugci5zaG93JiZvLnNob3cobil9KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBffX1dKSxofSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihwLkNMSUNLX0RBVEFfQVBJLEUuREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXZvaWQgMCxvPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKTtvJiYoaT10KG8pWzBdKTt2YXIgcz10KGkpLmRhdGEoYSk/XCJ0b2dnbGVcIjp0LmV4dGVuZCh7fSx0KGkpLmRhdGEoKSx0KHRoaXMpLmRhdGEoKSk7XCJBXCIhPT10aGlzLnRhZ05hbWUmJlwiQVJFQVwiIT09dGhpcy50YWdOYW1lfHxlLnByZXZlbnREZWZhdWx0KCk7dmFyIGw9dChpKS5vbmUocC5TSE9XLGZ1bmN0aW9uKGUpe2UuaXNEZWZhdWx0UHJldmVudGVkKCl8fGwub25lKHAuSElEREVOLGZ1bmN0aW9uKCl7dChuKS5pcyhcIjp2aXNpYmxlXCIpJiZuLmZvY3VzKCl9KX0pO3YuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQoaSkscyx0aGlzKX0pLHQuZm5bZV09di5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9dix0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLHYuX2pRdWVyeUludGVyZmFjZX0sdn0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cInNjcm9sbHNweVwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLnNjcm9sbHNweVwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9e29mZnNldDoxMCxtZXRob2Q6XCJhdXRvXCIsdGFyZ2V0OlwiXCJ9LGQ9e29mZnNldDpcIm51bWJlclwiLG1ldGhvZDpcInN0cmluZ1wiLHRhcmdldDpcIihzdHJpbmd8ZWxlbWVudClcIn0sZj17QUNUSVZBVEU6XCJhY3RpdmF0ZVwiK2wsU0NST0xMOlwic2Nyb2xsXCIrbCxMT0FEX0RBVEFfQVBJOlwibG9hZFwiK2wraH0sXz17RFJPUERPV05fSVRFTTpcImRyb3Bkb3duLWl0ZW1cIixEUk9QRE9XTl9NRU5VOlwiZHJvcGRvd24tbWVudVwiLE5BVl9MSU5LOlwibmF2LWxpbmtcIixOQVY6XCJuYXZcIixBQ1RJVkU6XCJhY3RpdmVcIn0sZz17REFUQV9TUFk6J1tkYXRhLXNweT1cInNjcm9sbFwiXScsQUNUSVZFOlwiLmFjdGl2ZVwiLExJU1RfSVRFTTpcIi5saXN0LWl0ZW1cIixMSTpcImxpXCIsTElfRFJPUERPV046XCJsaS5kcm9wZG93blwiLE5BVl9MSU5LUzpcIi5uYXYtbGlua1wiLERST1BET1dOOlwiLmRyb3Bkb3duXCIsRFJPUERPV05fSVRFTVM6XCIuZHJvcGRvd24taXRlbVwiLERST1BET1dOX1RPR0dMRTpcIi5kcm9wZG93bi10b2dnbGVcIn0scD17T0ZGU0VUOlwib2Zmc2V0XCIsUE9TSVRJT046XCJwb3NpdGlvblwifSxtPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe3ZhciBvPXRoaXM7bih0aGlzLGgpLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9zY3JvbGxFbGVtZW50PVwiQk9EWVwiPT09ZS50YWdOYW1lP3dpbmRvdzplLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fc2VsZWN0b3I9dGhpcy5fY29uZmlnLnRhcmdldCtcIiBcIitnLk5BVl9MSU5LUytcIixcIisodGhpcy5fY29uZmlnLnRhcmdldCtcIiBcIitnLkRST1BET1dOX0lURU1TKSx0aGlzLl9vZmZzZXRzPVtdLHRoaXMuX3RhcmdldHM9W10sdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdGhpcy5fc2Nyb2xsSGVpZ2h0PTAsdCh0aGlzLl9zY3JvbGxFbGVtZW50KS5vbihmLlNDUk9MTCxmdW5jdGlvbih0KXtyZXR1cm4gby5fcHJvY2Vzcyh0KX0pLHRoaXMucmVmcmVzaCgpLHRoaXMuX3Byb2Nlc3MoKX1yZXR1cm4gaC5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMsbj10aGlzLl9zY3JvbGxFbGVtZW50IT09dGhpcy5fc2Nyb2xsRWxlbWVudC53aW5kb3c/cC5QT1NJVElPTjpwLk9GRlNFVCxpPVwiYXV0b1wiPT09dGhpcy5fY29uZmlnLm1ldGhvZD9uOnRoaXMuX2NvbmZpZy5tZXRob2Qsbz1pPT09cC5QT1NJVElPTj90aGlzLl9nZXRTY3JvbGxUb3AoKTowO3RoaXMuX29mZnNldHM9W10sdGhpcy5fdGFyZ2V0cz1bXSx0aGlzLl9zY3JvbGxIZWlnaHQ9dGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KCk7dmFyIHM9dC5tYWtlQXJyYXkodCh0aGlzLl9zZWxlY3RvcikpO3MubWFwKGZ1bmN0aW9uKGUpe3ZhciBuPXZvaWQgMCxzPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKTtyZXR1cm4gcyYmKG49dChzKVswXSksbiYmKG4ub2Zmc2V0V2lkdGh8fG4ub2Zmc2V0SGVpZ2h0KT9bdChuKVtpXSgpLnRvcCtvLHNdOm51bGx9KS5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIHR9KS5zb3J0KGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRbMF0tZVswXX0pLmZvckVhY2goZnVuY3Rpb24odCl7ZS5fb2Zmc2V0cy5wdXNoKHRbMF0pLGUuX3RhcmdldHMucHVzaCh0WzFdKX0pfSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdCh0aGlzLl9zY3JvbGxFbGVtZW50KS5vZmYobCksdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX3Njcm9sbEVsZW1lbnQ9bnVsbCx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9zZWxlY3Rvcj1udWxsLHRoaXMuX29mZnNldHM9bnVsbCx0aGlzLl90YXJnZXRzPW51bGwsdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdGhpcy5fc2Nyb2xsSGVpZ2h0PW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7aWYobj10LmV4dGVuZCh7fSx1LG4pLFwic3RyaW5nXCIhPXR5cGVvZiBuLnRhcmdldCl7dmFyIGk9dChuLnRhcmdldCkuYXR0cihcImlkXCIpO2l8fChpPXIuZ2V0VUlEKGUpLHQobi50YXJnZXQpLmF0dHIoXCJpZFwiLGkpKSxuLnRhcmdldD1cIiNcIitpfXJldHVybiByLnR5cGVDaGVja0NvbmZpZyhlLG4sZCksbn0saC5wcm90b3R5cGUuX2dldFNjcm9sbFRvcD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50PT09d2luZG93P3RoaXMuX3Njcm9sbEVsZW1lbnQucGFnZVlPZmZzZXQ6dGhpcy5fc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3B9LGgucHJvdG90eXBlLl9nZXRTY3JvbGxIZWlnaHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudC5zY3JvbGxIZWlnaHR8fE1hdGgubWF4KGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0LGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpfSxoLnByb3RvdHlwZS5fZ2V0T2Zmc2V0SGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQ9PT13aW5kb3c/d2luZG93LmlubmVySGVpZ2h0OnRoaXMuX3Njcm9sbEVsZW1lbnQub2Zmc2V0SGVpZ2h0fSxoLnByb3RvdHlwZS5fcHJvY2Vzcz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2dldFNjcm9sbFRvcCgpK3RoaXMuX2NvbmZpZy5vZmZzZXQsZT10aGlzLl9nZXRTY3JvbGxIZWlnaHQoKSxuPXRoaXMuX2NvbmZpZy5vZmZzZXQrZS10aGlzLl9nZXRPZmZzZXRIZWlnaHQoKTtpZih0aGlzLl9zY3JvbGxIZWlnaHQhPT1lJiZ0aGlzLnJlZnJlc2goKSx0Pj1uKXt2YXIgaT10aGlzLl90YXJnZXRzW3RoaXMuX3RhcmdldHMubGVuZ3RoLTFdO3JldHVybiB2b2lkKHRoaXMuX2FjdGl2ZVRhcmdldCE9PWkmJnRoaXMuX2FjdGl2YXRlKGkpKX1pZih0aGlzLl9hY3RpdmVUYXJnZXQmJnQ8dGhpcy5fb2Zmc2V0c1swXSYmdGhpcy5fb2Zmc2V0c1swXT4wKXJldHVybiB0aGlzLl9hY3RpdmVUYXJnZXQ9bnVsbCx2b2lkIHRoaXMuX2NsZWFyKCk7Zm9yKHZhciBvPXRoaXMuX29mZnNldHMubGVuZ3RoO28tLTspe3ZhciByPXRoaXMuX2FjdGl2ZVRhcmdldCE9PXRoaXMuX3RhcmdldHNbb10mJnQ+PXRoaXMuX29mZnNldHNbb10mJih2b2lkIDA9PT10aGlzLl9vZmZzZXRzW28rMV18fHQ8dGhpcy5fb2Zmc2V0c1tvKzFdKTtyJiZ0aGlzLl9hY3RpdmF0ZSh0aGlzLl90YXJnZXRzW29dKX19LGgucHJvdG90eXBlLl9hY3RpdmF0ZT1mdW5jdGlvbihlKXt0aGlzLl9hY3RpdmVUYXJnZXQ9ZSx0aGlzLl9jbGVhcigpO3ZhciBuPXRoaXMuX3NlbGVjdG9yLnNwbGl0KFwiLFwiKTtuPW4ubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0KydbZGF0YS10YXJnZXQ9XCInK2UrJ1wiXSwnKyh0KydbaHJlZj1cIicrZSsnXCJdJyl9KTt2YXIgaT10KG4uam9pbihcIixcIikpO2kuaGFzQ2xhc3MoXy5EUk9QRE9XTl9JVEVNKT8oaS5jbG9zZXN0KGcuRFJPUERPV04pLmZpbmQoZy5EUk9QRE9XTl9UT0dHTEUpLmFkZENsYXNzKF8uQUNUSVZFKSxpLmFkZENsYXNzKF8uQUNUSVZFKSk6aS5wYXJlbnRzKGcuTEkpLmZpbmQoXCI+IFwiK2cuTkFWX0xJTktTKS5hZGRDbGFzcyhfLkFDVElWRSksdCh0aGlzLl9zY3JvbGxFbGVtZW50KS50cmlnZ2VyKGYuQUNUSVZBVEUse3JlbGF0ZWRUYXJnZXQ6ZX0pfSxoLnByb3RvdHlwZS5fY2xlYXI9ZnVuY3Rpb24oKXt0KHRoaXMuX3NlbGVjdG9yKS5maWx0ZXIoZy5BQ1RJVkUpLnJlbW92ZUNsYXNzKF8uQUNUSVZFKX0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLmRhdGEoYSksbz1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmU7XG5pZihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09bltlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtuW2VdKCl9fSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdX19XSksaH0oKTtyZXR1cm4gdCh3aW5kb3cpLm9uKGYuTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe2Zvcih2YXIgZT10Lm1ha2VBcnJheSh0KGcuREFUQV9TUFkpKSxuPWUubGVuZ3RoO24tLTspe3ZhciBpPXQoZVtuXSk7bS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoaSxpLmRhdGEoKSl9fSksdC5mbltlXT1tLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1tLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwidGFiXCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMudGFiXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0xNTAsdT17SElERTpcImhpZGVcIithLEhJRERFTjpcImhpZGRlblwiK2EsU0hPVzpcInNob3dcIithLFNIT1dOOlwic2hvd25cIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGQ9e0RST1BET1dOX01FTlU6XCJkcm9wZG93bi1tZW51XCIsQUNUSVZFOlwiYWN0aXZlXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sZj17QTpcImFcIixMSTpcImxpXCIsRFJPUERPV046XCIuZHJvcGRvd25cIixMSVNUOlwidWw6bm90KC5kcm9wZG93bi1tZW51KSwgb2w6bm90KC5kcm9wZG93bi1tZW51KSwgbmF2Om5vdCguZHJvcGRvd24tbWVudSlcIixGQURFX0NISUxEOlwiPiAubmF2LWl0ZW0gLmZhZGUsID4gLmZhZGVcIixBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0NISUxEOlwiPiAubmF2LWl0ZW0gPiAuYWN0aXZlLCA+IC5hY3RpdmVcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwidGFiXCJdLCBbZGF0YS10b2dnbGU9XCJwaWxsXCJdJyxEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCIsRFJPUERPV05fQUNUSVZFX0NISUxEOlwiPiAuZHJvcGRvd24tbWVudSAuYWN0aXZlXCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKCEodGhpcy5fZWxlbWVudC5wYXJlbnROb2RlJiZ0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhkLkFDVElWRSl8fHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZC5ESVNBQkxFRCkpKXt2YXIgbj12b2lkIDAsaT12b2lkIDAsbz10KHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoZi5MSVNUKVswXSxzPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtvJiYoaT10Lm1ha2VBcnJheSh0KG8pLmZpbmQoZi5BQ1RJVkUpKSxpPWlbaS5sZW5ndGgtMV0pO3ZhciBhPXQuRXZlbnQodS5ISURFLHtyZWxhdGVkVGFyZ2V0OnRoaXMuX2VsZW1lbnR9KSxsPXQuRXZlbnQodS5TSE9XLHtyZWxhdGVkVGFyZ2V0Oml9KTtpZihpJiZ0KGkpLnRyaWdnZXIoYSksdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGwpLCFsLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYhYS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7cyYmKG49dChzKVswXSksdGhpcy5fYWN0aXZhdGUodGhpcy5fZWxlbWVudCxvKTt2YXIgaD1mdW5jdGlvbigpe3ZhciBuPXQuRXZlbnQodS5ISURERU4se3JlbGF0ZWRUYXJnZXQ6ZS5fZWxlbWVudH0pLG89dC5FdmVudCh1LlNIT1dOLHtyZWxhdGVkVGFyZ2V0Oml9KTt0KGkpLnRyaWdnZXIobiksdChlLl9lbGVtZW50KS50cmlnZ2VyKG8pfTtuP3RoaXMuX2FjdGl2YXRlKG4sbi5wYXJlbnROb2RlLGgpOmgoKX19fSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50LHMpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2FjdGl2YXRlPWZ1bmN0aW9uKGUsbixpKXt2YXIgbz10aGlzLHM9dChuKS5maW5kKGYuQUNUSVZFX0NISUxEKVswXSxhPWkmJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihzJiZ0KHMpLmhhc0NsYXNzKGQuRkFERSl8fEJvb2xlYW4odChuKS5maW5kKGYuRkFERV9DSElMRClbMF0pKSxsPWZ1bmN0aW9uKCl7cmV0dXJuIG8uX3RyYW5zaXRpb25Db21wbGV0ZShlLHMsYSxpKX07cyYmYT90KHMpLm9uZShyLlRSQU5TSVRJT05fRU5ELGwpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpOmwoKSxzJiZ0KHMpLnJlbW92ZUNsYXNzKGQuU0hPVyl9LGUucHJvdG90eXBlLl90cmFuc2l0aW9uQ29tcGxldGU9ZnVuY3Rpb24oZSxuLGksbyl7aWYobil7dChuKS5yZW1vdmVDbGFzcyhkLkFDVElWRSk7dmFyIHM9dChuLnBhcmVudE5vZGUpLmZpbmQoZi5EUk9QRE9XTl9BQ1RJVkVfQ0hJTEQpWzBdO3MmJnQocykucmVtb3ZlQ2xhc3MoZC5BQ1RJVkUpLG4uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKX1pZih0KGUpLmFkZENsYXNzKGQuQUNUSVZFKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksaT8oci5yZWZsb3coZSksdChlKS5hZGRDbGFzcyhkLlNIT1cpKTp0KGUpLnJlbW92ZUNsYXNzKGQuRkFERSksZS5wYXJlbnROb2RlJiZ0KGUucGFyZW50Tm9kZSkuaGFzQ2xhc3MoZC5EUk9QRE9XTl9NRU5VKSl7dmFyIGE9dChlKS5jbG9zZXN0KGYuRFJPUERPV04pWzBdO2EmJnQoYSkuZmluZChmLkRST1BET1dOX1RPR0dMRSkuYWRkQ2xhc3MoZC5BQ1RJVkUpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKX1vJiZvKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtpZihvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PW9bbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7b1tuXSgpfX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxmLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKSxfLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KHRoaXMpLFwic2hvd1wiKX0pLHQuZm5bZV09Xy5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9Xyx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLF8uX2pRdWVyeUludGVyZmFjZX0sX30oalF1ZXJ5KSxmdW5jdGlvbih0KXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgVGV0aGVyKXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCB0b29sdGlwcyByZXF1aXJlIFRldGhlciAoaHR0cDovL3RldGhlci5pby8pXCIpO3ZhciBlPVwidG9vbHRpcFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLnRvb2x0aXBcIixsPVwiLlwiK2EsaD10LmZuW2VdLGM9MTUwLHU9XCJicy10ZXRoZXJcIixkPXthbmltYXRpb246ITAsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsdHJpZ2dlcjpcImhvdmVyIGZvY3VzXCIsdGl0bGU6XCJcIixkZWxheTowLGh0bWw6ITEsc2VsZWN0b3I6ITEscGxhY2VtZW50OlwidG9wXCIsb2Zmc2V0OlwiMCAwXCIsY29uc3RyYWludHM6W10sY29udGFpbmVyOiExfSxmPXthbmltYXRpb246XCJib29sZWFuXCIsdGVtcGxhdGU6XCJzdHJpbmdcIix0aXRsZTpcIihzdHJpbmd8ZWxlbWVudHxmdW5jdGlvbilcIix0cmlnZ2VyOlwic3RyaW5nXCIsZGVsYXk6XCIobnVtYmVyfG9iamVjdClcIixodG1sOlwiYm9vbGVhblwiLHNlbGVjdG9yOlwiKHN0cmluZ3xib29sZWFuKVwiLHBsYWNlbWVudDpcIihzdHJpbmd8ZnVuY3Rpb24pXCIsb2Zmc2V0Olwic3RyaW5nXCIsY29uc3RyYWludHM6XCJhcnJheVwiLGNvbnRhaW5lcjpcIihzdHJpbmd8ZWxlbWVudHxib29sZWFuKVwifSxfPXtUT1A6XCJib3R0b20gY2VudGVyXCIsUklHSFQ6XCJtaWRkbGUgbGVmdFwiLEJPVFRPTTpcInRvcCBjZW50ZXJcIixMRUZUOlwibWlkZGxlIHJpZ2h0XCJ9LGc9e1NIT1c6XCJzaG93XCIsT1VUOlwib3V0XCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxJTlNFUlRFRDpcImluc2VydGVkXCIrbCxDTElDSzpcImNsaWNrXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsRk9DVVNPVVQ6XCJmb2N1c291dFwiK2wsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitsLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrbH0sbT17RkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtUT09MVElQOlwiLnRvb2x0aXBcIixUT09MVElQX0lOTkVSOlwiLnRvb2x0aXAtaW5uZXJcIn0sdj17ZWxlbWVudDohMSxlbmFibGVkOiExfSxUPXtIT1ZFUjpcImhvdmVyXCIsRk9DVVM6XCJmb2N1c1wiLENMSUNLOlwiY2xpY2tcIixNQU5VQUw6XCJtYW51YWxcIn0sST1mdW5jdGlvbigpe2Z1bmN0aW9uIGgodCxlKXtuKHRoaXMsaCksdGhpcy5faXNFbmFibGVkPSEwLHRoaXMuX3RpbWVvdXQ9MCx0aGlzLl9ob3ZlclN0YXRlPVwiXCIsdGhpcy5fYWN0aXZlVHJpZ2dlcj17fSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fdGV0aGVyPW51bGwsdGhpcy5lbGVtZW50PXQsdGhpcy5jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGUpLHRoaXMudGlwPW51bGwsdGhpcy5fc2V0TGlzdGVuZXJzKCl9cmV0dXJuIGgucHJvdG90eXBlLmVuYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMH0saC5wcm90b3R5cGUuZGlzYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMX0saC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZD1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hdGhpcy5faXNFbmFibGVkfSxoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIG49dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSxpPXQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKG4pO2l8fChpPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShuLGkpKSxpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrPSFpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrLGkuX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKT9pLl9lbnRlcihudWxsLGkpOmkuX2xlYXZlKG51bGwsaSl9ZWxzZXtpZih0KHRoaXMuZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpKXJldHVybiB2b2lkIHRoaXMuX2xlYXZlKG51bGwsdGhpcyk7dGhpcy5fZW50ZXIobnVsbCx0aGlzKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCksdGhpcy5jbGVhbnVwVGV0aGVyKCksdC5yZW1vdmVEYXRhKHRoaXMuZWxlbWVudCx0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZKSx0KHRoaXMuZWxlbWVudCkub2ZmKHRoaXMuY29uc3RydWN0b3IuRVZFTlRfS0VZKSx0KHRoaXMuZWxlbWVudCkuY2xvc2VzdChcIi5tb2RhbFwiKS5vZmYoXCJoaWRlLmJzLm1vZGFsXCIpLHRoaXMudGlwJiZ0KHRoaXMudGlwKS5yZW1vdmUoKSx0aGlzLl9pc0VuYWJsZWQ9bnVsbCx0aGlzLl90aW1lb3V0PW51bGwsdGhpcy5faG92ZXJTdGF0ZT1udWxsLHRoaXMuX2FjdGl2ZVRyaWdnZXI9bnVsbCx0aGlzLl90ZXRoZXI9bnVsbCx0aGlzLmVsZW1lbnQ9bnVsbCx0aGlzLmNvbmZpZz1udWxsLHRoaXMudGlwPW51bGx9LGgucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKFwibm9uZVwiPT09dCh0aGlzLmVsZW1lbnQpLmNzcyhcImRpc3BsYXlcIikpdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIHVzZSBzaG93IG9uIHZpc2libGUgZWxlbWVudHNcIik7dmFyIG49dC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1cpO2lmKHRoaXMuaXNXaXRoQ29udGVudCgpJiZ0aGlzLl9pc0VuYWJsZWQpe2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJUb29sdGlwIGlzIHRyYW5zaXRpb25pbmdcIik7dCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIobik7dmFyIGk9dC5jb250YWlucyh0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsdGhpcy5lbGVtZW50KTtpZihuLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwhaSlyZXR1cm47dmFyIG89dGhpcy5nZXRUaXBFbGVtZW50KCkscz1yLmdldFVJRCh0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO28uc2V0QXR0cmlidXRlKFwiaWRcIixzKSx0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLHMpLHRoaXMuc2V0Q29udGVudCgpLHRoaXMuY29uZmlnLmFuaW1hdGlvbiYmdChvKS5hZGRDbGFzcyhtLkZBREUpO3ZhciBhPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLnBsYWNlbWVudD90aGlzLmNvbmZpZy5wbGFjZW1lbnQuY2FsbCh0aGlzLG8sdGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy5wbGFjZW1lbnQsbD10aGlzLl9nZXRBdHRhY2htZW50KGEpLGM9dGhpcy5jb25maWcuY29udGFpbmVyPT09ITE/ZG9jdW1lbnQuYm9keTp0KHRoaXMuY29uZmlnLmNvbnRhaW5lcik7dChvKS5kYXRhKHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVksdGhpcykuYXBwZW5kVG8oYyksdCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5JTlNFUlRFRCksdGhpcy5fdGV0aGVyPW5ldyBUZXRoZXIoe2F0dGFjaG1lbnQ6bCxlbGVtZW50Om8sdGFyZ2V0OnRoaXMuZWxlbWVudCxjbGFzc2VzOnYsY2xhc3NQcmVmaXg6dSxvZmZzZXQ6dGhpcy5jb25maWcub2Zmc2V0LGNvbnN0cmFpbnRzOnRoaXMuY29uZmlnLmNvbnN0cmFpbnRzLGFkZFRhcmdldENsYXNzZXM6ITF9KSxyLnJlZmxvdyhvKSx0aGlzLl90ZXRoZXIucG9zaXRpb24oKSx0KG8pLmFkZENsYXNzKG0uU0hPVyk7dmFyIGQ9ZnVuY3Rpb24oKXt2YXIgbj1lLl9ob3ZlclN0YXRlO2UuX2hvdmVyU3RhdGU9bnVsbCxlLl9pc1RyYW5zaXRpb25pbmc9ITEsdChlLmVsZW1lbnQpLnRyaWdnZXIoZS5jb25zdHJ1Y3Rvci5FdmVudC5TSE9XTiksbj09PWcuT1VUJiZlLl9sZWF2ZShudWxsLGUpfTtpZihyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMudGlwKS5oYXNDbGFzcyhtLkZBREUpKXJldHVybiB0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITAsdm9pZCB0KHRoaXMudGlwKS5vbmUoci5UUkFOU0lUSU9OX0VORCxkKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChoLl9UUkFOU0lUSU9OX0RVUkFUSU9OKTtkKCl9fSxoLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT10aGlzLmdldFRpcEVsZW1lbnQoKSxvPXQuRXZlbnQodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5ISURFKTtpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiVG9vbHRpcCBpcyB0cmFuc2l0aW9uaW5nXCIpO3ZhciBzPWZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZSE9PWcuU0hPVyYmaS5wYXJlbnROb2RlJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSksbi5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiksdChuLmVsZW1lbnQpLnRyaWdnZXIobi5jb25zdHJ1Y3Rvci5FdmVudC5ISURERU4pLG4uX2lzVHJhbnNpdGlvbmluZz0hMSxuLmNsZWFudXBUZXRoZXIoKSxlJiZlKCl9O3QodGhpcy5lbGVtZW50KS50cmlnZ2VyKG8pLG8uaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0KGkpLnJlbW92ZUNsYXNzKG0uU0hPVyksdGhpcy5fYWN0aXZlVHJpZ2dlcltULkNMSUNLXT0hMSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuRk9DVVNdPSExLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5IT1ZFUl09ITEsci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLnRpcCkuaGFzQ2xhc3MobS5GQURFKT8odGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwLHQoaSkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoYykpOnMoKSx0aGlzLl9ob3ZlclN0YXRlPVwiXCIpfSxoLnByb3RvdHlwZS5pc1dpdGhDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4odGhpcy5nZXRUaXRsZSgpKX0saC5wcm90b3R5cGUuZ2V0VGlwRWxlbWVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpcD10aGlzLnRpcHx8dCh0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF19LGgucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuZ2V0VGlwRWxlbWVudCgpKTt0aGlzLnNldEVsZW1lbnRDb250ZW50KGUuZmluZChFLlRPT0xUSVBfSU5ORVIpLHRoaXMuZ2V0VGl0bGUoKSksZS5yZW1vdmVDbGFzcyhtLkZBREUrXCIgXCIrbS5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0saC5wcm90b3R5cGUuc2V0RWxlbWVudENvbnRlbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgbz10aGlzLmNvbmZpZy5odG1sO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIG4/XCJ1bmRlZmluZWRcIjppKG4pKSYmKG4ubm9kZVR5cGV8fG4uanF1ZXJ5KT9vP3QobikucGFyZW50KCkuaXMoZSl8fGUuZW1wdHkoKS5hcHBlbmQobik6ZS50ZXh0KHQobikudGV4dCgpKTplW28/XCJodG1sXCI6XCJ0ZXh0XCJdKG4pfSxoLnByb3RvdHlwZS5nZXRUaXRsZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpO3JldHVybiB0fHwodD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy50aXRsZT90aGlzLmNvbmZpZy50aXRsZS5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcudGl0bGUpLHR9LGgucHJvdG90eXBlLmNsZWFudXBUZXRoZXI9ZnVuY3Rpb24oKXt0aGlzLl90ZXRoZXImJnRoaXMuX3RldGhlci5kZXN0cm95KCl9LGgucHJvdG90eXBlLl9nZXRBdHRhY2htZW50PWZ1bmN0aW9uKHQpe3JldHVybiBfW3QudG9VcHBlckNhc2UoKV19LGgucHJvdG90eXBlLl9zZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5jb25maWcudHJpZ2dlci5zcGxpdChcIiBcIik7bi5mb3JFYWNoKGZ1bmN0aW9uKG4pe2lmKFwiY2xpY2tcIj09PW4pdChlLmVsZW1lbnQpLm9uKGUuY29uc3RydWN0b3IuRXZlbnQuQ0xJQ0ssZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUudG9nZ2xlKHQpfSk7ZWxzZSBpZihuIT09VC5NQU5VQUwpe3ZhciBpPW49PT1ULkhPVkVSP2UuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VFTlRFUjplLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTSU4sbz1uPT09VC5IT1ZFUj9lLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFTEVBVkU6ZS5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU09VVDt0KGUuZWxlbWVudCkub24oaSxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS5fZW50ZXIodCl9KS5vbihvLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9sZWF2ZSh0KX0pfXQoZS5lbGVtZW50KS5jbG9zZXN0KFwiLm1vZGFsXCIpLm9uKFwiaGlkZS5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGUuaGlkZSgpfSl9KSx0aGlzLmNvbmZpZy5zZWxlY3Rvcj90aGlzLmNvbmZpZz10LmV4dGVuZCh7fSx0aGlzLmNvbmZpZyx7dHJpZ2dlcjpcIm1hbnVhbFwiLHNlbGVjdG9yOlwiXCJ9KTp0aGlzLl9maXhUaXRsZSgpfSxoLnByb3RvdHlwZS5fZml4VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD1pKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKTsodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInRpdGxlXCIpfHxcInN0cmluZ1wiIT09dCkmJih0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiLHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKXx8XCJcIiksdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsXCJcIikpfSxoLnByb3RvdHlwZS5fZW50ZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO3JldHVybiBuPW58fHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGkpLG58fChuPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpLG4pKSxlJiYobi5fYWN0aXZlVHJpZ2dlcltcImZvY3VzaW5cIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSEwKSx0KG4uZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpfHxuLl9ob3ZlclN0YXRlPT09Zy5TSE9XP3ZvaWQobi5faG92ZXJTdGF0ZT1nLlNIT1cpOihjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLlNIT1csbi5jb25maWcuZGVsYXkmJm4uY29uZmlnLmRlbGF5LnNob3c/dm9pZChuLl90aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlPT09Zy5TSE9XJiZuLnNob3coKX0sbi5jb25maWcuZGVsYXkuc2hvdykpOnZvaWQgbi5zaG93KCkpfSxoLnByb3RvdHlwZS5fbGVhdmU9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO2lmKG49bnx8dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSksbnx8KG49bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGksbikpLGUmJihuLl9hY3RpdmVUcmlnZ2VyW1wiZm9jdXNvdXRcIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSExKSwhbi5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKXJldHVybiBjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLk9VVCxuLmNvbmZpZy5kZWxheSYmbi5jb25maWcuZGVsYXkuaGlkZT92b2lkKG4uX3RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe24uX2hvdmVyU3RhdGU9PT1nLk9VVCYmbi5oaWRlKCl9LG4uY29uZmlnLmRlbGF5LmhpZGUpKTp2b2lkIG4uaGlkZSgpfSxoLnByb3RvdHlwZS5faXNXaXRoQWN0aXZlVHJpZ2dlcj1mdW5jdGlvbigpe2Zvcih2YXIgdCBpbiB0aGlzLl9hY3RpdmVUcmlnZ2VyKWlmKHRoaXMuX2FjdGl2ZVRyaWdnZXJbdF0pcmV0dXJuITA7cmV0dXJuITF9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LHQodGhpcy5lbGVtZW50KS5kYXRhKCksbiksbi5kZWxheSYmXCJudW1iZXJcIj09dHlwZW9mIG4uZGVsYXkmJihuLmRlbGF5PXtzaG93Om4uZGVsYXksaGlkZTpuLmRlbGF5fSksci50eXBlQ2hlY2tDb25maWcoZSxuLHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGUpLG59LGgucHJvdG90eXBlLl9nZXREZWxlZ2F0ZUNvbmZpZz1mdW5jdGlvbigpe3ZhciB0PXt9O2lmKHRoaXMuY29uZmlnKWZvcih2YXIgZSBpbiB0aGlzLmNvbmZpZyl0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRbZV0hPT10aGlzLmNvbmZpZ1tlXSYmKHRbZV09dGhpcy5jb25maWdbZV0pO3JldHVybiB0fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZTtpZigobnx8IS9kaXNwb3NlfGhpZGUvLnRlc3QoZSkpJiYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpKXtpZih2b2lkIDA9PT1uW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO25bZV0oKX19KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBhfX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksaH0oKTtyZXR1cm4gdC5mbltlXT1JLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1JLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsSS5falF1ZXJ5SW50ZXJmYWNlfSxJfShqUXVlcnkpKTsoZnVuY3Rpb24ocil7dmFyIGE9XCJwb3BvdmVyXCIsbD1cIjQuMC4wLWFscGhhLjZcIixoPVwiYnMucG9wb3ZlclwiLGM9XCIuXCIraCx1PXIuZm5bYV0sZD1yLmV4dGVuZCh7fSxzLkRlZmF1bHQse3BsYWNlbWVudDpcInJpZ2h0XCIsdHJpZ2dlcjpcImNsaWNrXCIsY29udGVudDpcIlwiLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2Pid9KSxmPXIuZXh0ZW5kKHt9LHMuRGVmYXVsdFR5cGUse2NvbnRlbnQ6XCIoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pXCJ9KSxfPXtGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LGc9e1RJVExFOlwiLnBvcG92ZXItdGl0bGVcIixDT05URU5UOlwiLnBvcG92ZXItY29udGVudFwifSxwPXtISURFOlwiaGlkZVwiK2MsSElEREVOOlwiaGlkZGVuXCIrYyxTSE9XOlwic2hvd1wiK2MsU0hPV046XCJzaG93blwiK2MsSU5TRVJURUQ6XCJpbnNlcnRlZFwiK2MsQ0xJQ0s6XCJjbGlja1wiK2MsRk9DVVNJTjpcImZvY3VzaW5cIitjLEZPQ1VTT1VUOlwiZm9jdXNvdXRcIitjLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrYyxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2N9LG09ZnVuY3Rpb24ocyl7ZnVuY3Rpb24gdSgpe3JldHVybiBuKHRoaXMsdSksdCh0aGlzLHMuYXBwbHkodGhpcyxhcmd1bWVudHMpKX1yZXR1cm4gZSh1LHMpLHUucHJvdG90eXBlLmlzV2l0aENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRUaXRsZSgpfHx0aGlzLl9nZXRDb250ZW50KCl9LHUucHJvdG90eXBlLmdldFRpcEVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aXA9dGhpcy50aXB8fHIodGhpcy5jb25maWcudGVtcGxhdGUpWzBdfSx1LnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIHQ9cih0aGlzLmdldFRpcEVsZW1lbnQoKSk7dGhpcy5zZXRFbGVtZW50Q29udGVudCh0LmZpbmQoZy5USVRMRSksdGhpcy5nZXRUaXRsZSgpKSx0aGlzLnNldEVsZW1lbnRDb250ZW50KHQuZmluZChnLkNPTlRFTlQpLHRoaXMuX2dldENvbnRlbnQoKSksdC5yZW1vdmVDbGFzcyhfLkZBREUrXCIgXCIrXy5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0sdS5wcm90b3R5cGUuX2dldENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29udGVudFwiKXx8KFwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLmNvbnRlbnQ/dGhpcy5jb25maWcuY29udGVudC5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcuY29udGVudCl9LHUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9cih0aGlzKS5kYXRhKGgpLG49XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOmkodCkpP3Q6bnVsbDtpZigoZXx8IS9kZXN0cm95fGhpZGUvLnRlc3QodCkpJiYoZXx8KGU9bmV3IHUodGhpcyxuKSxyKHRoaXMpLmRhdGEoaCxlKSksXCJzdHJpbmdcIj09dHlwZW9mIHQpKXtpZih2b2lkIDA9PT1lW3RdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJyt0KydcIicpO2VbdF0oKX19KX0sbyh1LG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBofX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGN9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksdX0ocyk7cmV0dXJuIHIuZm5bYV09bS5falF1ZXJ5SW50ZXJmYWNlLHIuZm5bYV0uQ29uc3RydWN0b3I9bSxyLmZuW2FdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5mblthXT11LG0uX2pRdWVyeUludGVyZmFjZX0sbX0pKGpRdWVyeSl9KCk7IiwiJCgnLkhhbWJ1cmdlcicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdPcGVuJyk7XG4gICAgJCgnLlN1Yi1oZWFkZXJfYmFyJykudG9nZ2xlQ2xhc3MoJ0hhbWJ1cmdlci1vcGVuJyk7XG4gICAgY29uc29sZS5sb2coJ3RvZ2dsZWQnKVxufSk7IiwiIiwiJCgnc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSBcIm1vZGFsLXRyaWdnZXJcIikge1xuICAgICAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgfVxufSk7IiwiJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHsgICAgXG4gICAgdmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIGlmIChzY3JvbGwgPj0gNTApIHtcbiAgICAgICAgJChcIi5TdWItaGVhZGVyX2JhclwiKS5hZGRDbGFzcyhcIlN0aWNreS1oZWFkZXJcIik7XG4gICAgICAgICQoXCIuSGVhZGVyX2JhclwiKS5hZGRDbGFzcyhcIk9ubHlcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJChcIi5TdWItaGVhZGVyX2JhclwiKS5yZW1vdmVDbGFzcyhcIlN0aWNreS1oZWFkZXJcIik7XG4gICAgICAgICQoXCIuSGVhZGVyX2JhclwiKS5yZW1vdmVDbGFzcyhcIk9ubHlcIik7XG4gICAgfVxufSk7Il19
