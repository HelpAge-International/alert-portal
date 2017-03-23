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

"use strict";

$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
        $(".Sub-header_bar").addClass("Sticky-header");
        $("html").addClass("W-Sticky-nav--enabled");
        $(".Header_bar").addClass("Only");
    } else {
        $(".Sub-header_bar").removeClass("Sticky-header");
        $(".Header_bar").removeClass("Only");
      $("html").removeClass("W-Sticky-nav--enabled");
    }
});

"use strict";

(function($, window, document, undefined) {
    "use strict";
})(jQuery, window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImhhbWJ1cmdlci5qcyIsImlubGluZS1lZGl0YWJsZS5qcyIsIm1vZGFsLXNlbGVjdC10cmlnZ2VyLmpzIiwicmV2ZWFsLXJpYmJvbi5qcyIsInN0aWNreS1uYXYuanMiXSwibmFtZXMiOlsicmVhZFVSTCIsImlucHV0IiwiZmlsZXMiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZSIsIiQiLCJjc3MiLCJ0YXJnZXQiLCJyZXN1bHQiLCJhZGRDbGFzcyIsInJlYWRBc0RhdGFVUkwiLCJjaGFuZ2UiLCJ0aGlzIiwialF1ZXJ5IiwiRXJyb3IiLCJ0IiwiZm4iLCJqcXVlcnkiLCJzcGxpdCIsIlJlZmVyZW5jZUVycm9yIiwiX3R5cGVvZiIsIlR5cGVFcnJvciIsInByb3RvdHlwZSIsIk9iamVjdCIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwidmFsdWUiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsIm4iLCJpIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvIiwibGVuZ3RoIiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJyIiwidG9TdHJpbmciLCJjYWxsIiwibWF0Y2giLCJ0b0xvd2VyQ2FzZSIsIm5vZGVUeXBlIiwiYmluZFR5cGUiLCJhIiwiZW5kIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aW5kb3ciLCJRVW5pdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImgiLCJzdHlsZSIsIm9uZSIsImMiLCJUUkFOU0lUSU9OX0VORCIsInNldFRpbWVvdXQiLCJ0cmlnZ2VyVHJhbnNpdGlvbkVuZCIsInMiLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsInN1cHBvcnRzVHJhbnNpdGlvbkVuZCIsImV2ZW50Iiwic3BlY2lhbCIsImwiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIk9UcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsImdldFVJRCIsIk1hdGgiLCJyYW5kb20iLCJnZXRFbGVtZW50QnlJZCIsImdldFNlbGVjdG9yRnJvbUVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJ0ZXN0IiwicmVmbG93Iiwib2Zmc2V0SGVpZ2h0IiwidHJpZ2dlciIsIkJvb2xlYW4iLCJ0eXBlQ2hlY2tDb25maWciLCJoYXNPd25Qcm9wZXJ0eSIsIlJlZ0V4cCIsInRvVXBwZXJDYXNlIiwidSIsIkRJU01JU1MiLCJkIiwiQ0xPU0UiLCJDTE9TRUQiLCJDTElDS19EQVRBX0FQSSIsImYiLCJBTEVSVCIsIkZBREUiLCJTSE9XIiwiXyIsIl9lbGVtZW50IiwiY2xvc2UiLCJfZ2V0Um9vdEVsZW1lbnQiLCJfdHJpZ2dlckNsb3NlRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJfcmVtb3ZlRWxlbWVudCIsImRpc3Bvc2UiLCJyZW1vdmVEYXRhIiwiY2xvc2VzdCIsIkV2ZW50IiwicmVtb3ZlQ2xhc3MiLCJoYXNDbGFzcyIsIl9kZXN0cm95RWxlbWVudCIsImRldGFjaCIsInJlbW92ZSIsIl9qUXVlcnlJbnRlcmZhY2UiLCJlYWNoIiwiZGF0YSIsIl9oYW5kbGVEaXNtaXNzIiwicHJldmVudERlZmF1bHQiLCJnZXQiLCJvbiIsIkNvbnN0cnVjdG9yIiwibm9Db25mbGljdCIsIkFDVElWRSIsIkJVVFRPTiIsIkZPQ1VTIiwiREFUQV9UT0dHTEVfQ0FSUk9UIiwiREFUQV9UT0dHTEUiLCJJTlBVVCIsIkZPQ1VTX0JMVVJfREFUQV9BUEkiLCJ0b2dnbGUiLCJmaW5kIiwidHlwZSIsImNoZWNrZWQiLCJmb2N1cyIsInNldEF0dHJpYnV0ZSIsInRvZ2dsZUNsYXNzIiwiaW50ZXJ2YWwiLCJrZXlib2FyZCIsInNsaWRlIiwicGF1c2UiLCJ3cmFwIiwiZyIsInAiLCJORVhUIiwiUFJFViIsIkxFRlQiLCJSSUdIVCIsIm0iLCJTTElERSIsIlNMSUQiLCJLRVlET1dOIiwiTU9VU0VFTlRFUiIsIk1PVVNFTEVBVkUiLCJMT0FEX0RBVEFfQVBJIiwiRSIsIkNBUk9VU0VMIiwiSVRFTSIsInYiLCJBQ1RJVkVfSVRFTSIsIk5FWFRfUFJFViIsIklORElDQVRPUlMiLCJEQVRBX1NMSURFIiwiREFUQV9SSURFIiwiVCIsIl9pdGVtcyIsIl9pbnRlcnZhbCIsIl9hY3RpdmVFbGVtZW50IiwiX2lzUGF1c2VkIiwiX2lzU2xpZGluZyIsIl9jb25maWciLCJfZ2V0Q29uZmlnIiwiX2luZGljYXRvcnNFbGVtZW50IiwiX2FkZEV2ZW50TGlzdGVuZXJzIiwibmV4dCIsIl9zbGlkZSIsIm5leHRXaGVuVmlzaWJsZSIsImhpZGRlbiIsInByZXYiLCJQUkVWSU9VUyIsImN5Y2xlIiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwidmlzaWJpbGl0eVN0YXRlIiwiYmluZCIsInRvIiwiX2dldEl0ZW1JbmRleCIsIm9mZiIsImV4dGVuZCIsIl9rZXlkb3duIiwiZG9jdW1lbnRFbGVtZW50IiwidGFnTmFtZSIsIndoaWNoIiwibWFrZUFycmF5IiwicGFyZW50IiwiaW5kZXhPZiIsIl9nZXRJdGVtQnlEaXJlY3Rpb24iLCJfdHJpZ2dlclNsaWRlRXZlbnQiLCJyZWxhdGVkVGFyZ2V0IiwiZGlyZWN0aW9uIiwiX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQiLCJjaGlsZHJlbiIsIl9kYXRhQXBpQ2xpY2tIYW5kbGVyIiwiU0hPV04iLCJISURFIiwiSElEREVOIiwiQ09MTEFQU0UiLCJDT0xMQVBTSU5HIiwiQ09MTEFQU0VEIiwiV0lEVEgiLCJIRUlHSFQiLCJBQ1RJVkVTIiwiX2lzVHJhbnNpdGlvbmluZyIsIl90cmlnZ2VyQXJyYXkiLCJpZCIsIl9wYXJlbnQiLCJfZ2V0UGFyZW50IiwiX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImhpZGUiLCJzaG93IiwiX2dldERpbWVuc2lvbiIsImF0dHIiLCJzZXRUcmFuc2l0aW9uaW5nIiwic2xpY2UiLCJfZ2V0VGFyZ2V0RnJvbUVsZW1lbnQiLCJDTElDSyIsIkZPQ1VTSU5fREFUQV9BUEkiLCJLRVlET1dOX0RBVEFfQVBJIiwiQkFDS0RST1AiLCJESVNBQkxFRCIsIkZPUk1fQ0hJTEQiLCJST0xFX01FTlUiLCJST0xFX0xJU1RCT1giLCJOQVZCQVJfTkFWIiwiVklTSUJMRV9JVEVNUyIsImRpc2FibGVkIiwiX2dldFBhcmVudEZyb21FbGVtZW50IiwiX2NsZWFyTWVudXMiLCJjbGFzc05hbWUiLCJpbnNlcnRCZWZvcmUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjb250YWlucyIsIl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJiYWNrZHJvcCIsIkZPQ1VTSU4iLCJSRVNJWkUiLCJDTElDS19ESVNNSVNTIiwiS0VZRE9XTl9ESVNNSVNTIiwiTU9VU0VVUF9ESVNNSVNTIiwiTU9VU0VET1dOX0RJU01JU1MiLCJTQ1JPTExCQVJfTUVBU1VSRVIiLCJPUEVOIiwiRElBTE9HIiwiREFUQV9ESVNNSVNTIiwiRklYRURfQ09OVEVOVCIsIl9kaWFsb2ciLCJfYmFja2Ryb3AiLCJfaXNTaG93biIsIl9pc0JvZHlPdmVyZmxvd2luZyIsIl9pZ25vcmVCYWNrZHJvcENsaWNrIiwiX29yaWdpbmFsQm9keVBhZGRpbmciLCJfc2Nyb2xsYmFyV2lkdGgiLCJfY2hlY2tTY3JvbGxiYXIiLCJfc2V0U2Nyb2xsYmFyIiwiYm9keSIsIl9zZXRFc2NhcGVFdmVudCIsIl9zZXRSZXNpemVFdmVudCIsIl9zaG93QmFja2Ryb3AiLCJfc2hvd0VsZW1lbnQiLCJfaGlkZU1vZGFsIiwiTm9kZSIsIkVMRU1FTlRfTk9ERSIsImFwcGVuZENoaWxkIiwiZGlzcGxheSIsInJlbW92ZUF0dHJpYnV0ZSIsInNjcm9sbFRvcCIsIl9lbmZvcmNlRm9jdXMiLCJoYXMiLCJfaGFuZGxlVXBkYXRlIiwiX3Jlc2V0QWRqdXN0bWVudHMiLCJfcmVzZXRTY3JvbGxiYXIiLCJfcmVtb3ZlQmFja2Ryb3AiLCJhcHBlbmRUbyIsImN1cnJlbnRUYXJnZXQiLCJfYWRqdXN0RGlhbG9nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJjbGllbnRXaWR0aCIsImlubmVyV2lkdGgiLCJfZ2V0U2Nyb2xsYmFyV2lkdGgiLCJwYXJzZUludCIsIm9mZnNldFdpZHRoIiwiRGVmYXVsdCIsIm9mZnNldCIsIm1ldGhvZCIsIkFDVElWQVRFIiwiU0NST0xMIiwiRFJPUERPV05fSVRFTSIsIkRST1BET1dOX01FTlUiLCJOQVZfTElOSyIsIk5BViIsIkRBVEFfU1BZIiwiTElTVF9JVEVNIiwiTEkiLCJMSV9EUk9QRE9XTiIsIk5BVl9MSU5LUyIsIkRST1BET1dOIiwiRFJPUERPV05fSVRFTVMiLCJEUk9QRE9XTl9UT0dHTEUiLCJPRkZTRVQiLCJQT1NJVElPTiIsIl9zY3JvbGxFbGVtZW50IiwiX3NlbGVjdG9yIiwiX29mZnNldHMiLCJfdGFyZ2V0cyIsIl9hY3RpdmVUYXJnZXQiLCJfc2Nyb2xsSGVpZ2h0IiwiX3Byb2Nlc3MiLCJyZWZyZXNoIiwiX2dldFNjcm9sbFRvcCIsIl9nZXRTY3JvbGxIZWlnaHQiLCJtYXAiLCJ0b3AiLCJmaWx0ZXIiLCJzb3J0IiwiZm9yRWFjaCIsInB1c2giLCJwYWdlWU9mZnNldCIsIm1heCIsIl9nZXRPZmZzZXRIZWlnaHQiLCJpbm5lckhlaWdodCIsIl9hY3RpdmF0ZSIsIl9jbGVhciIsImpvaW4iLCJwYXJlbnRzIiwiQSIsIkxJU1QiLCJGQURFX0NISUxEIiwiQUNUSVZFX0NISUxEIiwiRFJPUERPV05fQUNUSVZFX0NISUxEIiwiX3RyYW5zaXRpb25Db21wbGV0ZSIsIlRldGhlciIsImFuaW1hdGlvbiIsInRlbXBsYXRlIiwidGl0bGUiLCJkZWxheSIsImh0bWwiLCJzZWxlY3RvciIsInBsYWNlbWVudCIsImNvbnN0cmFpbnRzIiwiY29udGFpbmVyIiwiVE9QIiwiQk9UVE9NIiwiT1VUIiwiSU5TRVJURUQiLCJGT0NVU09VVCIsIlRPT0xUSVAiLCJUT09MVElQX0lOTkVSIiwiZWxlbWVudCIsImVuYWJsZWQiLCJIT1ZFUiIsIk1BTlVBTCIsIkkiLCJfaXNFbmFibGVkIiwiX3RpbWVvdXQiLCJfaG92ZXJTdGF0ZSIsIl9hY3RpdmVUcmlnZ2VyIiwiX3RldGhlciIsImNvbmZpZyIsInRpcCIsIl9zZXRMaXN0ZW5lcnMiLCJlbmFibGUiLCJkaXNhYmxlIiwidG9nZ2xlRW5hYmxlZCIsIkRBVEFfS0VZIiwiX2dldERlbGVnYXRlQ29uZmlnIiwiY2xpY2siLCJfaXNXaXRoQWN0aXZlVHJpZ2dlciIsIl9lbnRlciIsIl9sZWF2ZSIsImdldFRpcEVsZW1lbnQiLCJjbGVhclRpbWVvdXQiLCJjbGVhbnVwVGV0aGVyIiwiRVZFTlRfS0VZIiwiaXNXaXRoQ29udGVudCIsIm93bmVyRG9jdW1lbnQiLCJOQU1FIiwic2V0Q29udGVudCIsIl9nZXRBdHRhY2htZW50IiwiYXR0YWNobWVudCIsImNsYXNzZXMiLCJjbGFzc1ByZWZpeCIsImFkZFRhcmdldENsYXNzZXMiLCJwb3NpdGlvbiIsIl9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiZ2V0VGl0bGUiLCJzZXRFbGVtZW50Q29udGVudCIsImVtcHR5IiwiYXBwZW5kIiwidGV4dCIsImRlc3Ryb3kiLCJfZml4VGl0bGUiLCJEZWZhdWx0VHlwZSIsImNvbnRlbnQiLCJUSVRMRSIsIkNPTlRFTlQiLCJfZ2V0Q29udGVudCIsImNvbnNvbGUiLCJsb2ciLCJ2YWwiLCJtb2RhbCIsInNjcm9sbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxRQUFRQztJQUNmLElBQUlBLE1BQU1DLFNBQVNELE1BQU1DLE1BQU0sSUFBSTtRQUMvQixJQUFJQyxTQUFTLElBQUlDO1FBRWpCRCxPQUFPRSxTQUFTLFNBQVVDO1lBQ3RCQyxFQUFFLG1CQUFtQkMsSUFBSSxvQkFBb0IsU0FBU0YsRUFBRUcsT0FBT0MsU0FBUztZQUN4RUgsRUFBRSxtQkFBbUJJLFNBQVM7O1FBR2xDUixPQUFPUyxjQUFjWCxNQUFNQyxNQUFNOzs7O0FBSXZDSyxFQUFF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OztnQkFBS1IsS0FBSTtnQkFBV29GLEtBQUksU0FBQUE7b0JBQVcsT0FBTy9EOzs7Z0JBQUtyQixLQUFJO2dCQUFRb0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPd0I7OztnQkFBSzVHLEtBQUk7Z0JBQVlvRixLQUFJLFNBQUFBO29CQUFXLE9BQU81RDs7O2dCQUFLeEIsS0FBSTtnQkFBY29GLEtBQUksU0FBQUE7b0JBQVcsT0FBT3pCOztrQkFBTU47VUFBR3pCO1FBQUcsT0FBTzNCLEVBQUV4QixHQUFHK0IsS0FBR3lHLEVBQUVsQyxrQkFBaUI5RSxFQUFFeEIsR0FBRytCLEdBQUc4RSxjQUFZMkIsR0FBRWhILEVBQUV4QixHQUFHK0IsR0FBRytFLGFBQVc7WUFBVyxPQUFPdEYsRUFBRXhCLEdBQUcrQixLQUFHNkMsR0FBRTRELEVBQUVsQztXQUFrQmtDO09BQUkzSTs7Ozs7QUNOcC9iUixFQUFFLGNBQWMyWCxNQUFNO0lBQ2xCM1gsRUFBRU8sTUFBTWdJLFlBQVk7SUFDcEJ2SSxFQUFFLG1CQUFtQnVJLFlBQVk7SUFDakNtUixRQUFRQyxJQUFJOzs7QUNIaEI7Ozs7QUNBQTNaLEVBQUUsVUFBVU0sT0FBTztJQUNmLElBQUlOLEVBQUVPLE1BQU1xWixTQUFTLGlCQUFpQjtRQUNsQzVaLEVBQUUsWUFBWTZaLE1BQU07Ozs7QUNGNUI7Ozs7QUNBQTdaLEVBQUVtRCxRQUFRMlcsT0FBTztJQUNiLElBQUlBLFNBQVM5WixFQUFFbUQsUUFBUWlPO0lBRXZCLElBQUkwSSxVQUFVLElBQUk7UUFDZDlaLEVBQUUsbUJBQW1CSSxTQUFTO1FBQzlCSixFQUFFLGVBQWVJLFNBQVM7V0FDdkI7UUFDSEosRUFBRSxtQkFBbUI0RyxZQUFZO1FBQ2pDNUcsRUFBRSxlQUFlNEcsWUFBWTs7Ozs7O0NOUG5DLFNBQUE1RyxHQUFBbUQsUUFBSXpELFVBQWVBO0lBQ2Y7R0FJSU0sUUFBQUEsUUFBRXFEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiByZWFkVVJMKGlucHV0KSB7XG4gIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xuICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICBcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICQoJy5BZ2VuY3ktcHJldmlldycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGUudGFyZ2V0LnJlc3VsdCArICcpJyk7XG4gICAgICAgICAgJCgnLkFnZW5jeS1wcmV2aWV3JykuYWRkQ2xhc3MoJ1NlbGVjdGVkJylcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xuICB9XG59XG5cbiQoXCIjaW1nSW5wXCIpLmNoYW5nZShmdW5jdGlvbigpe1xuICByZWFkVVJMKHRoaXMpO1xufSk7IiwiLyohXG4gKiBCb290c3RyYXAgdjQuMC4wLWFscGhhLjYgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbSlcbiAqIENvcHlyaWdodCAyMDExLTIwMTcgVGhlIEJvb3RzdHJhcCBBdXRob3JzIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvZ3JhcGhzL2NvbnRyaWJ1dG9ycylcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKi9cbmlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBqUXVlcnkpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkuIGpRdWVyeSBtdXN0IGJlIGluY2x1ZGVkIGJlZm9yZSBCb290c3RyYXAncyBKYXZhU2NyaXB0LlwiKTsrZnVuY3Rpb24odCl7dmFyIGU9dC5mbi5qcXVlcnkuc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiLlwiKTtpZihlWzBdPDImJmVbMV08OXx8MT09ZVswXSYmOT09ZVsxXSYmZVsyXTwxfHxlWzBdPj00KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgYXQgbGVhc3QgalF1ZXJ5IHYxLjkuMSBidXQgbGVzcyB0aGFuIHY0LjAuMFwiKX0oalF1ZXJ5KSwrZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFlfHxcIm9iamVjdFwiIT10eXBlb2YgZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT90OmV9ZnVuY3Rpb24gZSh0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBlKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LGUpOnQuX19wcm90b19fPWUpfWZ1bmN0aW9uIG4odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LG89ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKSxyPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7cmV0dXJue30udG9TdHJpbmcuY2FsbCh0KS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIG4odCl7cmV0dXJuKHRbMF18fHQpLm5vZGVUeXBlfWZ1bmN0aW9uIGkoKXtyZXR1cm57YmluZFR5cGU6YS5lbmQsZGVsZWdhdGVUeXBlOmEuZW5kLGhhbmRsZTpmdW5jdGlvbihlKXtpZih0KGUudGFyZ2V0KS5pcyh0aGlzKSlyZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fX1mdW5jdGlvbiBvKCl7aWYod2luZG93LlFVbml0KXJldHVybiExO3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib290c3RyYXBcIik7Zm9yKHZhciBlIGluIGgpaWYodm9pZCAwIT09dC5zdHlsZVtlXSlyZXR1cm57ZW5kOmhbZV19O3JldHVybiExfWZ1bmN0aW9uIHIoZSl7dmFyIG49dGhpcyxpPSExO3JldHVybiB0KHRoaXMpLm9uZShjLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKCl7aT0hMH0pLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpfHxjLnRyaWdnZXJUcmFuc2l0aW9uRW5kKG4pfSxlKSx0aGlzfWZ1bmN0aW9uIHMoKXthPW8oKSx0LmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kPXIsYy5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHQuZXZlbnQuc3BlY2lhbFtjLlRSQU5TSVRJT05fRU5EXT1pKCkpfXZhciBhPSExLGw9MWU2LGg9e1dlYmtpdFRyYW5zaXRpb246XCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCIsTW96VHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIixPVHJhbnNpdGlvbjpcIm9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kXCIsdHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIn0sYz17VFJBTlNJVElPTl9FTkQ6XCJic1RyYW5zaXRpb25FbmRcIixnZXRVSUQ6ZnVuY3Rpb24odCl7ZG8gdCs9fn4oTWF0aC5yYW5kb20oKSpsKTt3aGlsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0KSk7cmV0dXJuIHR9LGdldFNlbGVjdG9yRnJvbUVsZW1lbnQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhcmdldFwiKTtyZXR1cm4gZXx8KGU9dC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfHxcIlwiLGU9L14jW2Etel0vaS50ZXN0KGUpP2U6bnVsbCksZX0scmVmbG93OmZ1bmN0aW9uKHQpe3JldHVybiB0Lm9mZnNldEhlaWdodH0sdHJpZ2dlclRyYW5zaXRpb25FbmQ6ZnVuY3Rpb24oZSl7dChlKS50cmlnZ2VyKGEuZW5kKX0sc3VwcG9ydHNUcmFuc2l0aW9uRW5kOmZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4oYSl9LHR5cGVDaGVja0NvbmZpZzpmdW5jdGlvbih0LGksbyl7Zm9yKHZhciByIGluIG8paWYoby5oYXNPd25Qcm9wZXJ0eShyKSl7dmFyIHM9b1tyXSxhPWlbcl0sbD1hJiZuKGEpP1wiZWxlbWVudFwiOmUoYSk7aWYoIW5ldyBSZWdFeHAocykudGVzdChsKSl0aHJvdyBuZXcgRXJyb3IodC50b1VwcGVyQ2FzZSgpK1wiOiBcIisoJ09wdGlvbiBcIicrcisnXCIgcHJvdmlkZWQgdHlwZSBcIicrbCsnXCIgJykrKCdidXQgZXhwZWN0ZWQgdHlwZSBcIicrcysnXCIuJykpfX19O3JldHVybiBzKCksY30oalF1ZXJ5KSxzPShmdW5jdGlvbih0KXt2YXIgZT1cImFsZXJ0XCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMuYWxlcnRcIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTE1MCx1PXtESVNNSVNTOidbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nfSxkPXtDTE9TRTpcImNsb3NlXCIrYSxDTE9TRUQ6XCJjbG9zZWRcIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGY9e0FMRVJUOlwiYWxlcnRcIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKHQpe3Q9dHx8dGhpcy5fZWxlbWVudDt2YXIgZT10aGlzLl9nZXRSb290RWxlbWVudCh0KSxuPXRoaXMuX3RyaWdnZXJDbG9zZUV2ZW50KGUpO24uaXNEZWZhdWx0UHJldmVudGVkKCl8fHRoaXMuX3JlbW92ZUVsZW1lbnQoZSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxzKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9nZXRSb290RWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSksaT0hMTtyZXR1cm4gbiYmKGk9dChuKVswXSksaXx8KGk9dChlKS5jbG9zZXN0KFwiLlwiK2YuQUxFUlQpWzBdKSxpfSxlLnByb3RvdHlwZS5fdHJpZ2dlckNsb3NlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dC5FdmVudChkLkNMT1NFKTtyZXR1cm4gdChlKS50cmlnZ2VyKG4pLG59LGUucHJvdG90eXBlLl9yZW1vdmVFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7cmV0dXJuIHQoZSkucmVtb3ZlQ2xhc3MoZi5TSE9XKSxyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KGUpLmhhc0NsYXNzKGYuRkFERSk/dm9pZCB0KGUpLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKHQpe3JldHVybiBuLl9kZXN0cm95RWxlbWVudChlLHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYyk6dm9pZCB0aGlzLl9kZXN0cm95RWxlbWVudChlKX0sZS5wcm90b3R5cGUuX2Rlc3Ryb3lFbGVtZW50PWZ1bmN0aW9uKGUpe3QoZSkuZGV0YWNoKCkudHJpZ2dlcihkLkNMT1NFRCkucmVtb3ZlKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJjbG9zZVwiPT09biYmb1tuXSh0aGlzKX0pfSxlLl9oYW5kbGVEaXNtaXNzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXtlJiZlLnByZXZlbnREZWZhdWx0KCksdC5jbG9zZSh0aGlzKX19LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihkLkNMSUNLX0RBVEFfQVBJLHUuRElTTUlTUyxfLl9oYW5kbGVEaXNtaXNzKG5ldyBfKSksdC5mbltlXT1fLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1fLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsXy5falF1ZXJ5SW50ZXJmYWNlfSxffShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiYnV0dG9uXCIsaT1cIjQuMC4wLWFscGhhLjZcIixyPVwiYnMuYnV0dG9uXCIscz1cIi5cIityLGE9XCIuZGF0YS1hcGlcIixsPXQuZm5bZV0saD17QUNUSVZFOlwiYWN0aXZlXCIsQlVUVE9OOlwiYnRuXCIsRk9DVVM6XCJmb2N1c1wifSxjPXtEQVRBX1RPR0dMRV9DQVJST1Q6J1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJyxJTlBVVDpcImlucHV0XCIsQUNUSVZFOlwiLmFjdGl2ZVwiLEJVVFRPTjpcIi5idG5cIn0sdT17Q0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK3MrYSxGT0NVU19CTFVSX0RBVEFfQVBJOlwiZm9jdXNcIitzK2ErXCIgXCIrKFwiYmx1clwiK3MrYSl9LGQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3ZhciBlPSEwLG49dCh0aGlzLl9lbGVtZW50KS5jbG9zZXN0KGMuREFUQV9UT0dHTEUpWzBdO2lmKG4pe3ZhciBpPXQodGhpcy5fZWxlbWVudCkuZmluZChjLklOUFVUKVswXTtpZihpKXtpZihcInJhZGlvXCI9PT1pLnR5cGUpaWYoaS5jaGVja2VkJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSllPSExO2Vsc2V7dmFyIG89dChuKS5maW5kKGMuQUNUSVZFKVswXTtvJiZ0KG8pLnJlbW92ZUNsYXNzKGguQUNUSVZFKX1lJiYoaS5jaGVja2VkPSF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSx0KGkpLnRyaWdnZXIoXCJjaGFuZ2VcIikpLGkuZm9jdXMoKX19dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXByZXNzZWRcIiwhdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSkpLGUmJnQodGhpcy5fZWxlbWVudCkudG9nZ2xlQ2xhc3MoaC5BQ1RJVkUpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsciksdGhpcy5fZWxlbWVudD1udWxsfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShyKTtpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocixpKSksXCJ0b2dnbGVcIj09PW4mJmlbbl0oKX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxjLkRBVEFfVE9HR0xFX0NBUlJPVCxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIG49ZS50YXJnZXQ7dChuKS5oYXNDbGFzcyhoLkJVVFRPTil8fChuPXQobikuY2xvc2VzdChjLkJVVFRPTikpLGQuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJ0b2dnbGVcIil9KS5vbih1LkZPQ1VTX0JMVVJfREFUQV9BUEksYy5EQVRBX1RPR0dMRV9DQVJST1QsZnVuY3Rpb24oZSl7dmFyIG49dChlLnRhcmdldCkuY2xvc2VzdChjLkJVVFRPTilbMF07dChuKS50b2dnbGVDbGFzcyhoLkZPQ1VTLC9eZm9jdXMoaW4pPyQvLnRlc3QoZS50eXBlKSl9KSx0LmZuW2VdPWQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPWQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09bCxkLl9qUXVlcnlJbnRlcmZhY2V9LGR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjYXJvdXNlbFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNhcm91c2VsXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD0zNyxmPTM5LF89e2ludGVydmFsOjVlMyxrZXlib2FyZDohMCxzbGlkZTohMSxwYXVzZTpcImhvdmVyXCIsd3JhcDohMH0sZz17aW50ZXJ2YWw6XCIobnVtYmVyfGJvb2xlYW4pXCIsa2V5Ym9hcmQ6XCJib29sZWFuXCIsc2xpZGU6XCIoYm9vbGVhbnxzdHJpbmcpXCIscGF1c2U6XCIoc3RyaW5nfGJvb2xlYW4pXCIsd3JhcDpcImJvb2xlYW5cIn0scD17TkVYVDpcIm5leHRcIixQUkVWOlwicHJldlwiLExFRlQ6XCJsZWZ0XCIsUklHSFQ6XCJyaWdodFwifSxtPXtTTElERTpcInNsaWRlXCIrbCxTTElEOlwic2xpZFwiK2wsS0VZRE9XTjpcImtleWRvd25cIitsLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrbCxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2gsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sRT17Q0FST1VTRUw6XCJjYXJvdXNlbFwiLEFDVElWRTpcImFjdGl2ZVwiLFNMSURFOlwic2xpZGVcIixSSUdIVDpcImNhcm91c2VsLWl0ZW0tcmlnaHRcIixMRUZUOlwiY2Fyb3VzZWwtaXRlbS1sZWZ0XCIsTkVYVDpcImNhcm91c2VsLWl0ZW0tbmV4dFwiLFBSRVY6XCJjYXJvdXNlbC1pdGVtLXByZXZcIixJVEVNOlwiY2Fyb3VzZWwtaXRlbVwifSx2PXtBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0lURU06XCIuYWN0aXZlLmNhcm91c2VsLWl0ZW1cIixJVEVNOlwiLmNhcm91c2VsLWl0ZW1cIixORVhUX1BSRVY6XCIuY2Fyb3VzZWwtaXRlbS1uZXh0LCAuY2Fyb3VzZWwtaXRlbS1wcmV2XCIsSU5ESUNBVE9SUzpcIi5jYXJvdXNlbC1pbmRpY2F0b3JzXCIsREFUQV9TTElERTpcIltkYXRhLXNsaWRlXSwgW2RhdGEtc2xpZGUtdG9dXCIsREFUQV9SSURFOidbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nfSxUPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe24odGhpcyxoKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2ludGVydmFsPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2lzUGF1c2VkPSExLHRoaXMuX2lzU2xpZGluZz0hMSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX2VsZW1lbnQ9dChlKVswXSx0aGlzLl9pbmRpY2F0b3JzRWxlbWVudD10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5JTkRJQ0FUT1JTKVswXSx0aGlzLl9hZGRFdmVudExpc3RlbmVycygpfXJldHVybiBoLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7aWYodGhpcy5faXNTbGlkaW5nKXRocm93IG5ldyBFcnJvcihcIkNhcm91c2VsIGlzIHNsaWRpbmdcIik7dGhpcy5fc2xpZGUocC5ORVhUKX0saC5wcm90b3R5cGUubmV4dFdoZW5WaXNpYmxlPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuaGlkZGVufHx0aGlzLm5leHQoKX0saC5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe2lmKHRoaXMuX2lzU2xpZGluZyl0aHJvdyBuZXcgRXJyb3IoXCJDYXJvdXNlbCBpcyBzbGlkaW5nXCIpO3RoaXMuX3NsaWRlKHAuUFJFVklPVVMpfSxoLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihlKXtlfHwodGhpcy5faXNQYXVzZWQ9ITApLHQodGhpcy5fZWxlbWVudCkuZmluZCh2Lk5FWFRfUFJFVilbMF0mJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihyLnRyaWdnZXJUcmFuc2l0aW9uRW5kKHRoaXMuX2VsZW1lbnQpLHRoaXMuY3ljbGUoITApKSxjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsKSx0aGlzLl9pbnRlcnZhbD1udWxsfSxoLnByb3RvdHlwZS5jeWNsZT1mdW5jdGlvbih0KXt0fHwodGhpcy5faXNQYXVzZWQ9ITEpLHRoaXMuX2ludGVydmFsJiYoY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCksdGhpcy5faW50ZXJ2YWw9bnVsbCksdGhpcy5fY29uZmlnLmludGVydmFsJiYhdGhpcy5faXNQYXVzZWQmJih0aGlzLl9pbnRlcnZhbD1zZXRJbnRlcnZhbCgoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlP3RoaXMubmV4dFdoZW5WaXNpYmxlOnRoaXMubmV4dCkuYmluZCh0aGlzKSx0aGlzLl9jb25maWcuaW50ZXJ2YWwpKX0saC5wcm90b3R5cGUudG89ZnVuY3Rpb24oZSl7dmFyIG49dGhpczt0aGlzLl9hY3RpdmVFbGVtZW50PXQodGhpcy5fZWxlbWVudCkuZmluZCh2LkFDVElWRV9JVEVNKVswXTt2YXIgaT10aGlzLl9nZXRJdGVtSW5kZXgodGhpcy5fYWN0aXZlRWxlbWVudCk7aWYoIShlPnRoaXMuX2l0ZW1zLmxlbmd0aC0xfHxlPDApKXtpZih0aGlzLl9pc1NsaWRpbmcpcmV0dXJuIHZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUobS5TTElELGZ1bmN0aW9uKCl7cmV0dXJuIG4udG8oZSl9KTtpZihpPT09ZSlyZXR1cm4gdGhpcy5wYXVzZSgpLHZvaWQgdGhpcy5jeWNsZSgpO3ZhciBvPWU+aT9wLk5FWFQ6cC5QUkVWSU9VUzt0aGlzLl9zbGlkZShvLHRoaXMuX2l0ZW1zW2VdKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9mZihsKSx0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9pbnRlcnZhbD1udWxsLHRoaXMuX2lzUGF1c2VkPW51bGwsdGhpcy5faXNTbGlkaW5nPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2luZGljYXRvcnNFbGVtZW50PW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sXyxuKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZyksbn0saC5wcm90b3R5cGUuX2FkZEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9jb25maWcua2V5Ym9hcmQmJnQodGhpcy5fZWxlbWVudCkub24obS5LRVlET1dOLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9rZXlkb3duKHQpfSksXCJob3ZlclwiIT09dGhpcy5fY29uZmlnLnBhdXNlfHxcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50fHx0KHRoaXMuX2VsZW1lbnQpLm9uKG0uTU9VU0VFTlRFUixmdW5jdGlvbih0KXtyZXR1cm4gZS5wYXVzZSh0KX0pLm9uKG0uTU9VU0VMRUFWRSxmdW5jdGlvbih0KXtyZXR1cm4gZS5jeWNsZSh0KX0pfSxoLnByb3RvdHlwZS5fa2V5ZG93bj1mdW5jdGlvbih0KXtpZighL2lucHV0fHRleHRhcmVhL2kudGVzdCh0LnRhcmdldC50YWdOYW1lKSlzd2l0Y2godC53aGljaCl7Y2FzZSBkOnQucHJldmVudERlZmF1bHQoKSx0aGlzLnByZXYoKTticmVhaztjYXNlIGY6dC5wcmV2ZW50RGVmYXVsdCgpLHRoaXMubmV4dCgpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufX0saC5wcm90b3R5cGUuX2dldEl0ZW1JbmRleD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5faXRlbXM9dC5tYWtlQXJyYXkodChlKS5wYXJlbnQoKS5maW5kKHYuSVRFTSkpLHRoaXMuX2l0ZW1zLmluZGV4T2YoZSl9LGgucHJvdG90eXBlLl9nZXRJdGVtQnlEaXJlY3Rpb249ZnVuY3Rpb24odCxlKXt2YXIgbj10PT09cC5ORVhULGk9dD09PXAuUFJFVklPVVMsbz10aGlzLl9nZXRJdGVtSW5kZXgoZSkscj10aGlzLl9pdGVtcy5sZW5ndGgtMSxzPWkmJjA9PT1vfHxuJiZvPT09cjtpZihzJiYhdGhpcy5fY29uZmlnLndyYXApcmV0dXJuIGU7dmFyIGE9dD09PXAuUFJFVklPVVM/LTE6MSxsPShvK2EpJXRoaXMuX2l0ZW1zLmxlbmd0aDtyZXR1cm4gbD09PS0xP3RoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aC0xXTp0aGlzLl9pdGVtc1tsXX0saC5wcm90b3R5cGUuX3RyaWdnZXJTbGlkZUV2ZW50PWZ1bmN0aW9uKGUsbil7dmFyIGk9dC5FdmVudChtLlNMSURFLHtyZWxhdGVkVGFyZ2V0OmUsZGlyZWN0aW9uOm59KTtyZXR1cm4gdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLGl9LGgucHJvdG90eXBlLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50PWZ1bmN0aW9uKGUpe2lmKHRoaXMuX2luZGljYXRvcnNFbGVtZW50KXt0KHRoaXMuX2luZGljYXRvcnNFbGVtZW50KS5maW5kKHYuQUNUSVZFKS5yZW1vdmVDbGFzcyhFLkFDVElWRSk7dmFyIG49dGhpcy5faW5kaWNhdG9yc0VsZW1lbnQuY2hpbGRyZW5bdGhpcy5fZ2V0SXRlbUluZGV4KGUpXTtuJiZ0KG4pLmFkZENsYXNzKEUuQUNUSVZFKX19LGgucHJvdG90eXBlLl9zbGlkZT1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMsbz10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5BQ1RJVkVfSVRFTSlbMF0scz1ufHxvJiZ0aGlzLl9nZXRJdGVtQnlEaXJlY3Rpb24oZSxvKSxhPUJvb2xlYW4odGhpcy5faW50ZXJ2YWwpLGw9dm9pZCAwLGg9dm9pZCAwLGM9dm9pZCAwO2lmKGU9PT1wLk5FWFQ/KGw9RS5MRUZULGg9RS5ORVhULGM9cC5MRUZUKToobD1FLlJJR0hULGg9RS5QUkVWLGM9cC5SSUdIVCkscyYmdChzKS5oYXNDbGFzcyhFLkFDVElWRSkpcmV0dXJuIHZvaWQodGhpcy5faXNTbGlkaW5nPSExKTt2YXIgZD10aGlzLl90cmlnZ2VyU2xpZGVFdmVudChzLGMpO2lmKCFkLmlzRGVmYXVsdFByZXZlbnRlZCgpJiZvJiZzKXt0aGlzLl9pc1NsaWRpbmc9ITAsYSYmdGhpcy5wYXVzZSgpLHRoaXMuX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQocyk7dmFyIGY9dC5FdmVudChtLlNMSUQse3JlbGF0ZWRUYXJnZXQ6cyxkaXJlY3Rpb246Y30pO3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoRS5TTElERSk/KHQocykuYWRkQ2xhc3MoaCksci5yZWZsb3cocyksdChvKS5hZGRDbGFzcyhsKSx0KHMpLmFkZENsYXNzKGwpLHQobykub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24oKXt0KHMpLnJlbW92ZUNsYXNzKGwrXCIgXCIraCkuYWRkQ2xhc3MoRS5BQ1RJVkUpLHQobykucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUrXCIgXCIraCtcIiBcIitsKSxpLl9pc1NsaWRpbmc9ITEsc2V0VGltZW91dChmdW5jdGlvbigpe3JldHVybiB0KGkuX2VsZW1lbnQpLnRyaWdnZXIoZil9LDApfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSkpOih0KG8pLnJlbW92ZUNsYXNzKEUuQUNUSVZFKSx0KHMpLmFkZENsYXNzKEUuQUNUSVZFKSx0aGlzLl9pc1NsaWRpbmc9ITEsdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGYpKSxhJiZ0aGlzLmN5Y2xlKCl9fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPXQuZXh0ZW5kKHt9LF8sdCh0aGlzKS5kYXRhKCkpO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmdC5leHRlbmQobyxlKTt2YXIgcj1cInN0cmluZ1wiPT10eXBlb2YgZT9lOm8uc2xpZGU7aWYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJudW1iZXJcIj09dHlwZW9mIGUpbi50byhlKTtlbHNlIGlmKFwic3RyaW5nXCI9PXR5cGVvZiByKXtpZih2b2lkIDA9PT1uW3JdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytyKydcIicpO25bcl0oKX1lbHNlIG8uaW50ZXJ2YWwmJihuLnBhdXNlKCksbi5jeWNsZSgpKX0pfSxoLl9kYXRhQXBpQ2xpY2tIYW5kbGVyPWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKTtpZihuKXt2YXIgaT10KG4pWzBdO2lmKGkmJnQoaSkuaGFzQ2xhc3MoRS5DQVJPVVNFTCkpe3ZhciBvPXQuZXh0ZW5kKHt9LHQoaSkuZGF0YSgpLHQodGhpcykuZGF0YSgpKSxzPXRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b1wiKTtzJiYoby5pbnRlcnZhbD0hMSksaC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChpKSxvKSxzJiZ0KGkpLmRhdGEoYSkudG8ocyksZS5wcmV2ZW50RGVmYXVsdCgpfX19LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24obS5DTElDS19EQVRBX0FQSSx2LkRBVEFfU0xJREUsVC5fZGF0YUFwaUNsaWNrSGFuZGxlciksdCh3aW5kb3cpLm9uKG0uTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe3Qodi5EQVRBX1JJREUpLmVhY2goZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMpO1QuX2pRdWVyeUludGVyZmFjZS5jYWxsKGUsZS5kYXRhKCkpfSl9KSx0LmZuW2VdPVQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPVQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxULl9qUXVlcnlJbnRlcmZhY2V9LFR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjb2xsYXBzZVwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNvbGxhcHNlXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD17dG9nZ2xlOiEwLHBhcmVudDpcIlwifSxmPXt0b2dnbGU6XCJib29sZWFuXCIscGFyZW50Olwic3RyaW5nXCJ9LF89e1NIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxnPXtTSE9XOlwic2hvd1wiLENPTExBUFNFOlwiY29sbGFwc2VcIixDT0xMQVBTSU5HOlwiY29sbGFwc2luZ1wiLENPTExBUFNFRDpcImNvbGxhcHNlZFwifSxwPXtXSURUSDpcIndpZHRoXCIsSEVJR0hUOlwiaGVpZ2h0XCJ9LG09e0FDVElWRVM6XCIuY2FyZCA+IC5zaG93LCAuY2FyZCA+IC5jb2xsYXBzaW5nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJ30sRT1mdW5jdGlvbigpe2Z1bmN0aW9uIGwoZSxpKXtuKHRoaXMsbCksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3RyaWdnZXJBcnJheT10Lm1ha2VBcnJheSh0KCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycrZS5pZCsnXCJdLCcrKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnK2UuaWQrJ1wiXScpKSksdGhpcy5fcGFyZW50PXRoaXMuX2NvbmZpZy5wYXJlbnQ/dGhpcy5fZ2V0UGFyZW50KCk6bnVsbCx0aGlzLl9jb25maWcucGFyZW50fHx0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy5fZWxlbWVudCx0aGlzLl90cmlnZ2VyQXJyYXkpLHRoaXMuX2NvbmZpZy50b2dnbGUmJnRoaXMudG9nZ2xlKCl9cmV0dXJuIGwucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKT90aGlzLmhpZGUoKTp0aGlzLnNob3coKX0sbC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIkNvbGxhcHNlIGlzIHRyYW5zaXRpb25pbmdcIik7aWYoIXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuX3BhcmVudCYmKG49dC5tYWtlQXJyYXkodCh0aGlzLl9wYXJlbnQpLmZpbmQobS5BQ1RJVkVTKSksbi5sZW5ndGh8fChuPW51bGwpKSwhKG4mJihpPXQobikuZGF0YShhKSxpJiZpLl9pc1RyYW5zaXRpb25pbmcpKSl7dmFyIG89dC5FdmVudChfLlNIT1cpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihvKSwhby5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7biYmKGwuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJoaWRlXCIpLGl8fHQobikuZGF0YShhLG51bGwpKTt2YXIgcz10aGlzLl9nZXREaW1lbnNpb24oKTt0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0UpLmFkZENsYXNzKGcuQ09MTEFQU0lORyksdGhpcy5fZWxlbWVudC5zdHlsZVtzXT0wLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIGg9ZnVuY3Rpb24oKXt0KGUuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0lORykuYWRkQ2xhc3MoZy5DT0xMQVBTRSkuYWRkQ2xhc3MoZy5TSE9XKSxlLl9lbGVtZW50LnN0eWxlW3NdPVwiXCIsZS5zZXRUcmFuc2l0aW9uaW5nKCExKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIoXy5TSE9XTil9O2lmKCFyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpKXJldHVybiB2b2lkIGgoKTt2YXIgYz1zWzBdLnRvVXBwZXJDYXNlKCkrcy5zbGljZSgxKSxkPVwic2Nyb2xsXCIrYzt0KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELGgpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpLHRoaXMuX2VsZW1lbnQuc3R5bGVbc109dGhpcy5fZWxlbWVudFtkXStcInB4XCJ9fX19LGwucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJDb2xsYXBzZSBpcyB0cmFuc2l0aW9uaW5nXCIpO2lmKHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dC5FdmVudChfLkhJREUpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihuKSwhbi5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7dmFyIGk9dGhpcy5fZ2V0RGltZW5zaW9uKCksbz1pPT09cC5XSURUSD9cIm9mZnNldFdpZHRoXCI6XCJvZmZzZXRIZWlnaHRcIjt0aGlzLl9lbGVtZW50LnN0eWxlW2ldPXRoaXMuX2VsZW1lbnRbb10rXCJweFwiLHIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MoZy5DT0xMQVBTSU5HKS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFKS5yZW1vdmVDbGFzcyhnLlNIT1cpLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkuYWRkQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIHM9ZnVuY3Rpb24oKXtlLnNldFRyYW5zaXRpb25pbmcoITEpLHQoZS5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTSU5HKS5hZGRDbGFzcyhnLkNPTExBUFNFKS50cmlnZ2VyKF8uSElEREVOKX07cmV0dXJuIHRoaXMuX2VsZW1lbnQuc3R5bGVbaV09XCJcIixyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpP3ZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTp2b2lkIHMoKX19fSxsLnByb3RvdHlwZS5zZXRUcmFuc2l0aW9uaW5nPWZ1bmN0aW9uKHQpe3RoaXMuX2lzVHJhbnNpdGlvbmluZz10fSxsLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fcGFyZW50PW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX3RyaWdnZXJBcnJheT1udWxsLHRoaXMuX2lzVHJhbnNpdGlvbmluZz1udWxsfSxsLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LGQsbiksbi50b2dnbGU9Qm9vbGVhbihuLnRvZ2dsZSksci50eXBlQ2hlY2tDb25maWcoZSxuLGYpLG59LGwucHJvdG90eXBlLl9nZXREaW1lbnNpb249ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKHAuV0lEVEgpO3JldHVybiBlP3AuV0lEVEg6cC5IRUlHSFR9LGwucHJvdG90eXBlLl9nZXRQYXJlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dCh0aGlzLl9jb25maWcucGFyZW50KVswXSxpPSdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicrdGhpcy5fY29uZmlnLnBhcmVudCsnXCJdJztyZXR1cm4gdChuKS5maW5kKGkpLmVhY2goZnVuY3Rpb24odCxuKXtlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MobC5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQobiksW25dKX0pLG59LGwucHJvdG90eXBlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3M9ZnVuY3Rpb24oZSxuKXtpZihlKXt2YXIgaT10KGUpLmhhc0NsYXNzKGcuU0hPVyk7ZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsaSksbi5sZW5ndGgmJnQobikudG9nZ2xlQ2xhc3MoZy5DT0xMQVBTRUQsIWkpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsaSl9fSxsLl9nZXRUYXJnZXRGcm9tRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIG4/dChuKVswXTpudWxsfSxsLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcyksbz1uLmRhdGEoYSkscj10LmV4dGVuZCh7fSxkLG4uZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYoIW8mJnIudG9nZ2xlJiYvc2hvd3xoaWRlLy50ZXN0KGUpJiYoci50b2dnbGU9ITEpLG98fChvPW5ldyBsKHRoaXMsciksbi5kYXRhKGEsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1vW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO29bZV0oKX19KX0sbyhsLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX1dKSxsfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihfLkNMSUNLX0RBVEFfQVBJLG0uREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBuPUUuX2dldFRhcmdldEZyb21FbGVtZW50KHRoaXMpLGk9dChuKS5kYXRhKGEpLG89aT9cInRvZ2dsZVwiOnQodGhpcykuZGF0YSgpO0UuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksbyl9KSx0LmZuW2VdPUUuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPUUsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxFLl9qUXVlcnlJbnRlcmZhY2V9LEV9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJkcm9wZG93blwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLmRyb3Bkb3duXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0yNyx1PTM4LGQ9NDAsZj0zLF89e0hJREU6XCJoaWRlXCIrYSxISURERU46XCJoaWRkZW5cIithLFNIT1c6XCJzaG93XCIrYSxTSE9XTjpcInNob3duXCIrYSxDTElDSzpcImNsaWNrXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsLEZPQ1VTSU5fREFUQV9BUEk6XCJmb2N1c2luXCIrYStsLEtFWURPV05fREFUQV9BUEk6XCJrZXlkb3duXCIrYStsfSxnPXtCQUNLRFJPUDpcImRyb3Bkb3duLWJhY2tkcm9wXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLFNIT1c6XCJzaG93XCJ9LHA9e0JBQ0tEUk9QOlwiLmRyb3Bkb3duLWJhY2tkcm9wXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxGT1JNX0NISUxEOlwiLmRyb3Bkb3duIGZvcm1cIixST0xFX01FTlU6J1tyb2xlPVwibWVudVwiXScsUk9MRV9MSVNUQk9YOidbcm9sZT1cImxpc3Rib3hcIl0nLE5BVkJBUl9OQVY6XCIubmF2YmFyLW5hdlwiLFZJU0lCTEVfSVRFTVM6J1tyb2xlPVwibWVudVwiXSBsaTpub3QoLmRpc2FibGVkKSBhLCBbcm9sZT1cImxpc3Rib3hcIl0gbGk6bm90KC5kaXNhYmxlZCkgYSd9LG09ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXQsdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKX1yZXR1cm4gZS5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7aWYodGhpcy5kaXNhYmxlZHx8dCh0aGlzKS5oYXNDbGFzcyhnLkRJU0FCTEVEKSlyZXR1cm4hMTt2YXIgbj1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxpPXQobikuaGFzQ2xhc3MoZy5TSE9XKTtpZihlLl9jbGVhck1lbnVzKCksaSlyZXR1cm4hMTtpZihcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50JiYhdChuKS5jbG9zZXN0KHAuTkFWQkFSX05BVikubGVuZ3RoKXt2YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO28uY2xhc3NOYW1lPWcuQkFDS0RST1AsdChvKS5pbnNlcnRCZWZvcmUodGhpcyksdChvKS5vbihcImNsaWNrXCIsZS5fY2xlYXJNZW51cyl9dmFyIHI9e3JlbGF0ZWRUYXJnZXQ6dGhpc30scz10LkV2ZW50KF8uU0hPVyxyKTtyZXR1cm4gdChuKS50cmlnZ2VyKHMpLCFzLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYodGhpcy5mb2N1cygpLHRoaXMuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0KG4pLnRvZ2dsZUNsYXNzKGcuU0hPVyksdChuKS50cmlnZ2VyKHQuRXZlbnQoXy5TSE9XTixyKSksITEpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQscyksdCh0aGlzLl9lbGVtZW50KS5vZmYoYSksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9uKF8uQ0xJQ0ssdGhpcy50b2dnbGUpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShzKTtpZihpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PWlbbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7aVtuXS5jYWxsKHRoaXMpfX0pfSxlLl9jbGVhck1lbnVzPWZ1bmN0aW9uKG4pe2lmKCFufHxuLndoaWNoIT09Zil7dmFyIGk9dChwLkJBQ0tEUk9QKVswXTtpJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSk7Zm9yKHZhciBvPXQubWFrZUFycmF5KHQocC5EQVRBX1RPR0dMRSkpLHI9MDtyPG8ubGVuZ3RoO3IrKyl7dmFyIHM9ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQob1tyXSksYT17cmVsYXRlZFRhcmdldDpvW3JdfTtpZih0KHMpLmhhc0NsYXNzKGcuU0hPVykmJiEobiYmKFwiY2xpY2tcIj09PW4udHlwZSYmL2lucHV0fHRleHRhcmVhL2kudGVzdChuLnRhcmdldC50YWdOYW1lKXx8XCJmb2N1c2luXCI9PT1uLnR5cGUpJiZ0LmNvbnRhaW5zKHMsbi50YXJnZXQpKSl7dmFyIGw9dC5FdmVudChfLkhJREUsYSk7dChzKS50cmlnZ2VyKGwpLGwuaXNEZWZhdWx0UHJldmVudGVkKCl8fChvW3JdLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIixcImZhbHNlXCIpLHQocykucmVtb3ZlQ2xhc3MoZy5TSE9XKS50cmlnZ2VyKHQuRXZlbnQoXy5ISURERU4sYSkpKX19fX0sZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dm9pZCAwLGk9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBpJiYobj10KGkpWzBdKSxufHxlLnBhcmVudE5vZGV9LGUuX2RhdGFBcGlLZXlkb3duSGFuZGxlcj1mdW5jdGlvbihuKXtpZigvKDM4fDQwfDI3fDMyKS8udGVzdChuLndoaWNoKSYmIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3Qobi50YXJnZXQudGFnTmFtZSkmJihuLnByZXZlbnREZWZhdWx0KCksbi5zdG9wUHJvcGFnYXRpb24oKSwhdGhpcy5kaXNhYmxlZCYmIXQodGhpcykuaGFzQ2xhc3MoZy5ESVNBQkxFRCkpKXt2YXIgaT1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxvPXQoaSkuaGFzQ2xhc3MoZy5TSE9XKTtpZighbyYmbi53aGljaCE9PWN8fG8mJm4ud2hpY2g9PT1jKXtpZihuLndoaWNoPT09Yyl7dmFyIHI9dChpKS5maW5kKHAuREFUQV9UT0dHTEUpWzBdO3QocikudHJpZ2dlcihcImZvY3VzXCIpfXJldHVybiB2b2lkIHQodGhpcykudHJpZ2dlcihcImNsaWNrXCIpfXZhciBzPXQoaSkuZmluZChwLlZJU0lCTEVfSVRFTVMpLmdldCgpO2lmKHMubGVuZ3RoKXt2YXIgYT1zLmluZGV4T2Yobi50YXJnZXQpO24ud2hpY2g9PT11JiZhPjAmJmEtLSxuLndoaWNoPT09ZCYmYTxzLmxlbmd0aC0xJiZhKyssYTwwJiYoYT0wKSxzW2FdLmZvY3VzKCl9fX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9NRU5VLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9MSVNUQk9YLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5DTElDS19EQVRBX0FQSStcIiBcIitfLkZPQ1VTSU5fREFUQV9BUEksbS5fY2xlYXJNZW51cykub24oXy5DTElDS19EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0ucHJvdG90eXBlLnRvZ2dsZSkub24oXy5DTElDS19EQVRBX0FQSSxwLkZPUk1fQ0hJTEQsZnVuY3Rpb24odCl7dC5zdG9wUHJvcGFnYXRpb24oKX0pLHQuZm5bZV09bS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9bSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLG0uX2pRdWVyeUludGVyZmFjZX0sbX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cIm1vZGFsXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMubW9kYWxcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTMwMCxkPTE1MCxmPTI3LF89e2JhY2tkcm9wOiEwLGtleWJvYXJkOiEwLGZvY3VzOiEwLHNob3c6ITB9LGc9e2JhY2tkcm9wOlwiKGJvb2xlYW58c3RyaW5nKVwiLGtleWJvYXJkOlwiYm9vbGVhblwiLGZvY3VzOlwiYm9vbGVhblwiLHNob3c6XCJib29sZWFuXCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsUkVTSVpFOlwicmVzaXplXCIrbCxDTElDS19ESVNNSVNTOlwiY2xpY2suZGlzbWlzc1wiK2wsS0VZRE9XTl9ESVNNSVNTOlwia2V5ZG93bi5kaXNtaXNzXCIrbCxNT1VTRVVQX0RJU01JU1M6XCJtb3VzZXVwLmRpc21pc3NcIitsLE1PVVNFRE9XTl9ESVNNSVNTOlwibW91c2Vkb3duLmRpc21pc3NcIitsLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LG09e1NDUk9MTEJBUl9NRUFTVVJFUjpcIm1vZGFsLXNjcm9sbGJhci1tZWFzdXJlXCIsQkFDS0RST1A6XCJtb2RhbC1iYWNrZHJvcFwiLE9QRU46XCJtb2RhbC1vcGVuXCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtESUFMT0c6XCIubW9kYWwtZGlhbG9nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJyxEQVRBX0RJU01JU1M6J1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsRklYRURfQ09OVEVOVDpcIi5maXhlZC10b3AsIC5maXhlZC1ib3R0b20sIC5pcy1maXhlZCwgLnN0aWNreS10b3BcIn0sdj1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXtuKHRoaXMsaCksdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fZGlhbG9nPXQoZSkuZmluZChFLkRJQUxPRylbMF0sdGhpcy5fYmFja2Ryb3A9bnVsbCx0aGlzLl9pc1Nob3duPSExLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nPSExLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEsdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9MCx0aGlzLl9zY3JvbGxiYXJXaWR0aD0wfXJldHVybiBoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2lzU2hvd24/dGhpcy5oaWRlKCk6dGhpcy5zaG93KHQpfSxoLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpJiYodGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwKTt2YXIgaT10LkV2ZW50KHAuU0hPVyx7cmVsYXRlZFRhcmdldDplfSk7dCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLHRoaXMuX2lzU2hvd258fGkuaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0aGlzLl9pc1Nob3duPSEwLHRoaXMuX2NoZWNrU2Nyb2xsYmFyKCksdGhpcy5fc2V0U2Nyb2xsYmFyKCksdChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhtLk9QRU4pLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxFLkRBVEFfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5oaWRlKHQpfSksdCh0aGlzLl9kaWFsb2cpLm9uKHAuTU9VU0VET1dOX0RJU01JU1MsZnVuY3Rpb24oKXt0KG4uX2VsZW1lbnQpLm9uZShwLk1PVVNFVVBfRElTTUlTUyxmdW5jdGlvbihlKXt0KGUudGFyZ2V0KS5pcyhuLl9lbGVtZW50KSYmKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITApfSl9KSx0aGlzLl9zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtyZXR1cm4gbi5fc2hvd0VsZW1lbnQoZSl9KSl9LGgucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztpZihlJiZlLnByZXZlbnREZWZhdWx0KCksdGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7dmFyIGk9ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpO2kmJih0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITApO3ZhciBvPXQuRXZlbnQocC5ISURFKTt0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobyksdGhpcy5faXNTaG93biYmIW8uaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLl9pc1Nob3duPSExLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KGRvY3VtZW50KS5vZmYocC5GT0NVU0lOKSx0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKG0uU0hPVyksdCh0aGlzLl9lbGVtZW50KS5vZmYocC5DTElDS19ESVNNSVNTKSx0KHRoaXMuX2RpYWxvZykub2ZmKHAuTU9VU0VET1dOX0RJU01JU1MpLGk/dCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbih0KXtyZXR1cm4gbi5faGlkZU1vZGFsKHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6dGhpcy5faGlkZU1vZGFsKCkpfSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdCh3aW5kb3csZG9jdW1lbnQsdGhpcy5fZWxlbWVudCx0aGlzLl9iYWNrZHJvcCkub2ZmKGwpLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9kaWFsb2c9bnVsbCx0aGlzLl9iYWNrZHJvcD1udWxsLHRoaXMuX2lzU2hvd249bnVsbCx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1udWxsLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9bnVsbCx0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPW51bGwsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxfLG4pLHIudHlwZUNoZWNrQ29uZmlnKGUsbixnKSxufSxoLnByb3RvdHlwZS5fc2hvd0VsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKTt0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUmJnRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFfHxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnQpLHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheT1cImJsb2NrXCIsdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSx0aGlzLl9lbGVtZW50LnNjcm9sbFRvcD0wLGkmJnIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MobS5TSE9XKSx0aGlzLl9jb25maWcuZm9jdXMmJnRoaXMuX2VuZm9yY2VGb2N1cygpO3ZhciBvPXQuRXZlbnQocC5TSE9XTix7cmVsYXRlZFRhcmdldDplfSkscz1mdW5jdGlvbigpe24uX2NvbmZpZy5mb2N1cyYmbi5fZWxlbWVudC5mb2N1cygpLG4uX2lzVHJhbnNpdGlvbmluZz0hMSx0KG4uX2VsZW1lbnQpLnRyaWdnZXIobyl9O2k/dCh0aGlzLl9kaWFsb2cpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnMoKX0saC5wcm90b3R5cGUuX2VuZm9yY2VGb2N1cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dChkb2N1bWVudCkub2ZmKHAuRk9DVVNJTikub24ocC5GT0NVU0lOLGZ1bmN0aW9uKG4pe2RvY3VtZW50PT09bi50YXJnZXR8fGUuX2VsZW1lbnQ9PT1uLnRhcmdldHx8dChlLl9lbGVtZW50KS5oYXMobi50YXJnZXQpLmxlbmd0aHx8ZS5fZWxlbWVudC5mb2N1cygpfSl9LGgucHJvdG90eXBlLl9zZXRFc2NhcGVFdmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5faXNTaG93biYmdGhpcy5fY29uZmlnLmtleWJvYXJkP3QodGhpcy5fZWxlbWVudCkub24ocC5LRVlET1dOX0RJU01JU1MsZnVuY3Rpb24odCl7dC53aGljaD09PWYmJmUuaGlkZSgpfSk6dGhpcy5faXNTaG93bnx8dCh0aGlzLl9lbGVtZW50KS5vZmYocC5LRVlET1dOX0RJU01JU1MpfSxoLnByb3RvdHlwZS5fc2V0UmVzaXplRXZlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2lzU2hvd24/dCh3aW5kb3cpLm9uKHAuUkVTSVpFLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9oYW5kbGVVcGRhdGUodCl9KTp0KHdpbmRvdykub2ZmKHAuUkVTSVpFKX0saC5wcm90b3R5cGUuX2hpZGVNb2RhbD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbigpe3QoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MobS5PUEVOKSxlLl9yZXNldEFkanVzdG1lbnRzKCksZS5fcmVzZXRTY3JvbGxiYXIoKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIocC5ISURERU4pfSl9LGgucHJvdG90eXBlLl9yZW1vdmVCYWNrZHJvcD1mdW5jdGlvbigpe3RoaXMuX2JhY2tkcm9wJiYodCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlKCksdGhpcy5fYmFja2Ryb3A9bnVsbCl9LGgucHJvdG90eXBlLl9zaG93QmFja2Ryb3A9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKT9tLkZBREU6XCJcIjtpZih0aGlzLl9pc1Nob3duJiZ0aGlzLl9jb25maWcuYmFja2Ryb3Ape3ZhciBvPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJmk7aWYodGhpcy5fYmFja2Ryb3A9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLl9iYWNrZHJvcC5jbGFzc05hbWU9bS5CQUNLRFJPUCxpJiZ0KHRoaXMuX2JhY2tkcm9wKS5hZGRDbGFzcyhpKSx0KHRoaXMuX2JhY2tkcm9wKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5faWdub3JlQmFja2Ryb3BDbGljaz92b2lkKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEpOnZvaWQodC50YXJnZXQ9PT10LmN1cnJlbnRUYXJnZXQmJihcInN0YXRpY1wiPT09bi5fY29uZmlnLmJhY2tkcm9wP24uX2VsZW1lbnQuZm9jdXMoKTpuLmhpZGUoKSkpfSksbyYmci5yZWZsb3codGhpcy5fYmFja2Ryb3ApLHQodGhpcy5fYmFja2Ryb3ApLmFkZENsYXNzKG0uU0hPVyksIWUpcmV0dXJuO2lmKCFvKXJldHVybiB2b2lkIGUoKTt0KHRoaXMuX2JhY2tkcm9wKS5vbmUoci5UUkFOU0lUSU9OX0VORCxlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkKX1lbHNlIGlmKCF0aGlzLl9pc1Nob3duJiZ0aGlzLl9iYWNrZHJvcCl7dCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlQ2xhc3MobS5TSE9XKTt2YXIgcz1mdW5jdGlvbigpe24uX3JlbW92ZUJhY2tkcm9wKCksZSYmZSgpfTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk/dCh0aGlzLl9iYWNrZHJvcCkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoZCk6cygpfWVsc2UgZSYmZSgpfSxoLnByb3RvdHlwZS5faGFuZGxlVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5fYWRqdXN0RGlhbG9nKCl9LGgucHJvdG90eXBlLl9hZGp1c3REaWFsb2c9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodD5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyF0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmdCYmKHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9dGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKSx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmIXQmJih0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD10aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpfSxoLnByb3RvdHlwZS5fcmVzZXRBZGp1c3RtZW50cz1mdW5jdGlvbigpe3RoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9XCJcIix0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD1cIlwifSxoLnByb3RvdHlwZS5fY2hlY2tTY3JvbGxiYXI9ZnVuY3Rpb24oKXt0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoPHdpbmRvdy5pbm5lcldpZHRoLHRoaXMuX3Njcm9sbGJhcldpZHRoPXRoaXMuX2dldFNjcm9sbGJhcldpZHRoKCl9LGgucHJvdG90eXBlLl9zZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgZT1wYXJzZUludCh0KEUuRklYRURfQ09OVEVOVCkuY3NzKFwicGFkZGluZy1yaWdodFwiKXx8MCwxMCk7dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz1kb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodHx8XCJcIix0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmKGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0PWUrdGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKX0saC5wcm90b3R5cGUuX3Jlc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQ9dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZ30saC5wcm90b3R5cGUuX2dldFNjcm9sbGJhcldpZHRoPWZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0LmNsYXNzTmFtZT1tLlNDUk9MTEJBUl9NRUFTVVJFUixkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQpO3ZhciBlPXQub2Zmc2V0V2lkdGgtdC5jbGllbnRXaWR0aDtyZXR1cm4gZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0KSxlfSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSxuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG89dCh0aGlzKS5kYXRhKGEpLHI9dC5leHRlbmQoe30saC5EZWZhdWx0LHQodGhpcykuZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYob3x8KG89bmV3IGgodGhpcyxyKSx0KHRoaXMpLmRhdGEoYSxvKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW9bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7b1tlXShuKX1lbHNlIHIuc2hvdyYmby5zaG93KG4pfSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24ocC5DTElDS19EQVRBX0FQSSxFLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT12b2lkIDAsbz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7byYmKGk9dChvKVswXSk7dmFyIHM9dChpKS5kYXRhKGEpP1widG9nZ2xlXCI6dC5leHRlbmQoe30sdChpKS5kYXRhKCksdCh0aGlzKS5kYXRhKCkpO1wiQVwiIT09dGhpcy50YWdOYW1lJiZcIkFSRUFcIiE9PXRoaXMudGFnTmFtZXx8ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBsPXQoaSkub25lKHAuU0hPVyxmdW5jdGlvbihlKXtlLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxsLm9uZShwLkhJRERFTixmdW5jdGlvbigpe3QobikuaXMoXCI6dmlzaWJsZVwiKSYmbi5mb2N1cygpfSl9KTt2Ll9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KGkpLHMsdGhpcyl9KSx0LmZuW2VdPXYuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPXYsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09Yyx2Ll9qUXVlcnlJbnRlcmZhY2V9LHZ9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJzY3JvbGxzcHlcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5zY3JvbGxzcHlcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PXtvZmZzZXQ6MTAsbWV0aG9kOlwiYXV0b1wiLHRhcmdldDpcIlwifSxkPXtvZmZzZXQ6XCJudW1iZXJcIixtZXRob2Q6XCJzdHJpbmdcIix0YXJnZXQ6XCIoc3RyaW5nfGVsZW1lbnQpXCJ9LGY9e0FDVElWQVRFOlwiYWN0aXZhdGVcIitsLFNDUk9MTDpcInNjcm9sbFwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2h9LF89e0RST1BET1dOX0lURU06XCJkcm9wZG93bi1pdGVtXCIsRFJPUERPV05fTUVOVTpcImRyb3Bkb3duLW1lbnVcIixOQVZfTElOSzpcIm5hdi1saW5rXCIsTkFWOlwibmF2XCIsQUNUSVZFOlwiYWN0aXZlXCJ9LGc9e0RBVEFfU1BZOidbZGF0YS1zcHk9XCJzY3JvbGxcIl0nLEFDVElWRTpcIi5hY3RpdmVcIixMSVNUX0lURU06XCIubGlzdC1pdGVtXCIsTEk6XCJsaVwiLExJX0RST1BET1dOOlwibGkuZHJvcGRvd25cIixOQVZfTElOS1M6XCIubmF2LWxpbmtcIixEUk9QRE9XTjpcIi5kcm9wZG93blwiLERST1BET1dOX0lURU1TOlwiLmRyb3Bkb3duLWl0ZW1cIixEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCJ9LHA9e09GRlNFVDpcIm9mZnNldFwiLFBPU0lUSU9OOlwicG9zaXRpb25cIn0sbT1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXt2YXIgbz10aGlzO24odGhpcyxoKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fc2Nyb2xsRWxlbWVudD1cIkJPRFlcIj09PWUudGFnTmFtZT93aW5kb3c6ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3NlbGVjdG9yPXRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5OQVZfTElOS1MrXCIsXCIrKHRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5EUk9QRE9XTl9JVEVNUyksdGhpcy5fb2Zmc2V0cz1bXSx0aGlzLl90YXJnZXRzPVtdLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD0wLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub24oZi5TQ1JPTEwsZnVuY3Rpb24odCl7cmV0dXJuIG8uX3Byb2Nlc3ModCl9KSx0aGlzLnJlZnJlc2goKSx0aGlzLl9wcm9jZXNzKCl9cmV0dXJuIGgucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5fc2Nyb2xsRWxlbWVudCE9PXRoaXMuX3Njcm9sbEVsZW1lbnQud2luZG93P3AuUE9TSVRJT046cC5PRkZTRVQsaT1cImF1dG9cIj09PXRoaXMuX2NvbmZpZy5tZXRob2Q/bjp0aGlzLl9jb25maWcubWV0aG9kLG89aT09PXAuUE9TSVRJT04/dGhpcy5fZ2V0U2Nyb2xsVG9wKCk6MDt0aGlzLl9vZmZzZXRzPVtdLHRoaXMuX3RhcmdldHM9W10sdGhpcy5fc2Nyb2xsSGVpZ2h0PXRoaXMuX2dldFNjcm9sbEhlaWdodCgpO3ZhciBzPXQubWFrZUFycmF5KHQodGhpcy5fc2VsZWN0b3IpKTtzLm1hcChmdW5jdGlvbihlKXt2YXIgbj12b2lkIDAscz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIHMmJihuPXQocylbMF0pLG4mJihuLm9mZnNldFdpZHRofHxuLm9mZnNldEhlaWdodCk/W3QobilbaV0oKS50b3ArbyxzXTpudWxsfSkuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiB0fSkuc29ydChmdW5jdGlvbih0LGUpe3JldHVybiB0WzBdLWVbMF19KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UuX29mZnNldHMucHVzaCh0WzBdKSxlLl90YXJnZXRzLnB1c2godFsxXSl9KX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub2ZmKGwpLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9zY3JvbGxFbGVtZW50PW51bGwsdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fc2VsZWN0b3I9bnVsbCx0aGlzLl9vZmZzZXRzPW51bGwsdGhpcy5fdGFyZ2V0cz1udWxsLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe2lmKG49dC5leHRlbmQoe30sdSxuKSxcInN0cmluZ1wiIT10eXBlb2Ygbi50YXJnZXQpe3ZhciBpPXQobi50YXJnZXQpLmF0dHIoXCJpZFwiKTtpfHwoaT1yLmdldFVJRChlKSx0KG4udGFyZ2V0KS5hdHRyKFwiaWRcIixpKSksbi50YXJnZXQ9XCIjXCIraX1yZXR1cm4gci50eXBlQ2hlY2tDb25maWcoZSxuLGQpLG59LGgucHJvdG90eXBlLl9nZXRTY3JvbGxUb3A9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudD09PXdpbmRvdz90aGlzLl9zY3JvbGxFbGVtZW50LnBhZ2VZT2Zmc2V0OnRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsVG9wfSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsSGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsSGVpZ2h0fHxNYXRoLm1heChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KX0saC5wcm90b3R5cGUuX2dldE9mZnNldEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50PT09d2luZG93P3dpbmRvdy5pbm5lckhlaWdodDp0aGlzLl9zY3JvbGxFbGVtZW50Lm9mZnNldEhlaWdodH0saC5wcm90b3R5cGUuX3Byb2Nlc3M9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9nZXRTY3JvbGxUb3AoKSt0aGlzLl9jb25maWcub2Zmc2V0LGU9dGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KCksbj10aGlzLl9jb25maWcub2Zmc2V0K2UtdGhpcy5fZ2V0T2Zmc2V0SGVpZ2h0KCk7aWYodGhpcy5fc2Nyb2xsSGVpZ2h0IT09ZSYmdGhpcy5yZWZyZXNoKCksdD49bil7dmFyIGk9dGhpcy5fdGFyZ2V0c1t0aGlzLl90YXJnZXRzLmxlbmd0aC0xXTtyZXR1cm4gdm9pZCh0aGlzLl9hY3RpdmVUYXJnZXQhPT1pJiZ0aGlzLl9hY3RpdmF0ZShpKSl9aWYodGhpcy5fYWN0aXZlVGFyZ2V0JiZ0PHRoaXMuX29mZnNldHNbMF0mJnRoaXMuX29mZnNldHNbMF0+MClyZXR1cm4gdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdm9pZCB0aGlzLl9jbGVhcigpO2Zvcih2YXIgbz10aGlzLl9vZmZzZXRzLmxlbmd0aDtvLS07KXt2YXIgcj10aGlzLl9hY3RpdmVUYXJnZXQhPT10aGlzLl90YXJnZXRzW29dJiZ0Pj10aGlzLl9vZmZzZXRzW29dJiYodm9pZCAwPT09dGhpcy5fb2Zmc2V0c1tvKzFdfHx0PHRoaXMuX29mZnNldHNbbysxXSk7ciYmdGhpcy5fYWN0aXZhdGUodGhpcy5fdGFyZ2V0c1tvXSl9fSxoLnByb3RvdHlwZS5fYWN0aXZhdGU9ZnVuY3Rpb24oZSl7dGhpcy5fYWN0aXZlVGFyZ2V0PWUsdGhpcy5fY2xlYXIoKTt2YXIgbj10aGlzLl9zZWxlY3Rvci5zcGxpdChcIixcIik7bj1uLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdCsnW2RhdGEtdGFyZ2V0PVwiJytlKydcIl0sJysodCsnW2hyZWY9XCInK2UrJ1wiXScpfSk7dmFyIGk9dChuLmpvaW4oXCIsXCIpKTtpLmhhc0NsYXNzKF8uRFJPUERPV05fSVRFTSk/KGkuY2xvc2VzdChnLkRST1BET1dOKS5maW5kKGcuRFJPUERPV05fVE9HR0xFKS5hZGRDbGFzcyhfLkFDVElWRSksaS5hZGRDbGFzcyhfLkFDVElWRSkpOmkucGFyZW50cyhnLkxJKS5maW5kKFwiPiBcIitnLk5BVl9MSU5LUykuYWRkQ2xhc3MoXy5BQ1RJVkUpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkudHJpZ2dlcihmLkFDVElWQVRFLHtyZWxhdGVkVGFyZ2V0OmV9KX0saC5wcm90b3R5cGUuX2NsZWFyPWZ1bmN0aW9uKCl7dCh0aGlzLl9zZWxlY3RvcikuZmlsdGVyKGcuQUNUSVZFKS5yZW1vdmVDbGFzcyhfLkFDVElWRSl9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlO1xuaWYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW5bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7bltlXSgpfX0pfSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHV9fV0pLGh9KCk7cmV0dXJuIHQod2luZG93KS5vbihmLkxPQURfREFUQV9BUEksZnVuY3Rpb24oKXtmb3IodmFyIGU9dC5tYWtlQXJyYXkodChnLkRBVEFfU1BZKSksbj1lLmxlbmd0aDtuLS07KXt2YXIgaT10KGVbbl0pO20uX2pRdWVyeUludGVyZmFjZS5jYWxsKGksaS5kYXRhKCkpfX0pLHQuZm5bZV09bS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9bSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLG0uX2pRdWVyeUludGVyZmFjZX0sbX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cInRhYlwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLnRhYlwiLGE9XCIuXCIrcyxsPVwiLmRhdGEtYXBpXCIsaD10LmZuW2VdLGM9MTUwLHU9e0hJREU6XCJoaWRlXCIrYSxISURERU46XCJoaWRkZW5cIithLFNIT1c6XCJzaG93XCIrYSxTSE9XTjpcInNob3duXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsfSxkPXtEUk9QRE9XTl9NRU5VOlwiZHJvcGRvd24tbWVudVwiLEFDVElWRTpcImFjdGl2ZVwiLERJU0FCTEVEOlwiZGlzYWJsZWRcIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LGY9e0E6XCJhXCIsTEk6XCJsaVwiLERST1BET1dOOlwiLmRyb3Bkb3duXCIsTElTVDpcInVsOm5vdCguZHJvcGRvd24tbWVudSksIG9sOm5vdCguZHJvcGRvd24tbWVudSksIG5hdjpub3QoLmRyb3Bkb3duLW1lbnUpXCIsRkFERV9DSElMRDpcIj4gLm5hdi1pdGVtIC5mYWRlLCA+IC5mYWRlXCIsQUNUSVZFOlwiLmFjdGl2ZVwiLEFDVElWRV9DSElMRDpcIj4gLm5hdi1pdGVtID4gLmFjdGl2ZSwgPiAuYWN0aXZlXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cInRhYlwiXSwgW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsRFJPUERPV05fVE9HR0xFOlwiLmRyb3Bkb3duLXRvZ2dsZVwiLERST1BET1dOX0FDVElWRV9DSElMRDpcIj4gLmRyb3Bkb3duLW1lbnUgLmFjdGl2ZVwifSxfPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10fXJldHVybiBlLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZighKHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZSYmdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlPT09Tm9kZS5FTEVNRU5UX05PREUmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZC5BQ1RJVkUpfHx0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGQuRElTQUJMRUQpKSl7dmFyIG49dm9pZCAwLGk9dm9pZCAwLG89dCh0aGlzLl9lbGVtZW50KS5jbG9zZXN0KGYuTElTVClbMF0scz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcy5fZWxlbWVudCk7byYmKGk9dC5tYWtlQXJyYXkodChvKS5maW5kKGYuQUNUSVZFKSksaT1pW2kubGVuZ3RoLTFdKTt2YXIgYT10LkV2ZW50KHUuSElERSx7cmVsYXRlZFRhcmdldDp0aGlzLl9lbGVtZW50fSksbD10LkV2ZW50KHUuU0hPVyx7cmVsYXRlZFRhcmdldDppfSk7aWYoaSYmdChpKS50cmlnZ2VyKGEpLHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihsKSwhbC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmIWEuaXNEZWZhdWx0UHJldmVudGVkKCkpe3MmJihuPXQocylbMF0pLHRoaXMuX2FjdGl2YXRlKHRoaXMuX2VsZW1lbnQsbyk7dmFyIGg9ZnVuY3Rpb24oKXt2YXIgbj10LkV2ZW50KHUuSElEREVOLHtyZWxhdGVkVGFyZ2V0OmUuX2VsZW1lbnR9KSxvPXQuRXZlbnQodS5TSE9XTix7cmVsYXRlZFRhcmdldDppfSk7dChpKS50cmlnZ2VyKG4pLHQoZS5fZWxlbWVudCkudHJpZ2dlcihvKX07bj90aGlzLl9hY3RpdmF0ZShuLG4ucGFyZW50Tm9kZSxoKTpoKCl9fX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlQ2xhc3ModGhpcy5fZWxlbWVudCxzKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9hY3RpdmF0ZT1mdW5jdGlvbihlLG4saSl7dmFyIG89dGhpcyxzPXQobikuZmluZChmLkFDVElWRV9DSElMRClbMF0sYT1pJiZyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiYocyYmdChzKS5oYXNDbGFzcyhkLkZBREUpfHxCb29sZWFuKHQobikuZmluZChmLkZBREVfQ0hJTEQpWzBdKSksbD1mdW5jdGlvbigpe3JldHVybiBvLl90cmFuc2l0aW9uQ29tcGxldGUoZSxzLGEsaSl9O3MmJmE/dChzKS5vbmUoci5UUkFOU0lUSU9OX0VORCxsKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjKTpsKCkscyYmdChzKS5yZW1vdmVDbGFzcyhkLlNIT1cpfSxlLnByb3RvdHlwZS5fdHJhbnNpdGlvbkNvbXBsZXRlPWZ1bmN0aW9uKGUsbixpLG8pe2lmKG4pe3QobikucmVtb3ZlQ2xhc3MoZC5BQ1RJVkUpO3ZhciBzPXQobi5wYXJlbnROb2RlKS5maW5kKGYuRFJPUERPV05fQUNUSVZFX0NISUxEKVswXTtzJiZ0KHMpLnJlbW92ZUNsYXNzKGQuQUNUSVZFKSxuLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMSl9aWYodChlKS5hZGRDbGFzcyhkLkFDVElWRSksZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApLGk/KHIucmVmbG93KGUpLHQoZSkuYWRkQ2xhc3MoZC5TSE9XKSk6dChlKS5yZW1vdmVDbGFzcyhkLkZBREUpLGUucGFyZW50Tm9kZSYmdChlLnBhcmVudE5vZGUpLmhhc0NsYXNzKGQuRFJPUERPV05fTUVOVSkpe3ZhciBhPXQoZSkuY2xvc2VzdChmLkRST1BET1dOKVswXTthJiZ0KGEpLmZpbmQoZi5EUk9QRE9XTl9UT0dHTEUpLmFkZENsYXNzKGQuQUNUSVZFKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCl9byYmbygpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcyksbz1pLmRhdGEocyk7aWYob3x8KG89bmV3IGUodGhpcyksaS5kYXRhKHMsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBuKXtpZih2b2lkIDA9PT1vW25dKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytuKydcIicpO29bbl0oKX19KX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKHUuQ0xJQ0tfREFUQV9BUEksZi5EQVRBX1RPR0dMRSxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCksXy5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodCh0aGlzKSxcInNob3dcIil9KSx0LmZuW2VdPV8uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPV8sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxfLl9qUXVlcnlJbnRlcmZhY2V9LF99KGpRdWVyeSksZnVuY3Rpb24odCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFRldGhlcil0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAgdG9vbHRpcHMgcmVxdWlyZSBUZXRoZXIgKGh0dHA6Ly90ZXRoZXIuaW8vKVwiKTt2YXIgZT1cInRvb2x0aXBcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy50b29sdGlwXCIsbD1cIi5cIithLGg9dC5mbltlXSxjPTE1MCx1PVwiYnMtdGV0aGVyXCIsZD17YW5pbWF0aW9uOiEwLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLHRyaWdnZXI6XCJob3ZlciBmb2N1c1wiLHRpdGxlOlwiXCIsZGVsYXk6MCxodG1sOiExLHNlbGVjdG9yOiExLHBsYWNlbWVudDpcInRvcFwiLG9mZnNldDpcIjAgMFwiLGNvbnN0cmFpbnRzOltdLGNvbnRhaW5lcjohMX0sZj17YW5pbWF0aW9uOlwiYm9vbGVhblwiLHRlbXBsYXRlOlwic3RyaW5nXCIsdGl0bGU6XCIoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pXCIsdHJpZ2dlcjpcInN0cmluZ1wiLGRlbGF5OlwiKG51bWJlcnxvYmplY3QpXCIsaHRtbDpcImJvb2xlYW5cIixzZWxlY3RvcjpcIihzdHJpbmd8Ym9vbGVhbilcIixwbGFjZW1lbnQ6XCIoc3RyaW5nfGZ1bmN0aW9uKVwiLG9mZnNldDpcInN0cmluZ1wiLGNvbnN0cmFpbnRzOlwiYXJyYXlcIixjb250YWluZXI6XCIoc3RyaW5nfGVsZW1lbnR8Ym9vbGVhbilcIn0sXz17VE9QOlwiYm90dG9tIGNlbnRlclwiLFJJR0hUOlwibWlkZGxlIGxlZnRcIixCT1RUT006XCJ0b3AgY2VudGVyXCIsTEVGVDpcIm1pZGRsZSByaWdodFwifSxnPXtTSE9XOlwic2hvd1wiLE9VVDpcIm91dFwifSxwPXtISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxTSE9XOlwic2hvd1wiK2wsU0hPV046XCJzaG93blwiK2wsSU5TRVJURUQ6XCJpbnNlcnRlZFwiK2wsQ0xJQ0s6XCJjbGlja1wiK2wsRk9DVVNJTjpcImZvY3VzaW5cIitsLEZPQ1VTT1VUOlwiZm9jdXNvdXRcIitsLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrbCxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2x9LG09e0ZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sRT17VE9PTFRJUDpcIi50b29sdGlwXCIsVE9PTFRJUF9JTk5FUjpcIi50b29sdGlwLWlubmVyXCJ9LHY9e2VsZW1lbnQ6ITEsZW5hYmxlZDohMX0sVD17SE9WRVI6XCJob3ZlclwiLEZPQ1VTOlwiZm9jdXNcIixDTElDSzpcImNsaWNrXCIsTUFOVUFMOlwibWFudWFsXCJ9LEk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKHQsZSl7bih0aGlzLGgpLHRoaXMuX2lzRW5hYmxlZD0hMCx0aGlzLl90aW1lb3V0PTAsdGhpcy5faG92ZXJTdGF0ZT1cIlwiLHRoaXMuX2FjdGl2ZVRyaWdnZXI9e30sdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX3RldGhlcj1udWxsLHRoaXMuZWxlbWVudD10LHRoaXMuY29uZmlnPXRoaXMuX2dldENvbmZpZyhlKSx0aGlzLnRpcD1udWxsLHRoaXMuX3NldExpc3RlbmVycygpfXJldHVybiBoLnByb3RvdHlwZS5lbmFibGU9ZnVuY3Rpb24oKXt0aGlzLl9pc0VuYWJsZWQ9ITB9LGgucHJvdG90eXBlLmRpc2FibGU9ZnVuY3Rpb24oKXt0aGlzLl9pc0VuYWJsZWQ9ITF9LGgucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQ9ZnVuY3Rpb24oKXt0aGlzLl9pc0VuYWJsZWQ9IXRoaXMuX2lzRW5hYmxlZH0saC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGUpe2lmKGUpe3ZhciBuPXRoaXMuY29uc3RydWN0b3IuREFUQV9LRVksaT10KGUuY3VycmVudFRhcmdldCkuZGF0YShuKTtpfHwoaT1uZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsdGhpcy5fZ2V0RGVsZWdhdGVDb25maWcoKSksdChlLmN1cnJlbnRUYXJnZXQpLmRhdGEobixpKSksaS5fYWN0aXZlVHJpZ2dlci5jbGljaz0haS5fYWN0aXZlVHJpZ2dlci5jbGljayxpLl9pc1dpdGhBY3RpdmVUcmlnZ2VyKCk/aS5fZW50ZXIobnVsbCxpKTppLl9sZWF2ZShudWxsLGkpfWVsc2V7aWYodCh0aGlzLmdldFRpcEVsZW1lbnQoKSkuaGFzQ2xhc3MobS5TSE9XKSlyZXR1cm4gdm9pZCB0aGlzLl9sZWF2ZShudWxsLHRoaXMpO3RoaXMuX2VudGVyKG51bGwsdGhpcyl9fSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXQpLHRoaXMuY2xlYW51cFRldGhlcigpLHQucmVtb3ZlRGF0YSh0aGlzLmVsZW1lbnQsdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSksdCh0aGlzLmVsZW1lbnQpLm9mZih0aGlzLmNvbnN0cnVjdG9yLkVWRU5UX0tFWSksdCh0aGlzLmVsZW1lbnQpLmNsb3Nlc3QoXCIubW9kYWxcIikub2ZmKFwiaGlkZS5icy5tb2RhbFwiKSx0aGlzLnRpcCYmdCh0aGlzLnRpcCkucmVtb3ZlKCksdGhpcy5faXNFbmFibGVkPW51bGwsdGhpcy5fdGltZW91dD1udWxsLHRoaXMuX2hvdmVyU3RhdGU9bnVsbCx0aGlzLl9hY3RpdmVUcmlnZ2VyPW51bGwsdGhpcy5fdGV0aGVyPW51bGwsdGhpcy5lbGVtZW50PW51bGwsdGhpcy5jb25maWc9bnVsbCx0aGlzLnRpcD1udWxsfSxoLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZihcIm5vbmVcIj09PXQodGhpcy5lbGVtZW50KS5jc3MoXCJkaXNwbGF5XCIpKXRocm93IG5ldyBFcnJvcihcIlBsZWFzZSB1c2Ugc2hvdyBvbiB2aXNpYmxlIGVsZW1lbnRzXCIpO3ZhciBuPXQuRXZlbnQodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5TSE9XKTtpZih0aGlzLmlzV2l0aENvbnRlbnQoKSYmdGhpcy5faXNFbmFibGVkKXtpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiVG9vbHRpcCBpcyB0cmFuc2l0aW9uaW5nXCIpO3QodGhpcy5lbGVtZW50KS50cmlnZ2VyKG4pO3ZhciBpPXQuY29udGFpbnModGhpcy5lbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LHRoaXMuZWxlbWVudCk7aWYobi5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8IWkpcmV0dXJuO3ZhciBvPXRoaXMuZ2V0VGlwRWxlbWVudCgpLHM9ci5nZXRVSUQodGhpcy5jb25zdHJ1Y3Rvci5OQU1FKTtvLnNldEF0dHJpYnV0ZShcImlkXCIscyksdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIixzKSx0aGlzLnNldENvbnRlbnQoKSx0aGlzLmNvbmZpZy5hbmltYXRpb24mJnQobykuYWRkQ2xhc3MobS5GQURFKTt2YXIgYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy5wbGFjZW1lbnQ/dGhpcy5jb25maWcucGxhY2VtZW50LmNhbGwodGhpcyxvLHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcucGxhY2VtZW50LGw9dGhpcy5fZ2V0QXR0YWNobWVudChhKSxjPXRoaXMuY29uZmlnLmNvbnRhaW5lcj09PSExP2RvY3VtZW50LmJvZHk6dCh0aGlzLmNvbmZpZy5jb250YWluZXIpO3QobykuZGF0YSh0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZLHRoaXMpLmFwcGVuZFRvKGMpLHQodGhpcy5lbGVtZW50KS50cmlnZ2VyKHRoaXMuY29uc3RydWN0b3IuRXZlbnQuSU5TRVJURUQpLHRoaXMuX3RldGhlcj1uZXcgVGV0aGVyKHthdHRhY2htZW50OmwsZWxlbWVudDpvLHRhcmdldDp0aGlzLmVsZW1lbnQsY2xhc3Nlczp2LGNsYXNzUHJlZml4OnUsb2Zmc2V0OnRoaXMuY29uZmlnLm9mZnNldCxjb25zdHJhaW50czp0aGlzLmNvbmZpZy5jb25zdHJhaW50cyxhZGRUYXJnZXRDbGFzc2VzOiExfSksci5yZWZsb3cobyksdGhpcy5fdGV0aGVyLnBvc2l0aW9uKCksdChvKS5hZGRDbGFzcyhtLlNIT1cpO3ZhciBkPWZ1bmN0aW9uKCl7dmFyIG49ZS5faG92ZXJTdGF0ZTtlLl9ob3ZlclN0YXRlPW51bGwsZS5faXNUcmFuc2l0aW9uaW5nPSExLHQoZS5lbGVtZW50KS50cmlnZ2VyKGUuY29uc3RydWN0b3IuRXZlbnQuU0hPV04pLG49PT1nLk9VVCYmZS5fbGVhdmUobnVsbCxlKX07aWYoci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLnRpcCkuaGFzQ2xhc3MobS5GQURFKSlyZXR1cm4gdGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwLHZvaWQgdCh0aGlzLnRpcCkub25lKHIuVFJBTlNJVElPTl9FTkQsZCkuZW11bGF0ZVRyYW5zaXRpb25FbmQoaC5fVFJBTlNJVElPTl9EVVJBVElPTik7ZCgpfX0saC5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9dGhpcy5nZXRUaXBFbGVtZW50KCksbz10LkV2ZW50KHRoaXMuY29uc3RydWN0b3IuRXZlbnQuSElERSk7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIlRvb2x0aXAgaXMgdHJhbnNpdGlvbmluZ1wiKTt2YXIgcz1mdW5jdGlvbigpe24uX2hvdmVyU3RhdGUhPT1nLlNIT1cmJmkucGFyZW50Tm9kZSYmaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGkpLG4uZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpLHQobi5lbGVtZW50KS50cmlnZ2VyKG4uY29uc3RydWN0b3IuRXZlbnQuSElEREVOKSxuLl9pc1RyYW5zaXRpb25pbmc9ITEsbi5jbGVhbnVwVGV0aGVyKCksZSYmZSgpfTt0KHRoaXMuZWxlbWVudCkudHJpZ2dlcihvKSxvLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwodChpKS5yZW1vdmVDbGFzcyhtLlNIT1cpLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5DTElDS109ITEsdGhpcy5fYWN0aXZlVHJpZ2dlcltULkZPQ1VTXT0hMSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuSE9WRVJdPSExLHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy50aXApLmhhc0NsYXNzKG0uRkFERSk/KHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCx0KGkpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpKTpzKCksdGhpcy5faG92ZXJTdGF0ZT1cIlwiKX0saC5wcm90b3R5cGUuaXNXaXRoQ29udGVudD1mdW5jdGlvbigpe3JldHVybiBCb29sZWFuKHRoaXMuZ2V0VGl0bGUoKSl9LGgucHJvdG90eXBlLmdldFRpcEVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aXA9dGhpcy50aXB8fHQodGhpcy5jb25maWcudGVtcGxhdGUpWzBdfSxoLnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzLmdldFRpcEVsZW1lbnQoKSk7dGhpcy5zZXRFbGVtZW50Q29udGVudChlLmZpbmQoRS5UT09MVElQX0lOTkVSKSx0aGlzLmdldFRpdGxlKCkpLGUucmVtb3ZlQ2xhc3MobS5GQURFK1wiIFwiK20uU0hPVyksdGhpcy5jbGVhbnVwVGV0aGVyKCl9LGgucHJvdG90eXBlLnNldEVsZW1lbnRDb250ZW50PWZ1bmN0aW9uKGUsbil7dmFyIG89dGhpcy5jb25maWcuaHRtbDtcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBuP1widW5kZWZpbmVkXCI6aShuKSkmJihuLm5vZGVUeXBlfHxuLmpxdWVyeSk/bz90KG4pLnBhcmVudCgpLmlzKGUpfHxlLmVtcHR5KCkuYXBwZW5kKG4pOmUudGV4dCh0KG4pLnRleHQoKSk6ZVtvP1wiaHRtbFwiOlwidGV4dFwiXShuKX0saC5wcm90b3R5cGUuZ2V0VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKTtyZXR1cm4gdHx8KHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5jb25maWcudGl0bGU/dGhpcy5jb25maWcudGl0bGUuY2FsbCh0aGlzLmVsZW1lbnQpOnRoaXMuY29uZmlnLnRpdGxlKSx0fSxoLnByb3RvdHlwZS5jbGVhbnVwVGV0aGVyPWZ1bmN0aW9uKCl7dGhpcy5fdGV0aGVyJiZ0aGlzLl90ZXRoZXIuZGVzdHJveSgpfSxoLnByb3RvdHlwZS5fZ2V0QXR0YWNobWVudD1mdW5jdGlvbih0KXtyZXR1cm4gX1t0LnRvVXBwZXJDYXNlKCldfSxoLnByb3RvdHlwZS5fc2V0TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxuPXRoaXMuY29uZmlnLnRyaWdnZXIuc3BsaXQoXCIgXCIpO24uZm9yRWFjaChmdW5jdGlvbihuKXtpZihcImNsaWNrXCI9PT1uKXQoZS5lbGVtZW50KS5vbihlLmNvbnN0cnVjdG9yLkV2ZW50LkNMSUNLLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLnRvZ2dsZSh0KX0pO2Vsc2UgaWYobiE9PVQuTUFOVUFMKXt2YXIgaT1uPT09VC5IT1ZFUj9lLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFRU5URVI6ZS5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU0lOLG89bj09PVQuSE9WRVI/ZS5jb25zdHJ1Y3Rvci5FdmVudC5NT1VTRUxFQVZFOmUuY29uc3RydWN0b3IuRXZlbnQuRk9DVVNPVVQ7dChlLmVsZW1lbnQpLm9uKGksZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUuX2VudGVyKHQpfSkub24obyxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS5fbGVhdmUodCl9KX10KGUuZWxlbWVudCkuY2xvc2VzdChcIi5tb2RhbFwiKS5vbihcImhpZGUuYnMubW9kYWxcIixmdW5jdGlvbigpe3JldHVybiBlLmhpZGUoKX0pfSksdGhpcy5jb25maWcuc2VsZWN0b3I/dGhpcy5jb25maWc9dC5leHRlbmQoe30sdGhpcy5jb25maWcse3RyaWdnZXI6XCJtYW51YWxcIixzZWxlY3RvcjpcIlwifSk6dGhpcy5fZml4VGl0bGUoKX0saC5wcm90b3R5cGUuX2ZpeFRpdGxlPWZ1bmN0aW9uKCl7dmFyIHQ9aSh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSk7KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKXx8XCJzdHJpbmdcIiE9PXQpJiYodGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIix0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGl0bGVcIil8fFwiXCIpLHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLFwiXCIpKX0saC5wcm90b3R5cGUuX2VudGVyPWZ1bmN0aW9uKGUsbil7dmFyIGk9dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWTtyZXR1cm4gbj1ufHx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpKSxufHwobj1uZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsdGhpcy5fZ2V0RGVsZWdhdGVDb25maWcoKSksdChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSxuKSksZSYmKG4uX2FjdGl2ZVRyaWdnZXJbXCJmb2N1c2luXCI9PT1lLnR5cGU/VC5GT0NVUzpULkhPVkVSXT0hMCksdChuLmdldFRpcEVsZW1lbnQoKSkuaGFzQ2xhc3MobS5TSE9XKXx8bi5faG92ZXJTdGF0ZT09PWcuU0hPVz92b2lkKG4uX2hvdmVyU3RhdGU9Zy5TSE9XKTooY2xlYXJUaW1lb3V0KG4uX3RpbWVvdXQpLG4uX2hvdmVyU3RhdGU9Zy5TSE9XLG4uY29uZmlnLmRlbGF5JiZuLmNvbmZpZy5kZWxheS5zaG93P3ZvaWQobi5fdGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZT09PWcuU0hPVyYmbi5zaG93KCl9LG4uY29uZmlnLmRlbGF5LnNob3cpKTp2b2lkIG4uc2hvdygpKX0saC5wcm90b3R5cGUuX2xlYXZlPWZ1bmN0aW9uKGUsbil7dmFyIGk9dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWTtpZihuPW58fHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGkpLG58fChuPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpLG4pKSxlJiYobi5fYWN0aXZlVHJpZ2dlcltcImZvY3Vzb3V0XCI9PT1lLnR5cGU/VC5GT0NVUzpULkhPVkVSXT0hMSksIW4uX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKSlyZXR1cm4gY2xlYXJUaW1lb3V0KG4uX3RpbWVvdXQpLG4uX2hvdmVyU3RhdGU9Zy5PVVQsbi5jb25maWcuZGVsYXkmJm4uY29uZmlnLmRlbGF5LmhpZGU/dm9pZChuLl90aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlPT09Zy5PVVQmJm4uaGlkZSgpfSxuLmNvbmZpZy5kZWxheS5oaWRlKSk6dm9pZCBuLmhpZGUoKX0saC5wcm90b3R5cGUuX2lzV2l0aEFjdGl2ZVRyaWdnZXI9ZnVuY3Rpb24oKXtmb3IodmFyIHQgaW4gdGhpcy5fYWN0aXZlVHJpZ2dlcilpZih0aGlzLl9hY3RpdmVUcmlnZ2VyW3RdKXJldHVybiEwO3JldHVybiExfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCx0KHRoaXMuZWxlbWVudCkuZGF0YSgpLG4pLG4uZGVsYXkmJlwibnVtYmVyXCI9PXR5cGVvZiBuLmRlbGF5JiYobi5kZWxheT17c2hvdzpuLmRlbGF5LGhpZGU6bi5kZWxheX0pLHIudHlwZUNoZWNrQ29uZmlnKGUsbix0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlKSxufSxoLnByb3RvdHlwZS5fZ2V0RGVsZWdhdGVDb25maWc9ZnVuY3Rpb24oKXt2YXIgdD17fTtpZih0aGlzLmNvbmZpZylmb3IodmFyIGUgaW4gdGhpcy5jb25maWcpdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0W2VdIT09dGhpcy5jb25maWdbZV0mJih0W2VdPXRoaXMuY29uZmlnW2VdKTtyZXR1cm4gdH0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLmRhdGEoYSksbz1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmU7aWYoKG58fCEvZGlzcG9zZXxoaWRlLy50ZXN0KGUpKSYmKG58fChuPW5ldyBoKHRoaXMsbyksdCh0aGlzKS5kYXRhKGEsbikpLFwic3RyaW5nXCI9PXR5cGVvZiBlKSl7aWYodm9pZCAwPT09bltlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtuW2VdKCl9fSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZH19LHtrZXk6XCJOQU1FXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGV9fSx7a2V5OlwiREFUQV9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYX19LHtrZXk6XCJFdmVudFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBwfX0se2tleTpcIkVWRU5UX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBsfX0se2tleTpcIkRlZmF1bHRUeXBlXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ9fV0pLGh9KCk7cmV0dXJuIHQuZm5bZV09SS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9SSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLEkuX2pRdWVyeUludGVyZmFjZX0sSX0oalF1ZXJ5KSk7KGZ1bmN0aW9uKHIpe3ZhciBhPVwicG9wb3ZlclwiLGw9XCI0LjAuMC1hbHBoYS42XCIsaD1cImJzLnBvcG92ZXJcIixjPVwiLlwiK2gsdT1yLmZuW2FdLGQ9ci5leHRlbmQoe30scy5EZWZhdWx0LHtwbGFjZW1lbnQ6XCJyaWdodFwiLHRyaWdnZXI6XCJjbGlja1wiLGNvbnRlbnQ6XCJcIix0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nfSksZj1yLmV4dGVuZCh7fSxzLkRlZmF1bHRUeXBlLHtjb250ZW50OlwiKHN0cmluZ3xlbGVtZW50fGZ1bmN0aW9uKVwifSksXz17RkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxnPXtUSVRMRTpcIi5wb3BvdmVyLXRpdGxlXCIsQ09OVEVOVDpcIi5wb3BvdmVyLWNvbnRlbnRcIn0scD17SElERTpcImhpZGVcIitjLEhJRERFTjpcImhpZGRlblwiK2MsU0hPVzpcInNob3dcIitjLFNIT1dOOlwic2hvd25cIitjLElOU0VSVEVEOlwiaW5zZXJ0ZWRcIitjLENMSUNLOlwiY2xpY2tcIitjLEZPQ1VTSU46XCJmb2N1c2luXCIrYyxGT0NVU09VVDpcImZvY3Vzb3V0XCIrYyxNT1VTRUVOVEVSOlwibW91c2VlbnRlclwiK2MsTU9VU0VMRUFWRTpcIm1vdXNlbGVhdmVcIitjfSxtPWZ1bmN0aW9uKHMpe2Z1bmN0aW9uIHUoKXtyZXR1cm4gbih0aGlzLHUpLHQodGhpcyxzLmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9cmV0dXJuIGUodSxzKSx1LnByb3RvdHlwZS5pc1dpdGhDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VGl0bGUoKXx8dGhpcy5fZ2V0Q29udGVudCgpfSx1LnByb3RvdHlwZS5nZXRUaXBFbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlwPXRoaXMudGlwfHxyKHRoaXMuY29uZmlnLnRlbXBsYXRlKVswXX0sdS5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciB0PXIodGhpcy5nZXRUaXBFbGVtZW50KCkpO3RoaXMuc2V0RWxlbWVudENvbnRlbnQodC5maW5kKGcuVElUTEUpLHRoaXMuZ2V0VGl0bGUoKSksdGhpcy5zZXRFbGVtZW50Q29udGVudCh0LmZpbmQoZy5DT05URU5UKSx0aGlzLl9nZXRDb250ZW50KCkpLHQucmVtb3ZlQ2xhc3MoXy5GQURFK1wiIFwiK18uU0hPVyksdGhpcy5jbGVhbnVwVGV0aGVyKCl9LHUucHJvdG90eXBlLl9nZXRDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbnRlbnRcIil8fChcImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy5jb250ZW50P3RoaXMuY29uZmlnLmNvbnRlbnQuY2FsbCh0aGlzLmVsZW1lbnQpOnRoaXMuY29uZmlnLmNvbnRlbnQpfSx1Ll9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPXIodGhpcykuZGF0YShoKSxuPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjppKHQpKT90Om51bGw7aWYoKGV8fCEvZGVzdHJveXxoaWRlLy50ZXN0KHQpKSYmKGV8fChlPW5ldyB1KHRoaXMsbikscih0aGlzKS5kYXRhKGgsZSkpLFwic3RyaW5nXCI9PXR5cGVvZiB0KSl7aWYodm9pZCAwPT09ZVt0XSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrdCsnXCInKTtlW3RdKCl9fSl9LG8odSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBsfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZH19LHtrZXk6XCJOQU1FXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGF9fSx7a2V5OlwiREFUQV9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaH19LHtrZXk6XCJFdmVudFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBwfX0se2tleTpcIkVWRU5UX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBjfX0se2tleTpcIkRlZmF1bHRUeXBlXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ9fV0pLHV9KHMpO3JldHVybiByLmZuW2FdPW0uX2pRdWVyeUludGVyZmFjZSxyLmZuW2FdLkNvbnN0cnVjdG9yPW0sci5mblthXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHIuZm5bYV09dSxtLl9qUXVlcnlJbnRlcmZhY2V9LG19KShqUXVlcnkpfSgpOyIsIiQoJy5IYW1idXJnZXInKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnT3BlbicpO1xuICAgICQoJy5TdWItaGVhZGVyX2JhcicpLnRvZ2dsZUNsYXNzKCdIYW1idXJnZXItb3BlbicpO1xuICAgIGNvbnNvbGUubG9nKCd0b2dnbGVkJylcbn0pOyIsIiIsIiQoJ3NlbGVjdCcpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCQodGhpcykudmFsKCkgPT0gXCJtb2RhbC10cmlnZ2VyXCIpIHtcbiAgICAgICAgJCgnI215TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgIH1cbn0pOyIsIiIsIiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7ICAgIFxuICAgIHZhciBzY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAoc2Nyb2xsID49IDUwKSB7XG4gICAgICAgICQoXCIuU3ViLWhlYWRlcl9iYXJcIikuYWRkQ2xhc3MoXCJTdGlja3ktaGVhZGVyXCIpO1xuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikuYWRkQ2xhc3MoXCJPbmx5XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCIuU3ViLWhlYWRlcl9iYXJcIikucmVtb3ZlQ2xhc3MoXCJTdGlja3ktaGVhZGVyXCIpO1xuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikucmVtb3ZlQ2xhc3MoXCJPbmx5XCIpO1xuICAgIH1cbn0pOyJdfQ==
