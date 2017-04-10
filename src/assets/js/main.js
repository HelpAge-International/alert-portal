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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1hZG1pbi5qcyIsImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImZvcm1zLmpzIiwiaW5pdGlhbF9fZHJvcGRvd24tbW9kYWwtdHJpZ2dlci5qcyIsImluaXRpYWxfX2hhbWJ1cmdlci5qcyIsImluaXRpYWxfX3N0aWNreS1uYXYuanMiLCJtYXAuanMiLCJyZXNwb25zZS1wbGFuX19tdWx0aS1zZWxlY3QuanMiLCJyZXNwb25zZS1wbGFuX19yZXZlYWwtcmliYm9uLmpzIl0sIm5hbWVzIjpbImNvdW50cnlfcmVtb3ZlZCIsImNvdW50cmllcyIsIiQiLCJsZW5ndGgiLCJoaWRlIiwic2hvdyIsImdwYUFjdGlvbkNoYW5nZWQiLCJlbGVtZW50IiwiYWRkQWN0aW9uQnV0dG9uIiwiY2hlY2tlZCIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiZmluZCIsImkiLCJlYWNoIiwiYWRkQ2xhc3MiLCJhZGREZXBhcnRtZW50TW9kYWwiLCJzZWxlY3QiLCJtb2RhbF9pZCIsImhhc0NsYXNzIiwibW9kYWwiLCJyZWFkVVJMIiwiaW5wdXQiLCJmaWxlcyIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiY3NzIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzRGF0YVVSTCIsImNoYW5nZSIsInRoaXMiLCJjbGljayIsInByZXZlbnREZWZhdWx0IiwidHJpZ2dlciIsImpRdWVyeSIsIkVycm9yIiwidCIsImZuIiwianF1ZXJ5Iiwic3BsaXQiLCJSZWZlcmVuY2VFcnJvciIsIl90eXBlb2YiLCJUeXBlRXJyb3IiLCJwcm90b3R5cGUiLCJPYmplY3QiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInZhbHVlIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJuIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvIiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJyIiwidG9TdHJpbmciLCJjYWxsIiwibWF0Y2giLCJ0b0xvd2VyQ2FzZSIsIm5vZGVUeXBlIiwiYmluZFR5cGUiLCJhIiwiZW5kIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aW5kb3ciLCJRVW5pdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImgiLCJzdHlsZSIsIm9uZSIsImMiLCJUUkFOU0lUSU9OX0VORCIsInNldFRpbWVvdXQiLCJ0cmlnZ2VyVHJhbnNpdGlvbkVuZCIsInMiLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsInN1cHBvcnRzVHJhbnNpdGlvbkVuZCIsImV2ZW50Iiwic3BlY2lhbCIsImwiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIk9UcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsImdldFVJRCIsIk1hdGgiLCJyYW5kb20iLCJnZXRFbGVtZW50QnlJZCIsImdldFNlbGVjdG9yRnJvbUVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJ0ZXN0IiwicmVmbG93Iiwib2Zmc2V0SGVpZ2h0IiwiQm9vbGVhbiIsInR5cGVDaGVja0NvbmZpZyIsImhhc093blByb3BlcnR5IiwiUmVnRXhwIiwidG9VcHBlckNhc2UiLCJ1IiwiRElTTUlTUyIsImQiLCJDTE9TRSIsIkNMT1NFRCIsIkNMSUNLX0RBVEFfQVBJIiwiZiIsIkFMRVJUIiwiRkFERSIsIlNIT1ciLCJfIiwiX2VsZW1lbnQiLCJjbG9zZSIsIl9nZXRSb290RWxlbWVudCIsIl90cmlnZ2VyQ2xvc2VFdmVudCIsImlzRGVmYXVsdFByZXZlbnRlZCIsIl9yZW1vdmVFbGVtZW50IiwiZGlzcG9zZSIsInJlbW92ZURhdGEiLCJjbG9zZXN0IiwiRXZlbnQiLCJfZGVzdHJveUVsZW1lbnQiLCJkZXRhY2giLCJyZW1vdmUiLCJfalF1ZXJ5SW50ZXJmYWNlIiwiZGF0YSIsIl9oYW5kbGVEaXNtaXNzIiwiZ2V0Iiwib24iLCJDb25zdHJ1Y3RvciIsIm5vQ29uZmxpY3QiLCJBQ1RJVkUiLCJCVVRUT04iLCJGT0NVUyIsIkRBVEFfVE9HR0xFX0NBUlJPVCIsIkRBVEFfVE9HR0xFIiwiSU5QVVQiLCJGT0NVU19CTFVSX0RBVEFfQVBJIiwidG9nZ2xlIiwidHlwZSIsImZvY3VzIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlQ2xhc3MiLCJpbnRlcnZhbCIsImtleWJvYXJkIiwic2xpZGUiLCJwYXVzZSIsIndyYXAiLCJnIiwicCIsIk5FWFQiLCJQUkVWIiwiTEVGVCIsIlJJR0hUIiwibSIsIlNMSURFIiwiU0xJRCIsIktFWURPV04iLCJNT1VTRUVOVEVSIiwiTU9VU0VMRUFWRSIsIkxPQURfREFUQV9BUEkiLCJFIiwiQ0FST1VTRUwiLCJJVEVNIiwidiIsIkFDVElWRV9JVEVNIiwiTkVYVF9QUkVWIiwiSU5ESUNBVE9SUyIsIkRBVEFfU0xJREUiLCJEQVRBX1JJREUiLCJUIiwiX2l0ZW1zIiwiX2ludGVydmFsIiwiX2FjdGl2ZUVsZW1lbnQiLCJfaXNQYXVzZWQiLCJfaXNTbGlkaW5nIiwiX2NvbmZpZyIsIl9nZXRDb25maWciLCJfaW5kaWNhdG9yc0VsZW1lbnQiLCJfYWRkRXZlbnRMaXN0ZW5lcnMiLCJuZXh0IiwiX3NsaWRlIiwibmV4dFdoZW5WaXNpYmxlIiwiaGlkZGVuIiwicHJldiIsIlBSRVZJT1VTIiwiY3ljbGUiLCJjbGVhckludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJ2aXNpYmlsaXR5U3RhdGUiLCJiaW5kIiwidG8iLCJfZ2V0SXRlbUluZGV4Iiwib2ZmIiwiZXh0ZW5kIiwiX2tleWRvd24iLCJkb2N1bWVudEVsZW1lbnQiLCJ0YWdOYW1lIiwid2hpY2giLCJtYWtlQXJyYXkiLCJpbmRleE9mIiwiX2dldEl0ZW1CeURpcmVjdGlvbiIsIl90cmlnZ2VyU2xpZGVFdmVudCIsInJlbGF0ZWRUYXJnZXQiLCJkaXJlY3Rpb24iLCJfc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudCIsImNoaWxkcmVuIiwiX2RhdGFBcGlDbGlja0hhbmRsZXIiLCJTSE9XTiIsIkhJREUiLCJISURERU4iLCJDT0xMQVBTRSIsIkNPTExBUFNJTkciLCJDT0xMQVBTRUQiLCJXSURUSCIsIkhFSUdIVCIsIkFDVElWRVMiLCJfaXNUcmFuc2l0aW9uaW5nIiwiX3RyaWdnZXJBcnJheSIsImlkIiwiX3BhcmVudCIsIl9nZXRQYXJlbnQiLCJfYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzIiwiX2dldERpbWVuc2lvbiIsImF0dHIiLCJzZXRUcmFuc2l0aW9uaW5nIiwic2xpY2UiLCJfZ2V0VGFyZ2V0RnJvbUVsZW1lbnQiLCJDTElDSyIsIkZPQ1VTSU5fREFUQV9BUEkiLCJLRVlET1dOX0RBVEFfQVBJIiwiQkFDS0RST1AiLCJESVNBQkxFRCIsIkZPUk1fQ0hJTEQiLCJST0xFX01FTlUiLCJST0xFX0xJU1RCT1giLCJOQVZCQVJfTkFWIiwiVklTSUJMRV9JVEVNUyIsImRpc2FibGVkIiwiX2dldFBhcmVudEZyb21FbGVtZW50IiwiX2NsZWFyTWVudXMiLCJjbGFzc05hbWUiLCJpbnNlcnRCZWZvcmUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjb250YWlucyIsIl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJiYWNrZHJvcCIsIkZPQ1VTSU4iLCJSRVNJWkUiLCJDTElDS19ESVNNSVNTIiwiS0VZRE9XTl9ESVNNSVNTIiwiTU9VU0VVUF9ESVNNSVNTIiwiTU9VU0VET1dOX0RJU01JU1MiLCJTQ1JPTExCQVJfTUVBU1VSRVIiLCJPUEVOIiwiRElBTE9HIiwiREFUQV9ESVNNSVNTIiwiRklYRURfQ09OVEVOVCIsIl9kaWFsb2ciLCJfYmFja2Ryb3AiLCJfaXNTaG93biIsIl9pc0JvZHlPdmVyZmxvd2luZyIsIl9pZ25vcmVCYWNrZHJvcENsaWNrIiwiX29yaWdpbmFsQm9keVBhZGRpbmciLCJfc2Nyb2xsYmFyV2lkdGgiLCJfY2hlY2tTY3JvbGxiYXIiLCJfc2V0U2Nyb2xsYmFyIiwiYm9keSIsIl9zZXRFc2NhcGVFdmVudCIsIl9zZXRSZXNpemVFdmVudCIsIl9zaG93QmFja2Ryb3AiLCJfc2hvd0VsZW1lbnQiLCJfaGlkZU1vZGFsIiwiTm9kZSIsIkVMRU1FTlRfTk9ERSIsImFwcGVuZENoaWxkIiwiZGlzcGxheSIsInJlbW92ZUF0dHJpYnV0ZSIsInNjcm9sbFRvcCIsIl9lbmZvcmNlRm9jdXMiLCJoYXMiLCJfaGFuZGxlVXBkYXRlIiwiX3Jlc2V0QWRqdXN0bWVudHMiLCJfcmVzZXRTY3JvbGxiYXIiLCJfcmVtb3ZlQmFja2Ryb3AiLCJhcHBlbmRUbyIsImN1cnJlbnRUYXJnZXQiLCJfYWRqdXN0RGlhbG9nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJjbGllbnRXaWR0aCIsImlubmVyV2lkdGgiLCJfZ2V0U2Nyb2xsYmFyV2lkdGgiLCJwYXJzZUludCIsIm9mZnNldFdpZHRoIiwiRGVmYXVsdCIsIm9mZnNldCIsIm1ldGhvZCIsIkFDVElWQVRFIiwiU0NST0xMIiwiRFJPUERPV05fSVRFTSIsIkRST1BET1dOX01FTlUiLCJOQVZfTElOSyIsIk5BViIsIkRBVEFfU1BZIiwiTElTVF9JVEVNIiwiTEkiLCJMSV9EUk9QRE9XTiIsIk5BVl9MSU5LUyIsIkRST1BET1dOIiwiRFJPUERPV05fSVRFTVMiLCJEUk9QRE9XTl9UT0dHTEUiLCJPRkZTRVQiLCJQT1NJVElPTiIsIl9zY3JvbGxFbGVtZW50IiwiX3NlbGVjdG9yIiwiX29mZnNldHMiLCJfdGFyZ2V0cyIsIl9hY3RpdmVUYXJnZXQiLCJfc2Nyb2xsSGVpZ2h0IiwiX3Byb2Nlc3MiLCJyZWZyZXNoIiwiX2dldFNjcm9sbFRvcCIsIl9nZXRTY3JvbGxIZWlnaHQiLCJtYXAiLCJ0b3AiLCJmaWx0ZXIiLCJzb3J0IiwiZm9yRWFjaCIsInB1c2giLCJwYWdlWU9mZnNldCIsIm1heCIsIl9nZXRPZmZzZXRIZWlnaHQiLCJpbm5lckhlaWdodCIsIl9hY3RpdmF0ZSIsIl9jbGVhciIsImpvaW4iLCJwYXJlbnRzIiwiQSIsIkxJU1QiLCJGQURFX0NISUxEIiwiQUNUSVZFX0NISUxEIiwiRFJPUERPV05fQUNUSVZFX0NISUxEIiwiX3RyYW5zaXRpb25Db21wbGV0ZSIsIlRldGhlciIsImFuaW1hdGlvbiIsInRlbXBsYXRlIiwidGl0bGUiLCJkZWxheSIsImh0bWwiLCJzZWxlY3RvciIsInBsYWNlbWVudCIsImNvbnN0cmFpbnRzIiwiY29udGFpbmVyIiwiVE9QIiwiQk9UVE9NIiwiT1VUIiwiSU5TRVJURUQiLCJGT0NVU09VVCIsIlRPT0xUSVAiLCJUT09MVElQX0lOTkVSIiwiZW5hYmxlZCIsIkhPVkVSIiwiTUFOVUFMIiwiSSIsIl9pc0VuYWJsZWQiLCJfdGltZW91dCIsIl9ob3ZlclN0YXRlIiwiX2FjdGl2ZVRyaWdnZXIiLCJfdGV0aGVyIiwiY29uZmlnIiwidGlwIiwiX3NldExpc3RlbmVycyIsImVuYWJsZSIsImRpc2FibGUiLCJ0b2dnbGVFbmFibGVkIiwiREFUQV9LRVkiLCJfZ2V0RGVsZWdhdGVDb25maWciLCJfaXNXaXRoQWN0aXZlVHJpZ2dlciIsIl9lbnRlciIsIl9sZWF2ZSIsImdldFRpcEVsZW1lbnQiLCJjbGVhclRpbWVvdXQiLCJjbGVhbnVwVGV0aGVyIiwiRVZFTlRfS0VZIiwiaXNXaXRoQ29udGVudCIsIm93bmVyRG9jdW1lbnQiLCJOQU1FIiwic2V0Q29udGVudCIsIl9nZXRBdHRhY2htZW50IiwiYXR0YWNobWVudCIsImNsYXNzZXMiLCJjbGFzc1ByZWZpeCIsImFkZFRhcmdldENsYXNzZXMiLCJwb3NpdGlvbiIsIl9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiZ2V0VGl0bGUiLCJzZXRFbGVtZW50Q29udGVudCIsImVtcHR5IiwiYXBwZW5kIiwidGV4dCIsImRlc3Ryb3kiLCJfZml4VGl0bGUiLCJEZWZhdWx0VHlwZSIsImNvbnRlbnQiLCJUSVRMRSIsIkNPTlRFTlQiLCJfZ2V0Q29udGVudCIsInNldEZvY3VzVmFsdWUiLCJ2YWwiLCJjb2xsYXBzZUFsbCIsImFjY29yZGlvbiIsImFjdGlvbiIsImNvbGxhcHNlIiwicHJvcCIsImVkaXRJbmxpbmVFZGl0YWJsZSIsImNvbnNvbGUiLCJsb2ciLCJzY3JvbGwiLCJhZGRNYXJrZXIiLCJsYXQiLCJsb25nIiwiY29udGVudFN0cmluZyIsImxhYmVsIiwidW5kZWZpbmVkIiwibWFya2VyIiwiTWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIkxhdExuZyIsImljb24iLCJtYXBfaWNvbl9sYWJlbCIsImluZm93aW5kb3ciLCJJbmZvV2luZG93IiwibWF4V2lkdGgiLCJhZGRMaXN0ZW5lciIsIm9wZW4iLCJzbGlkZVVwIiwic2xpZGVUb2dnbGUiLCJzbGlkZURvd24iXSwibWFwcGluZ3MiOiI7O0FBQ0EsU0FBU0E7SUFFTCxJQUFJQyxZQUFZQyxFQUFFO0lBRWxCLElBQUdELFVBQVVFLFVBQVUsR0FDdkI7UUFFSUQsRUFBRSxpQkFBaUJFO1dBQ2xCO1FBQ0RGLEVBQUUsaUJBQWlCRzs7OztBQUszQixTQUFTQyxpQkFBa0JDO0lBQ3ZCLElBQUlDLGtCQUFrQk4sRUFBRTtJQUN4QixJQUFJSyxRQUFRRSxTQUFTO1FBRWpCRCxnQkFBZ0JFLFlBQVk7UUFHNUJSLEVBQUVLLFNBQVNJLFNBQVNBLFNBQVNDLEtBQUssMEJBQTBCUDtXQUN6RDtRQUVISCxFQUFFSyxTQUFTSSxTQUFTQSxTQUFTQyxLQUFLLDBCQUEwQlI7UUFHNUQsSUFBSVMsSUFBSTtRQUNSWCxFQUFFLGtDQUFrQ1ksS0FBSztZQUNyQ0Q7O1FBRUosSUFBSUEsSUFBSSxHQUFHO1lBQ1BMLGdCQUFnQk8sU0FBUzs7Ozs7QUFXckMsU0FBU0MsbUJBQW1CQyxRQUFRQztJQUNoQyxJQUFHaEIsRUFBRWUsUUFBUUwsS0FBSyxhQUFhTyxTQUFTLG1CQUN4QztRQUNJakIsRUFBRWdCLFVBQVVFLE1BQU07Ozs7OztBQy9DMUIsU0FBU0MsUUFBUUM7SUFDZixJQUFJQSxNQUFNQyxTQUFTRCxNQUFNQyxNQUFNLElBQUk7UUFDL0IsSUFBSUMsU0FBUyxJQUFJQztRQUVqQkQsT0FBT0UsU0FBUyxTQUFVQztZQUN0QnpCLEVBQUUsa0NBQWtDMEIs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Uyw0QkFBMkI7UUFDaERqQixFQUFFK0IsTUFBTW9LLE9BQU96TCxLQUFLLGtCQUFrQkYsWUFBWSxpQkFBaUJLLFNBQVM7UUFDNUViLEVBQUUrQixNQUFNb0ssT0FBT3pMLEtBQUssYUFBYVA7UUFDakNILEVBQUUrQixNQUFNb0ssT0FBT3pMLEtBQUssYUFBYVI7O0dBRXRDeUksR0FBRyxzQkFBc0IsU0FBU2xIO0lBQ2pDLEtBQUl6QixFQUFFeUIsRUFBRUUsUUFBUVYsU0FBUyw0QkFBMkI7UUFDaERqQixFQUFFK0IsTUFBTW9LLE9BQU96TCxLQUFLLGdCQUFnQkYsWUFBWSxlQUFlSyxTQUFTO1FBQ3hFYixFQUFFK0IsTUFBTW9LLE9BQU96TCxLQUFLLGFBQWFSO1FBQ2pDRixFQUFFK0IsTUFBTW9LLE9BQU96TCxLQUFLLGFBQWFQOzs7Ozs7Q1R2QzdDLFNBQUFILEdBQUE0RSxRQUFTOUUsVUFBQUE7SUFFTDtHQUtJRSxRQUFFNEUsUUFBQUUiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFdoZW4gYSByZW1vdmUgZmllbGQgaXMgY2xpY2tlZFxyXG5mdW5jdGlvbiBjb3VudHJ5X3JlbW92ZWQoKVxyXG57XHJcbiAgICB2YXIgY291bnRyaWVzID0gJCgnI2NvdW50cmllc19wYXJlbnQgc2VsZWN0Jyk7XHJcblxyXG4gICAgaWYoY291bnRyaWVzLmxlbmd0aCA8PSAxKVxyXG4gICAge1xyXG4gICAgICAgIC8vIGhpZGUgdGhlIHJlbW92ZSBsaW5rc1xyXG4gICAgICAgICQoJy5yZW1vdmVfZmllbGQnKS5oaWRlKCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkKCcucmVtb3ZlX2ZpZWxkJykuc2hvdygpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBHZW5lcmljIHByZXBhcmVkbmVzcyBhY3Rpb24gaXRlbVxyXG5mdW5jdGlvbiBncGFBY3Rpb25DaGFuZ2VkKCBlbGVtZW50ICkge1xyXG4gICAgdmFyIGFkZEFjdGlvbkJ1dHRvbiA9ICQoXCIjYWRkLWFjdGlvbi1idG5cIik7XHJcbiAgICBpZiAoZWxlbWVudC5jaGVja2VkKSB7XHJcbiAgICAgICAgLy8gRW5hYmxlIHRoZSBhZGQgYWN0aW9uIGJ1dHRvblxyXG4gICAgICAgIGFkZEFjdGlvbkJ1dHRvbi5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFNob3cgZGVwYXJ0bWVudCBkcm9wZG93blxyXG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkuZmluZChcIi5ncGFfYWN0aW9uX2RlcGFydG1lbnRcIikuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBIaWRlIGRlcGFydG1lbnQgZHJvcGRvd25cclxuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuZ3BhX2FjdGlvbl9kZXBhcnRtZW50XCIpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgLy8gRGlzYWJsZSB0aGUgYWRkIGFjdGlvbiBidXR0b24gaWYgdGhlcmUgYXJlIG5vIGNoZWNrZWQgYWN0aW9uc1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAkKFwiaW5wdXRbbmFtZT1ncGFfYWN0aW9uXTpjaGVja2VkXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoaSA8IDEpIHtcclxuICAgICAgICAgICAgYWRkQWN0aW9uQnV0dG9uLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxuKiBWZXJpZnkgaWYgdGhlIEFkZCBkZXBhcnRtZW50IG9wdGlvbiBpcyBzZWxlY3RlZCBhbmQgb3BlbiB0aGUgbW9kYWwgd2luZG93XHJcbipcclxuKiBAcGFyYW0gT2JqZWN0IHNlbGVjdCAgICAgIFRoZSBzZWxlY3QgT2JqZWN0XHJcbiogQHBhcmFtIHN0cmluZyBtb2RhbF9pZCAgICBUaGUgbW9kYWwgaWQgdG8gb3BlblxyXG4qL1xyXG5mdW5jdGlvbiBhZGREZXBhcnRtZW50TW9kYWwoc2VsZWN0LCBtb2RhbF9pZCl7XHJcbiAgICBpZigkKHNlbGVjdCkuZmluZChcIjpzZWxlY3RlZFwiKS5oYXNDbGFzcygnYWRkLWRlcGFydG1lbnQnKSlcclxuICAgIHtcclxuICAgICAgICAkKG1vZGFsX2lkKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgfVxyXG59IiwiZnVuY3Rpb24gcmVhZFVSTChpbnB1dCkge1xyXG4gIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xyXG4gICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgXHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJCgnLkFnZW5jeS1kZXRhaWxzX19sb2dvX19wcmV2aWV3JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZS50YXJnZXQucmVzdWx0ICsgJyknKTtcclxuICAgICAgICAgICQoJy5BZ2VuY3ktZGV0YWlsc19fbG9nb19fcHJldmlldycpLmFkZENsYXNzKCdTZWxlY3RlZCcpXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGlucHV0LmZpbGVzWzBdKTtcclxuICB9XHJcbn1cclxuXHJcbiQoXCIjaW1nSW5wXCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG4gIHJlYWRVUkwodGhpcyk7XHJcbiAgJChcIiNzZWxlY3QtbG9nb1wiKS5oaWRlKCk7XHJcbiAgJChcIiNyZXBsYWNlLWxvZ29cIikuc2hvdygpO1xyXG4gICQoXCIjcmVtb3ZlLWxvZ29cIikuc2hvdygpO1xyXG59KTtcclxuXHJcbiQoXCIjc2VsZWN0LWxvZ28sI3JlcGxhY2UtbG9nb1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAkKFwiI2ltZ0lucFwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG59KTtcclxuXHJcbiQoXCIjcmVtb3ZlLWxvZ29cIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcbiAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQoXCIjcmVwbGFjZS1sb2dvXCIpLmhpZGUoKTtcclxuICAgICQoXCIjcmVtb3ZlLWxvZ29cIikuaGlkZSgpO1xyXG4gICAgJChcIiNzZWxlY3QtbG9nb1wiKS5zaG93KCk7XHJcbiAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xyXG4gICAgJCgnLkFnZW5jeS1kZXRhaWxzX19sb2dvX19wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ1NlbGVjdGVkJylcclxufSk7IiwiLyohXHJcbiAqIEJvb3RzdHJhcCB2NC4wLjAtYWxwaGEuNiAoaHR0cHM6Ly9nZXRib290c3RyYXAuY29tKVxyXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE3IFRoZSBCb290c3RyYXAgQXV0aG9ycyAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2dyYXBocy9jb250cmlidXRvcnMpXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXHJcbiAqL1xyXG5pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgalF1ZXJ5KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5LiBqUXVlcnkgbXVzdCBiZSBpbmNsdWRlZCBiZWZvcmUgQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdC5cIik7K2Z1bmN0aW9uKHQpe3ZhciBlPXQuZm4uanF1ZXJ5LnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi5cIik7aWYoZVswXTwyJiZlWzFdPDl8fDE9PWVbMF0mJjk9PWVbMV0mJmVbMl08MXx8ZVswXT49NCl0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGF0IGxlYXN0IGpRdWVyeSB2MS45LjEgYnV0IGxlc3MgdGhhbiB2NC4wLjBcIil9KGpRdWVyeSksK2Z1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2lmKCF0KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4hZXx8XCJvYmplY3RcIiE9dHlwZW9mIGUmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGU/dDplfWZ1bmN0aW9uIGUodCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZudWxsIT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIit0eXBlb2YgZSk7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmKE9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3Quc2V0UHJvdG90eXBlT2YodCxlKTp0Ll9fcHJvdG9fXz1lKX1mdW5jdGlvbiBuKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSxvPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCkscj1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQpe3JldHVybnt9LnRvU3RyaW5nLmNhbGwodCkubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBuKHQpe3JldHVybih0WzBdfHx0KS5ub2RlVHlwZX1mdW5jdGlvbiBpKCl7cmV0dXJue2JpbmRUeXBlOmEuZW5kLGRlbGVnYXRlVHlwZTphLmVuZCxoYW5kbGU6ZnVuY3Rpb24oZSl7aWYodChlLnRhcmdldCkuaXModGhpcykpcmV0dXJuIGUuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpfX19ZnVuY3Rpb24gbygpe2lmKHdpbmRvdy5RVW5pdClyZXR1cm4hMTt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9vdHN0cmFwXCIpO2Zvcih2YXIgZSBpbiBoKWlmKHZvaWQgMCE9PXQuc3R5bGVbZV0pcmV0dXJue2VuZDpoW2VdfTtyZXR1cm4hMX1mdW5jdGlvbiByKGUpe3ZhciBuPXRoaXMsaT0hMTtyZXR1cm4gdCh0aGlzKS5vbmUoYy5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbigpe2k9ITB9KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aXx8Yy50cmlnZ2VyVHJhbnNpdGlvbkVuZChuKX0sZSksdGhpc31mdW5jdGlvbiBzKCl7YT1vKCksdC5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZD1yLGMuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJih0LmV2ZW50LnNwZWNpYWxbYy5UUkFOU0lUSU9OX0VORF09aSgpKX12YXIgYT0hMSxsPTFlNixoPXtXZWJraXRUcmFuc2l0aW9uOlwid2Via2l0VHJhbnNpdGlvbkVuZFwiLE1velRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCIsT1RyYW5zaXRpb246XCJvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZFwiLHRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCJ9LGM9e1RSQU5TSVRJT05fRU5EOlwiYnNUcmFuc2l0aW9uRW5kXCIsZ2V0VUlEOmZ1bmN0aW9uKHQpe2RvIHQrPX5+KE1hdGgucmFuZG9tKCkqbCk7d2hpbGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodCkpO3JldHVybiB0fSxnZXRTZWxlY3RvckZyb21FbGVtZW50OmZ1bmN0aW9uKHQpe3ZhciBlPXQuZ2V0QXR0cmlidXRlKFwiZGF0YS10YXJnZXRcIik7cmV0dXJuIGV8fChlPXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKXx8XCJcIixlPS9eI1thLXpdL2kudGVzdChlKT9lOm51bGwpLGV9LHJlZmxvdzpmdW5jdGlvbih0KXtyZXR1cm4gdC5vZmZzZXRIZWlnaHR9LHRyaWdnZXJUcmFuc2l0aW9uRW5kOmZ1bmN0aW9uKGUpe3QoZSkudHJpZ2dlcihhLmVuZCl9LHN1cHBvcnRzVHJhbnNpdGlvbkVuZDpmdW5jdGlvbigpe3JldHVybiBCb29sZWFuKGEpfSx0eXBlQ2hlY2tDb25maWc6ZnVuY3Rpb24odCxpLG8pe2Zvcih2YXIgciBpbiBvKWlmKG8uaGFzT3duUHJvcGVydHkocikpe3ZhciBzPW9bcl0sYT1pW3JdLGw9YSYmbihhKT9cImVsZW1lbnRcIjplKGEpO2lmKCFuZXcgUmVnRXhwKHMpLnRlc3QobCkpdGhyb3cgbmV3IEVycm9yKHQudG9VcHBlckNhc2UoKStcIjogXCIrKCdPcHRpb24gXCInK3IrJ1wiIHByb3ZpZGVkIHR5cGUgXCInK2wrJ1wiICcpKygnYnV0IGV4cGVjdGVkIHR5cGUgXCInK3MrJ1wiLicpKX19fTtyZXR1cm4gcygpLGN9KGpRdWVyeSkscz0oZnVuY3Rpb24odCl7dmFyIGU9XCJhbGVydFwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLmFsZXJ0XCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0xNTAsdT17RElTTUlTUzonW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJ30sZD17Q0xPU0U6XCJjbG9zZVwiK2EsQ0xPU0VEOlwiY2xvc2VkXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsfSxmPXtBTEVSVDpcImFsZXJ0XCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxfPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10fXJldHVybiBlLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbih0KXt0PXR8fHRoaXMuX2VsZW1lbnQ7dmFyIGU9dGhpcy5fZ2V0Um9vdEVsZW1lbnQodCksbj10aGlzLl90cmlnZ2VyQ2xvc2VFdmVudChlKTtuLmlzRGVmYXVsdFByZXZlbnRlZCgpfHx0aGlzLl9yZW1vdmVFbGVtZW50KGUpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQscyksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fZ2V0Um9vdEVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpLGk9ITE7cmV0dXJuIG4mJihpPXQobilbMF0pLGl8fChpPXQoZSkuY2xvc2VzdChcIi5cIitmLkFMRVJUKVswXSksaX0sZS5wcm90b3R5cGUuX3RyaWdnZXJDbG9zZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXQuRXZlbnQoZC5DTE9TRSk7cmV0dXJuIHQoZSkudHJpZ2dlcihuKSxufSxlLnByb3RvdHlwZS5fcmVtb3ZlRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj10aGlzO3JldHVybiB0KGUpLnJlbW92ZUNsYXNzKGYuU0hPVyksci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdChlKS5oYXNDbGFzcyhmLkZBREUpP3ZvaWQgdChlKS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbih0KXtyZXR1cm4gbi5fZGVzdHJveUVsZW1lbnQoZSx0KX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpOnZvaWQgdGhpcy5fZGVzdHJveUVsZW1lbnQoZSl9LGUucHJvdG90eXBlLl9kZXN0cm95RWxlbWVudD1mdW5jdGlvbihlKXt0KGUpLmRldGFjaCgpLnRyaWdnZXIoZC5DTE9TRUQpLnJlbW92ZSgpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcyksbz1pLmRhdGEocyk7b3x8KG89bmV3IGUodGhpcyksaS5kYXRhKHMsbykpLFwiY2xvc2VcIj09PW4mJm9bbl0odGhpcyl9KX0sZS5faGFuZGxlRGlzbWlzcz1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7ZSYmZS5wcmV2ZW50RGVmYXVsdCgpLHQuY2xvc2UodGhpcyl9fSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24oZC5DTElDS19EQVRBX0FQSSx1LkRJU01JU1MsXy5faGFuZGxlRGlzbWlzcyhuZXcgXykpLHQuZm5bZV09Xy5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9Xyx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLF8uX2pRdWVyeUludGVyZmFjZX0sX30oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImJ1dHRvblwiLGk9XCI0LjAuMC1hbHBoYS42XCIscj1cImJzLmJ1dHRvblwiLHM9XCIuXCIrcixhPVwiLmRhdGEtYXBpXCIsbD10LmZuW2VdLGg9e0FDVElWRTpcImFjdGl2ZVwiLEJVVFRPTjpcImJ0blwiLEZPQ1VTOlwiZm9jdXNcIn0sYz17REFUQV9UT0dHTEVfQ0FSUk9UOidbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJyxEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScsSU5QVVQ6XCJpbnB1dFwiLEFDVElWRTpcIi5hY3RpdmVcIixCVVRUT046XCIuYnRuXCJ9LHU9e0NMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitzK2EsRk9DVVNfQkxVUl9EQVRBX0FQSTpcImZvY3VzXCIrcythK1wiIFwiKyhcImJsdXJcIitzK2EpfSxkPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10fXJldHVybiBlLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt2YXIgZT0hMCxuPXQodGhpcy5fZWxlbWVudCkuY2xvc2VzdChjLkRBVEFfVE9HR0xFKVswXTtpZihuKXt2YXIgaT10KHRoaXMuX2VsZW1lbnQpLmZpbmQoYy5JTlBVVClbMF07aWYoaSl7aWYoXCJyYWRpb1wiPT09aS50eXBlKWlmKGkuY2hlY2tlZCYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSkpZT0hMTtlbHNle3ZhciBvPXQobikuZmluZChjLkFDVElWRSlbMF07byYmdChvKS5yZW1vdmVDbGFzcyhoLkFDVElWRSl9ZSYmKGkuY2hlY2tlZD0hdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSksdChpKS50cmlnZ2VyKFwiY2hhbmdlXCIpKSxpLmZvY3VzKCl9fXRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1wcmVzc2VkXCIsIXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoaC5BQ1RJVkUpKSxlJiZ0KHRoaXMuX2VsZW1lbnQpLnRvZ2dsZUNsYXNzKGguQUNUSVZFKX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LHIpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLmRhdGEocik7aXx8KGk9bmV3IGUodGhpcyksdCh0aGlzKS5kYXRhKHIsaSkpLFwidG9nZ2xlXCI9PT1uJiZpW25dKCl9KX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKHUuQ0xJQ0tfREFUQV9BUEksYy5EQVRBX1RPR0dMRV9DQVJST1QsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBuPWUudGFyZ2V0O3QobikuaGFzQ2xhc3MoaC5CVVRUT04pfHwobj10KG4pLmNsb3Nlc3QoYy5CVVRUT04pKSxkLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KG4pLFwidG9nZ2xlXCIpfSkub24odS5GT0NVU19CTFVSX0RBVEFfQVBJLGMuREFUQV9UT0dHTEVfQ0FSUk9ULGZ1bmN0aW9uKGUpe3ZhciBuPXQoZS50YXJnZXQpLmNsb3Nlc3QoYy5CVVRUT04pWzBdO3QobikudG9nZ2xlQ2xhc3MoaC5GT0NVUywvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpfSksdC5mbltlXT1kLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1kLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWwsZC5falF1ZXJ5SW50ZXJmYWNlfSxkfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiY2Fyb3VzZWxcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5jYXJvdXNlbFwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9NjAwLGQ9MzcsZj0zOSxfPXtpbnRlcnZhbDo1ZTMsa2V5Ym9hcmQ6ITAsc2xpZGU6ITEscGF1c2U6XCJob3ZlclwiLHdyYXA6ITB9LGc9e2ludGVydmFsOlwiKG51bWJlcnxib29sZWFuKVwiLGtleWJvYXJkOlwiYm9vbGVhblwiLHNsaWRlOlwiKGJvb2xlYW58c3RyaW5nKVwiLHBhdXNlOlwiKHN0cmluZ3xib29sZWFuKVwiLHdyYXA6XCJib29sZWFuXCJ9LHA9e05FWFQ6XCJuZXh0XCIsUFJFVjpcInByZXZcIixMRUZUOlwibGVmdFwiLFJJR0hUOlwicmlnaHRcIn0sbT17U0xJREU6XCJzbGlkZVwiK2wsU0xJRDpcInNsaWRcIitsLEtFWURPV046XCJrZXlkb3duXCIrbCxNT1VTRUVOVEVSOlwibW91c2VlbnRlclwiK2wsTU9VU0VMRUFWRTpcIm1vdXNlbGVhdmVcIitsLExPQURfREFUQV9BUEk6XCJsb2FkXCIrbCtoLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LEU9e0NBUk9VU0VMOlwiY2Fyb3VzZWxcIixBQ1RJVkU6XCJhY3RpdmVcIixTTElERTpcInNsaWRlXCIsUklHSFQ6XCJjYXJvdXNlbC1pdGVtLXJpZ2h0XCIsTEVGVDpcImNhcm91c2VsLWl0ZW0tbGVmdFwiLE5FWFQ6XCJjYXJvdXNlbC1pdGVtLW5leHRcIixQUkVWOlwiY2Fyb3VzZWwtaXRlbS1wcmV2XCIsSVRFTTpcImNhcm91c2VsLWl0ZW1cIn0sdj17QUNUSVZFOlwiLmFjdGl2ZVwiLEFDVElWRV9JVEVNOlwiLmFjdGl2ZS5jYXJvdXNlbC1pdGVtXCIsSVRFTTpcIi5jYXJvdXNlbC1pdGVtXCIsTkVYVF9QUkVWOlwiLmNhcm91c2VsLWl0ZW0tbmV4dCwgLmNhcm91c2VsLWl0ZW0tcHJldlwiLElORElDQVRPUlM6XCIuY2Fyb3VzZWwtaW5kaWNhdG9yc1wiLERBVEFfU0xJREU6XCJbZGF0YS1zbGlkZV0sIFtkYXRhLXNsaWRlLXRvXVwiLERBVEFfUklERTonW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJ30sVD1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXtuKHRoaXMsaCksdGhpcy5faXRlbXM9bnVsbCx0aGlzLl9pbnRlcnZhbD1udWxsLHRoaXMuX2FjdGl2ZUVsZW1lbnQ9bnVsbCx0aGlzLl9pc1BhdXNlZD0hMSx0aGlzLl9pc1NsaWRpbmc9ITEsdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9lbGVtZW50PXQoZSlbMF0sdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQ9dCh0aGlzLl9lbGVtZW50KS5maW5kKHYuSU5ESUNBVE9SUylbMF0sdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKX1yZXR1cm4gaC5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe2lmKHRoaXMuX2lzU2xpZGluZyl0aHJvdyBuZXcgRXJyb3IoXCJDYXJvdXNlbCBpcyBzbGlkaW5nXCIpO3RoaXMuX3NsaWRlKHAuTkVYVCl9LGgucHJvdG90eXBlLm5leHRXaGVuVmlzaWJsZT1mdW5jdGlvbigpe2RvY3VtZW50LmhpZGRlbnx8dGhpcy5uZXh0KCl9LGgucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXtpZih0aGlzLl9pc1NsaWRpbmcpdGhyb3cgbmV3IEVycm9yKFwiQ2Fyb3VzZWwgaXMgc2xpZGluZ1wiKTt0aGlzLl9zbGlkZShwLlBSRVZJT1VTKX0saC5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oZSl7ZXx8KHRoaXMuX2lzUGF1c2VkPSEwKSx0KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5ORVhUX1BSRVYpWzBdJiZyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiYoci50cmlnZ2VyVHJhbnNpdGlvbkVuZCh0aGlzLl9lbGVtZW50KSx0aGlzLmN5Y2xlKCEwKSksY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCksdGhpcy5faW50ZXJ2YWw9bnVsbH0saC5wcm90b3R5cGUuY3ljbGU9ZnVuY3Rpb24odCl7dHx8KHRoaXMuX2lzUGF1c2VkPSExKSx0aGlzLl9pbnRlcnZhbCYmKGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpLHRoaXMuX2ludGVydmFsPW51bGwpLHRoaXMuX2NvbmZpZy5pbnRlcnZhbCYmIXRoaXMuX2lzUGF1c2VkJiYodGhpcy5faW50ZXJ2YWw9c2V0SW50ZXJ2YWwoKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZT90aGlzLm5leHRXaGVuVmlzaWJsZTp0aGlzLm5leHQpLmJpbmQodGhpcyksdGhpcy5fY29uZmlnLmludGVydmFsKSl9LGgucHJvdG90eXBlLnRvPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7dGhpcy5fYWN0aXZlRWxlbWVudD10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5BQ1RJVkVfSVRFTSlbMF07dmFyIGk9dGhpcy5fZ2V0SXRlbUluZGV4KHRoaXMuX2FjdGl2ZUVsZW1lbnQpO2lmKCEoZT50aGlzLl9pdGVtcy5sZW5ndGgtMXx8ZTwwKSl7aWYodGhpcy5faXNTbGlkaW5nKXJldHVybiB2b2lkIHQodGhpcy5fZWxlbWVudCkub25lKG0uU0xJRCxmdW5jdGlvbigpe3JldHVybiBuLnRvKGUpfSk7aWYoaT09PWUpcmV0dXJuIHRoaXMucGF1c2UoKSx2b2lkIHRoaXMuY3ljbGUoKTt2YXIgbz1lPmk/cC5ORVhUOnAuUFJFVklPVVM7dGhpcy5fc2xpZGUobyx0aGlzLl9pdGVtc1tlXSl9fSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dCh0aGlzLl9lbGVtZW50KS5vZmYobCksdC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdGhpcy5faXRlbXM9bnVsbCx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5faW50ZXJ2YWw9bnVsbCx0aGlzLl9pc1BhdXNlZD1udWxsLHRoaXMuX2lzU2xpZGluZz1udWxsLHRoaXMuX2FjdGl2ZUVsZW1lbnQ9bnVsbCx0aGlzLl9pbmRpY2F0b3JzRWxlbWVudD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LF8sbiksci50eXBlQ2hlY2tDb25maWcoZSxuLGcpLG59LGgucHJvdG90eXBlLl9hZGRFdmVudExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5fY29uZmlnLmtleWJvYXJkJiZ0KHRoaXMuX2VsZW1lbnQpLm9uKG0uS0VZRE9XTixmdW5jdGlvbih0KXtyZXR1cm4gZS5fa2V5ZG93bih0KX0pLFwiaG92ZXJcIiE9PXRoaXMuX2NvbmZpZy5wYXVzZXx8XCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudHx8dCh0aGlzLl9lbGVtZW50KS5vbihtLk1PVVNFRU5URVIsZnVuY3Rpb24odCl7cmV0dXJuIGUucGF1c2UodCl9KS5vbihtLk1PVVNFTEVBVkUsZnVuY3Rpb24odCl7cmV0dXJuIGUuY3ljbGUodCl9KX0saC5wcm90b3R5cGUuX2tleWRvd249ZnVuY3Rpb24odCl7aWYoIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QodC50YXJnZXQudGFnTmFtZSkpc3dpdGNoKHQud2hpY2gpe2Nhc2UgZDp0LnByZXZlbnREZWZhdWx0KCksdGhpcy5wcmV2KCk7YnJlYWs7Y2FzZSBmOnQucHJldmVudERlZmF1bHQoKSx0aGlzLm5leHQoKTticmVhaztkZWZhdWx0OnJldHVybn19LGgucHJvdG90eXBlLl9nZXRJdGVtSW5kZXg9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX2l0ZW1zPXQubWFrZUFycmF5KHQoZSkucGFyZW50KCkuZmluZCh2LklURU0pKSx0aGlzLl9pdGVtcy5pbmRleE9mKGUpfSxoLnByb3RvdHlwZS5fZ2V0SXRlbUJ5RGlyZWN0aW9uPWZ1bmN0aW9uKHQsZSl7dmFyIG49dD09PXAuTkVYVCxpPXQ9PT1wLlBSRVZJT1VTLG89dGhpcy5fZ2V0SXRlbUluZGV4KGUpLHI9dGhpcy5faXRlbXMubGVuZ3RoLTEscz1pJiYwPT09b3x8biYmbz09PXI7aWYocyYmIXRoaXMuX2NvbmZpZy53cmFwKXJldHVybiBlO3ZhciBhPXQ9PT1wLlBSRVZJT1VTPy0xOjEsbD0obythKSV0aGlzLl9pdGVtcy5sZW5ndGg7cmV0dXJuIGw9PT0tMT90aGlzLl9pdGVtc1t0aGlzLl9pdGVtcy5sZW5ndGgtMV06dGhpcy5faXRlbXNbbF19LGgucHJvdG90eXBlLl90cmlnZ2VyU2xpZGVFdmVudD1mdW5jdGlvbihlLG4pe3ZhciBpPXQuRXZlbnQobS5TTElERSx7cmVsYXRlZFRhcmdldDplLGRpcmVjdGlvbjpufSk7cmV0dXJuIHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihpKSxpfSxoLnByb3RvdHlwZS5fc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudD1mdW5jdGlvbihlKXtpZih0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCl7dCh0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCkuZmluZCh2LkFDVElWRSkucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUpO3ZhciBuPXRoaXMuX2luZGljYXRvcnNFbGVtZW50LmNoaWxkcmVuW3RoaXMuX2dldEl0ZW1JbmRleChlKV07biYmdChuKS5hZGRDbGFzcyhFLkFDVElWRSl9fSxoLnByb3RvdHlwZS5fc2xpZGU9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLG89dCh0aGlzLl9lbGVtZW50KS5maW5kKHYuQUNUSVZFX0lURU0pWzBdLHM9bnx8byYmdGhpcy5fZ2V0SXRlbUJ5RGlyZWN0aW9uKGUsbyksYT1Cb29sZWFuKHRoaXMuX2ludGVydmFsKSxsPXZvaWQgMCxoPXZvaWQgMCxjPXZvaWQgMDtpZihlPT09cC5ORVhUPyhsPUUuTEVGVCxoPUUuTkVYVCxjPXAuTEVGVCk6KGw9RS5SSUdIVCxoPUUuUFJFVixjPXAuUklHSFQpLHMmJnQocykuaGFzQ2xhc3MoRS5BQ1RJVkUpKXJldHVybiB2b2lkKHRoaXMuX2lzU2xpZGluZz0hMSk7dmFyIGQ9dGhpcy5fdHJpZ2dlclNsaWRlRXZlbnQocyxjKTtpZighZC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmbyYmcyl7dGhpcy5faXNTbGlkaW5nPSEwLGEmJnRoaXMucGF1c2UoKSx0aGlzLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50KHMpO3ZhciBmPXQuRXZlbnQobS5TTElELHtyZWxhdGVkVGFyZ2V0OnMsZGlyZWN0aW9uOmN9KTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKEUuU0xJREUpPyh0KHMpLmFkZENsYXNzKGgpLHIucmVmbG93KHMpLHQobykuYWRkQ2xhc3MobCksdChzKS5hZGRDbGFzcyhsKSx0KG8pLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKCl7dChzKS5yZW1vdmVDbGFzcyhsK1wiIFwiK2gpLmFkZENsYXNzKEUuQUNUSVZFKSx0KG8pLnJlbW92ZUNsYXNzKEUuQUNUSVZFK1wiIFwiK2grXCIgXCIrbCksaS5faXNTbGlkaW5nPSExLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtyZXR1cm4gdChpLl9lbGVtZW50KS50cmlnZ2VyKGYpfSwwKX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpKToodChvKS5yZW1vdmVDbGFzcyhFLkFDVElWRSksdChzKS5hZGRDbGFzcyhFLkFDVElWRSksdGhpcy5faXNTbGlkaW5nPSExLHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihmKSksYSYmdGhpcy5jeWNsZSgpfX0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLmRhdGEoYSksbz10LmV4dGVuZCh7fSxfLHQodGhpcykuZGF0YSgpKTtcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJnQuZXh0ZW5kKG8sZSk7dmFyIHI9XCJzdHJpbmdcIj09dHlwZW9mIGU/ZTpvLnNsaWRlO2lmKG58fChuPW5ldyBoKHRoaXMsbyksdCh0aGlzKS5kYXRhKGEsbikpLFwibnVtYmVyXCI9PXR5cGVvZiBlKW4udG8oZSk7ZWxzZSBpZihcInN0cmluZ1wiPT10eXBlb2Ygcil7aWYodm9pZCAwPT09bltyXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrcisnXCInKTtuW3JdKCl9ZWxzZSBvLmludGVydmFsJiYobi5wYXVzZSgpLG4uY3ljbGUoKSl9KX0saC5fZGF0YUFwaUNsaWNrSGFuZGxlcj1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7aWYobil7dmFyIGk9dChuKVswXTtpZihpJiZ0KGkpLmhhc0NsYXNzKEUuQ0FST1VTRUwpKXt2YXIgbz10LmV4dGVuZCh7fSx0KGkpLmRhdGEoKSx0KHRoaXMpLmRhdGEoKSkscz10aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9cIik7cyYmKG8uaW50ZXJ2YWw9ITEpLGguX2pRdWVyeUludGVyZmFjZS5jYWxsKHQoaSksbykscyYmdChpKS5kYXRhKGEpLnRvKHMpLGUucHJldmVudERlZmF1bHQoKX19fSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIF99fV0pLGh9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKG0uQ0xJQ0tfREFUQV9BUEksdi5EQVRBX1NMSURFLFQuX2RhdGFBcGlDbGlja0hhbmRsZXIpLHQod2luZG93KS5vbihtLkxPQURfREFUQV9BUEksZnVuY3Rpb24oKXt0KHYuREFUQV9SSURFKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzKTtULl9qUXVlcnlJbnRlcmZhY2UuY2FsbChlLGUuZGF0YSgpKX0pfSksdC5mbltlXT1ULl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1ULHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsVC5falF1ZXJ5SW50ZXJmYWNlfSxUfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiY29sbGFwc2VcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5jb2xsYXBzZVwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9NjAwLGQ9e3RvZ2dsZTohMCxwYXJlbnQ6XCJcIn0sZj17dG9nZ2xlOlwiYm9vbGVhblwiLHBhcmVudDpcInN0cmluZ1wifSxfPXtTSE9XOlwic2hvd1wiK2wsU0hPV046XCJzaG93blwiK2wsSElERTpcImhpZGVcIitsLEhJRERFTjpcImhpZGRlblwiK2wsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sZz17U0hPVzpcInNob3dcIixDT0xMQVBTRTpcImNvbGxhcHNlXCIsQ09MTEFQU0lORzpcImNvbGxhcHNpbmdcIixDT0xMQVBTRUQ6XCJjb2xsYXBzZWRcIn0scD17V0lEVEg6XCJ3aWR0aFwiLEhFSUdIVDpcImhlaWdodFwifSxtPXtBQ1RJVkVTOlwiLmNhcmQgPiAuc2hvdywgLmNhcmQgPiAuY29sbGFwc2luZ1wiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXSd9LEU9ZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGUsaSl7bih0aGlzLGwpLHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl90cmlnZ2VyQXJyYXk9dC5tYWtlQXJyYXkodCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMnK2UuaWQrJ1wiXSwnKygnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS10YXJnZXQ9XCIjJytlLmlkKydcIl0nKSkpLHRoaXMuX3BhcmVudD10aGlzLl9jb25maWcucGFyZW50P3RoaXMuX2dldFBhcmVudCgpOm51bGwsdGhpcy5fY29uZmlnLnBhcmVudHx8dGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuX2VsZW1lbnQsdGhpcy5fdHJpZ2dlckFycmF5KSx0aGlzLl9jb25maWcudG9nZ2xlJiZ0aGlzLnRvZ2dsZSgpfXJldHVybiBsLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGcuU0hPVyk/dGhpcy5oaWRlKCk6dGhpcy5zaG93KCl9LGwucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJDb2xsYXBzZSBpcyB0cmFuc2l0aW9uaW5nXCIpO2lmKCF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGcuU0hPVykpe3ZhciBuPXZvaWQgMCxpPXZvaWQgMDtpZih0aGlzLl9wYXJlbnQmJihuPXQubWFrZUFycmF5KHQodGhpcy5fcGFyZW50KS5maW5kKG0uQUNUSVZFUykpLG4ubGVuZ3RofHwobj1udWxsKSksIShuJiYoaT10KG4pLmRhdGEoYSksaSYmaS5faXNUcmFuc2l0aW9uaW5nKSkpe3ZhciBvPXQuRXZlbnQoXy5TSE9XKTtpZih0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobyksIW8uaXNEZWZhdWx0UHJldmVudGVkKCkpe24mJihsLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KG4pLFwiaGlkZVwiKSxpfHx0KG4pLmRhdGEoYSxudWxsKSk7dmFyIHM9dGhpcy5fZ2V0RGltZW5zaW9uKCk7dCh0aGlzLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFKS5hZGRDbGFzcyhnLkNPTExBUFNJTkcpLHRoaXMuX2VsZW1lbnQuc3R5bGVbc109MCx0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksdGhpcy5fdHJpZ2dlckFycmF5Lmxlbmd0aCYmdCh0aGlzLl90cmlnZ2VyQXJyYXkpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0VEKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLnNldFRyYW5zaXRpb25pbmcoITApO3ZhciBoPWZ1bmN0aW9uKCl7dChlLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNJTkcpLmFkZENsYXNzKGcuQ09MTEFQU0UpLmFkZENsYXNzKGcuU0hPVyksZS5fZWxlbWVudC5zdHlsZVtzXT1cIlwiLGUuc2V0VHJhbnNpdGlvbmluZyghMSksdChlLl9lbGVtZW50KS50cmlnZ2VyKF8uU0hPV04pfTtpZighci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSlyZXR1cm4gdm9pZCBoKCk7dmFyIGM9c1swXS50b1VwcGVyQ2FzZSgpK3Muc2xpY2UoMSksZD1cInNjcm9sbFwiK2M7dCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxoKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KSx0aGlzLl9lbGVtZW50LnN0eWxlW3NdPXRoaXMuX2VsZW1lbnRbZF0rXCJweFwifX19fSxsLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiQ29sbGFwc2UgaXMgdHJhbnNpdGlvbmluZ1wiKTtpZih0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGcuU0hPVykpe3ZhciBuPXQuRXZlbnQoXy5ISURFKTtpZih0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobiksIW4uaXNEZWZhdWx0UHJldmVudGVkKCkpe3ZhciBpPXRoaXMuX2dldERpbWVuc2lvbigpLG89aT09PXAuV0lEVEg/XCJvZmZzZXRXaWR0aFwiOlwib2Zmc2V0SGVpZ2h0XCI7dGhpcy5fZWxlbWVudC5zdHlsZVtpXT10aGlzLl9lbGVtZW50W29dK1wicHhcIixyLnJlZmxvdyh0aGlzLl9lbGVtZW50KSx0KHRoaXMuX2VsZW1lbnQpLmFkZENsYXNzKGcuQ09MTEFQU0lORykucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRSkucmVtb3ZlQ2xhc3MoZy5TSE9XKSx0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMSksdGhpcy5fdHJpZ2dlckFycmF5Lmxlbmd0aCYmdCh0aGlzLl90cmlnZ2VyQXJyYXkpLmFkZENsYXNzKGcuQ09MTEFQU0VEKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLnNldFRyYW5zaXRpb25pbmcoITApO3ZhciBzPWZ1bmN0aW9uKCl7ZS5zZXRUcmFuc2l0aW9uaW5nKCExKSx0KGUuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0lORykuYWRkQ2xhc3MoZy5DT0xMQVBTRSkudHJpZ2dlcihfLkhJRERFTil9O3JldHVybiB0aGlzLl9lbGVtZW50LnN0eWxlW2ldPVwiXCIsci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKT92b2lkIHQodGhpcy5fZWxlbWVudCkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6dm9pZCBzKCl9fX0sbC5wcm90b3R5cGUuc2V0VHJhbnNpdGlvbmluZz1mdW5jdGlvbih0KXt0aGlzLl9pc1RyYW5zaXRpb25pbmc9dH0sbC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX3BhcmVudD1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl90cmlnZ2VyQXJyYXk9bnVsbCx0aGlzLl9pc1RyYW5zaXRpb25pbmc9bnVsbH0sbC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxkLG4pLG4udG9nZ2xlPUJvb2xlYW4obi50b2dnbGUpLHIudHlwZUNoZWNrQ29uZmlnKGUsbixmKSxufSxsLnByb3RvdHlwZS5fZ2V0RGltZW5zaW9uPWZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhwLldJRFRIKTtyZXR1cm4gZT9wLldJRFRIOnAuSEVJR0hUfSxsLnByb3RvdHlwZS5fZ2V0UGFyZW50PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxuPXQodGhpcy5fY29uZmlnLnBhcmVudClbMF0saT0nW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInK3RoaXMuX2NvbmZpZy5wYXJlbnQrJ1wiXSc7cmV0dXJuIHQobikuZmluZChpKS5lYWNoKGZ1bmN0aW9uKHQsbil7ZS5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGwuX2dldFRhcmdldEZyb21FbGVtZW50KG4pLFtuXSl9KSxufSxsLnByb3RvdHlwZS5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzPWZ1bmN0aW9uKGUsbil7aWYoZSl7dmFyIGk9dChlKS5oYXNDbGFzcyhnLlNIT1cpO2Uuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLGkpLG4ubGVuZ3RoJiZ0KG4pLnRvZ2dsZUNsYXNzKGcuQ09MTEFQU0VELCFpKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLGkpfX0sbC5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBuP3QobilbMF06bnVsbH0sbC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLG89bi5kYXRhKGEpLHI9dC5leHRlbmQoe30sZCxuLmRhdGEoKSxcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmUpO2lmKCFvJiZyLnRvZ2dsZSYmL3Nob3d8aGlkZS8udGVzdChlKSYmKHIudG9nZ2xlPSExKSxvfHwobz1uZXcgbCh0aGlzLHIpLG4uZGF0YShhLG8pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09b1tlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtvW2VdKCl9fSl9LG8obCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZH19XSksbH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24oXy5DTElDS19EQVRBX0FQSSxtLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt2YXIgbj1FLl9nZXRUYXJnZXRGcm9tRWxlbWVudCh0aGlzKSxpPXQobikuZGF0YShhKSxvPWk/XCJ0b2dnbGVcIjp0KHRoaXMpLmRhdGEoKTtFLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KG4pLG8pfSksdC5mbltlXT1FLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1FLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsRS5falF1ZXJ5SW50ZXJmYWNlfSxFfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiZHJvcGRvd25cIixpPVwiNC4wLjAtYWxwaGEuNlwiLHM9XCJicy5kcm9wZG93blwiLGE9XCIuXCIrcyxsPVwiLmRhdGEtYXBpXCIsaD10LmZuW2VdLGM9MjcsdT0zOCxkPTQwLGY9MyxfPXtISURFOlwiaGlkZVwiK2EsSElEREVOOlwiaGlkZGVuXCIrYSxTSE9XOlwic2hvd1wiK2EsU0hPV046XCJzaG93blwiK2EsQ0xJQ0s6XCJjbGlja1wiK2EsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2ErbCxGT0NVU0lOX0RBVEFfQVBJOlwiZm9jdXNpblwiK2ErbCxLRVlET1dOX0RBVEFfQVBJOlwia2V5ZG93blwiK2ErbH0sZz17QkFDS0RST1A6XCJkcm9wZG93bi1iYWNrZHJvcFwiLERJU0FCTEVEOlwiZGlzYWJsZWRcIixTSE9XOlwic2hvd1wifSxwPXtCQUNLRFJPUDpcIi5kcm9wZG93bi1iYWNrZHJvcFwiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsRk9STV9DSElMRDpcIi5kcm9wZG93biBmb3JtXCIsUk9MRV9NRU5VOidbcm9sZT1cIm1lbnVcIl0nLFJPTEVfTElTVEJPWDonW3JvbGU9XCJsaXN0Ym94XCJdJyxOQVZCQVJfTkFWOlwiLm5hdmJhci1uYXZcIixWSVNJQkxFX0lURU1TOidbcm9sZT1cIm1lbnVcIl0gbGk6bm90KC5kaXNhYmxlZCkgYSwgW3JvbGU9XCJsaXN0Ym94XCJdIGxpOm5vdCguZGlzYWJsZWQpIGEnfSxtPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10LHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCl9cmV0dXJuIGUucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe2lmKHRoaXMuZGlzYWJsZWR8fHQodGhpcykuaGFzQ2xhc3MoZy5ESVNBQkxFRCkpcmV0dXJuITE7dmFyIG49ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQodGhpcyksaT10KG4pLmhhc0NsYXNzKGcuU0hPVyk7aWYoZS5fY2xlYXJNZW51cygpLGkpcmV0dXJuITE7aWYoXCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCYmIXQobikuY2xvc2VzdChwLk5BVkJBUl9OQVYpLmxlbmd0aCl7dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtvLmNsYXNzTmFtZT1nLkJBQ0tEUk9QLHQobykuaW5zZXJ0QmVmb3JlKHRoaXMpLHQobykub24oXCJjbGlja1wiLGUuX2NsZWFyTWVudXMpfXZhciByPXtyZWxhdGVkVGFyZ2V0OnRoaXN9LHM9dC5FdmVudChfLlNIT1cscik7cmV0dXJuIHQobikudHJpZ2dlcihzKSwhcy5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmKHRoaXMuZm9jdXMoKSx0aGlzLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksdChuKS50b2dnbGVDbGFzcyhnLlNIT1cpLHQobikudHJpZ2dlcih0LkV2ZW50KF8uU0hPV04scikpLCExKX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LHMpLHQodGhpcy5fZWxlbWVudCkub2ZmKGEpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2FkZEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dCh0aGlzLl9lbGVtZW50KS5vbihfLkNMSUNLLHRoaXMudG9nZ2xlKX0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLmRhdGEocyk7aWYoaXx8KGk9bmV3IGUodGhpcyksdCh0aGlzKS5kYXRhKHMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBuKXtpZih2b2lkIDA9PT1pW25dKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytuKydcIicpO2lbbl0uY2FsbCh0aGlzKX19KX0sZS5fY2xlYXJNZW51cz1mdW5jdGlvbihuKXtpZighbnx8bi53aGljaCE9PWYpe3ZhciBpPXQocC5CQUNLRFJPUClbMF07aSYmaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGkpO2Zvcih2YXIgbz10Lm1ha2VBcnJheSh0KHAuREFUQV9UT0dHTEUpKSxyPTA7cjxvLmxlbmd0aDtyKyspe3ZhciBzPWUuX2dldFBhcmVudEZyb21FbGVtZW50KG9bcl0pLGE9e3JlbGF0ZWRUYXJnZXQ6b1tyXX07aWYodChzKS5oYXNDbGFzcyhnLlNIT1cpJiYhKG4mJihcImNsaWNrXCI9PT1uLnR5cGUmJi9pbnB1dHx0ZXh0YXJlYS9pLnRlc3Qobi50YXJnZXQudGFnTmFtZSl8fFwiZm9jdXNpblwiPT09bi50eXBlKSYmdC5jb250YWlucyhzLG4udGFyZ2V0KSkpe3ZhciBsPXQuRXZlbnQoXy5ISURFLGEpO3QocykudHJpZ2dlcihsKSxsLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwob1tyXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsXCJmYWxzZVwiKSx0KHMpLnJlbW92ZUNsYXNzKGcuU0hPVykudHJpZ2dlcih0LkV2ZW50KF8uSElEREVOLGEpKSl9fX19LGUuX2dldFBhcmVudEZyb21FbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXZvaWQgMCxpPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKTtyZXR1cm4gaSYmKG49dChpKVswXSksbnx8ZS5wYXJlbnROb2RlfSxlLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXI9ZnVuY3Rpb24obil7aWYoLygzOHw0MHwyN3wzMikvLnRlc3Qobi53aGljaCkmJiEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KG4udGFyZ2V0LnRhZ05hbWUpJiYobi5wcmV2ZW50RGVmYXVsdCgpLG4uc3RvcFByb3BhZ2F0aW9uKCksIXRoaXMuZGlzYWJsZWQmJiF0KHRoaXMpLmhhc0NsYXNzKGcuRElTQUJMRUQpKSl7dmFyIGk9ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQodGhpcyksbz10KGkpLmhhc0NsYXNzKGcuU0hPVyk7aWYoIW8mJm4ud2hpY2ghPT1jfHxvJiZuLndoaWNoPT09Yyl7aWYobi53aGljaD09PWMpe3ZhciByPXQoaSkuZmluZChwLkRBVEFfVE9HR0xFKVswXTt0KHIpLnRyaWdnZXIoXCJmb2N1c1wiKX1yZXR1cm4gdm9pZCB0KHRoaXMpLnRyaWdnZXIoXCJjbGlja1wiKX12YXIgcz10KGkpLmZpbmQocC5WSVNJQkxFX0lURU1TKS5nZXQoKTtpZihzLmxlbmd0aCl7dmFyIGE9cy5pbmRleE9mKG4udGFyZ2V0KTtuLndoaWNoPT09dSYmYT4wJiZhLS0sbi53aGljaD09PWQmJmE8cy5sZW5ndGgtMSYmYSsrLGE8MCYmKGE9MCksc1thXS5mb2N1cygpfX19LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihfLktFWURPV05fREFUQV9BUEkscC5EQVRBX1RPR0dMRSxtLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLlJPTEVfTUVOVSxtLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLlJPTEVfTElTVEJPWCxtLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKF8uQ0xJQ0tfREFUQV9BUEkrXCIgXCIrXy5GT0NVU0lOX0RBVEFfQVBJLG0uX2NsZWFyTWVudXMpLm9uKF8uQ0xJQ0tfREFUQV9BUEkscC5EQVRBX1RPR0dMRSxtLnByb3RvdHlwZS50b2dnbGUpLm9uKF8uQ0xJQ0tfREFUQV9BUEkscC5GT1JNX0NISUxELGZ1bmN0aW9uKHQpe3Quc3RvcFByb3BhZ2F0aW9uKCl9KSx0LmZuW2VdPW0uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPW0sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxtLl9qUXVlcnlJbnRlcmZhY2V9LG19KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJtb2RhbFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLm1vZGFsXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT0zMDAsZD0xNTAsZj0yNyxfPXtiYWNrZHJvcDohMCxrZXlib2FyZDohMCxmb2N1czohMCxzaG93OiEwfSxnPXtiYWNrZHJvcDpcIihib29sZWFufHN0cmluZylcIixrZXlib2FyZDpcImJvb2xlYW5cIixmb2N1czpcImJvb2xlYW5cIixzaG93OlwiYm9vbGVhblwifSxwPXtISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxTSE9XOlwic2hvd1wiK2wsU0hPV046XCJzaG93blwiK2wsRk9DVVNJTjpcImZvY3VzaW5cIitsLFJFU0laRTpcInJlc2l6ZVwiK2wsQ0xJQ0tfRElTTUlTUzpcImNsaWNrLmRpc21pc3NcIitsLEtFWURPV05fRElTTUlTUzpcImtleWRvd24uZGlzbWlzc1wiK2wsTU9VU0VVUF9ESVNNSVNTOlwibW91c2V1cC5kaXNtaXNzXCIrbCxNT1VTRURPV05fRElTTUlTUzpcIm1vdXNlZG93bi5kaXNtaXNzXCIrbCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxtPXtTQ1JPTExCQVJfTUVBU1VSRVI6XCJtb2RhbC1zY3JvbGxiYXItbWVhc3VyZVwiLEJBQ0tEUk9QOlwibW9kYWwtYmFja2Ryb3BcIixPUEVOOlwibW9kYWwtb3BlblwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sRT17RElBTE9HOlwiLm1vZGFsLWRpYWxvZ1wiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsREFUQV9ESVNNSVNTOidbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLEZJWEVEX0NPTlRFTlQ6XCIuZml4ZWQtdG9wLCAuZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQsIC5zdGlja3ktdG9wXCJ9LHY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKGUsaSl7bih0aGlzLGgpLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fZWxlbWVudD1lLHRoaXMuX2RpYWxvZz10KGUpLmZpbmQoRS5ESUFMT0cpWzBdLHRoaXMuX2JhY2tkcm9wPW51bGwsdGhpcy5faXNTaG93bj0hMSx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz0hMSx0aGlzLl9pZ25vcmVCYWNrZHJvcENsaWNrPSExLHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPTAsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9MH1yZXR1cm4gaC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9pc1Nob3duP3RoaXMuaGlkZSgpOnRoaXMuc2hvdyh0KX0saC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbihlKXt2YXIgbj10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJNb2RhbCBpcyB0cmFuc2l0aW9uaW5nXCIpO3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKSYmKHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCk7dmFyIGk9dC5FdmVudChwLlNIT1cse3JlbGF0ZWRUYXJnZXQ6ZX0pO3QodGhpcy5fZWxlbWVudCkudHJpZ2dlcihpKSx0aGlzLl9pc1Nob3dufHxpLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwodGhpcy5faXNTaG93bj0hMCx0aGlzLl9jaGVja1Njcm9sbGJhcigpLHRoaXMuX3NldFNjcm9sbGJhcigpLHQoZG9jdW1lbnQuYm9keSkuYWRkQ2xhc3MobS5PUEVOKSx0aGlzLl9zZXRFc2NhcGVFdmVudCgpLHRoaXMuX3NldFJlc2l6ZUV2ZW50KCksdCh0aGlzLl9lbGVtZW50KS5vbihwLkNMSUNLX0RJU01JU1MsRS5EQVRBX0RJU01JU1MsZnVuY3Rpb24odCl7cmV0dXJuIG4uaGlkZSh0KX0pLHQodGhpcy5fZGlhbG9nKS5vbihwLk1PVVNFRE9XTl9ESVNNSVNTLGZ1bmN0aW9uKCl7dChuLl9lbGVtZW50KS5vbmUocC5NT1VTRVVQX0RJU01JU1MsZnVuY3Rpb24oZSl7dChlLnRhcmdldCkuaXMobi5fZWxlbWVudCkmJihuLl9pZ25vcmVCYWNrZHJvcENsaWNrPSEwKX0pfSksdGhpcy5fc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7cmV0dXJuIG4uX3Nob3dFbGVtZW50KGUpfSkpfSxoLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7aWYoZSYmZS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJNb2RhbCBpcyB0cmFuc2l0aW9uaW5nXCIpO3ZhciBpPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKTtpJiYodGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwKTt2YXIgbz10LkV2ZW50KHAuSElERSk7dCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKG8pLHRoaXMuX2lzU2hvd24mJiFvLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYodGhpcy5faXNTaG93bj0hMSx0aGlzLl9zZXRFc2NhcGVFdmVudCgpLHRoaXMuX3NldFJlc2l6ZUV2ZW50KCksdChkb2N1bWVudCkub2ZmKHAuRk9DVVNJTiksdCh0aGlzLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhtLlNIT1cpLHQodGhpcy5fZWxlbWVudCkub2ZmKHAuQ0xJQ0tfRElTTUlTUyksdCh0aGlzLl9kaWFsb2cpLm9mZihwLk1PVVNFRE9XTl9ESVNNSVNTKSxpP3QodGhpcy5fZWxlbWVudCkub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24odCl7cmV0dXJuIG4uX2hpZGVNb2RhbCh0KX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnRoaXMuX2hpZGVNb2RhbCgpKX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHQod2luZG93LGRvY3VtZW50LHRoaXMuX2VsZW1lbnQsdGhpcy5fYmFja2Ryb3ApLm9mZihsKSx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5fZGlhbG9nPW51bGwsdGhpcy5fYmFja2Ryb3A9bnVsbCx0aGlzLl9pc1Nob3duPW51bGwsdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmc9bnVsbCx0aGlzLl9pZ25vcmVCYWNrZHJvcENsaWNrPW51bGwsdGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz1udWxsLHRoaXMuX3Njcm9sbGJhcldpZHRoPW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sXyxuKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZyksbn0saC5wcm90b3R5cGUuX3Nob3dFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT1yLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk7dGhpcy5fZWxlbWVudC5wYXJlbnROb2RlJiZ0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERXx8ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50KSx0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiLHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiksdGhpcy5fZWxlbWVudC5zY3JvbGxUb3A9MCxpJiZyLnJlZmxvdyh0aGlzLl9lbGVtZW50KSx0KHRoaXMuX2VsZW1lbnQpLmFkZENsYXNzKG0uU0hPVyksdGhpcy5fY29uZmlnLmZvY3VzJiZ0aGlzLl9lbmZvcmNlRm9jdXMoKTt2YXIgbz10LkV2ZW50KHAuU0hPV04se3JlbGF0ZWRUYXJnZXQ6ZX0pLHM9ZnVuY3Rpb24oKXtuLl9jb25maWcuZm9jdXMmJm4uX2VsZW1lbnQuZm9jdXMoKSxuLl9pc1RyYW5zaXRpb25pbmc9ITEsdChuLl9lbGVtZW50KS50cmlnZ2VyKG8pfTtpP3QodGhpcy5fZGlhbG9nKS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTpzKCl9LGgucHJvdG90eXBlLl9lbmZvcmNlRm9jdXM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3QoZG9jdW1lbnQpLm9mZihwLkZPQ1VTSU4pLm9uKHAuRk9DVVNJTixmdW5jdGlvbihuKXtkb2N1bWVudD09PW4udGFyZ2V0fHxlLl9lbGVtZW50PT09bi50YXJnZXR8fHQoZS5fZWxlbWVudCkuaGFzKG4udGFyZ2V0KS5sZW5ndGh8fGUuX2VsZW1lbnQuZm9jdXMoKX0pfSxoLnByb3RvdHlwZS5fc2V0RXNjYXBlRXZlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2lzU2hvd24mJnRoaXMuX2NvbmZpZy5rZXlib2FyZD90KHRoaXMuX2VsZW1lbnQpLm9uKHAuS0VZRE9XTl9ESVNNSVNTLGZ1bmN0aW9uKHQpe3Qud2hpY2g9PT1mJiZlLmhpZGUoKX0pOnRoaXMuX2lzU2hvd258fHQodGhpcy5fZWxlbWVudCkub2ZmKHAuS0VZRE9XTl9ESVNNSVNTKX0saC5wcm90b3R5cGUuX3NldFJlc2l6ZUV2ZW50PWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9pc1Nob3duP3Qod2luZG93KS5vbihwLlJFU0laRSxmdW5jdGlvbih0KXtyZXR1cm4gZS5faGFuZGxlVXBkYXRlKHQpfSk6dCh3aW5kb3cpLm9mZihwLlJFU0laRSl9LGgucHJvdG90eXBlLl9oaWRlTW9kYWw9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheT1cIm5vbmVcIix0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpLHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl9zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXt0KGRvY3VtZW50LmJvZHkpLnJlbW92ZUNsYXNzKG0uT1BFTiksZS5fcmVzZXRBZGp1c3RtZW50cygpLGUuX3Jlc2V0U2Nyb2xsYmFyKCksdChlLl9lbGVtZW50KS50cmlnZ2VyKHAuSElEREVOKX0pfSxoLnByb3RvdHlwZS5fcmVtb3ZlQmFja2Ryb3A9ZnVuY3Rpb24oKXt0aGlzLl9iYWNrZHJvcCYmKHQodGhpcy5fYmFja2Ryb3ApLnJlbW92ZSgpLHRoaXMuX2JhY2tkcm9wPW51bGwpfSxoLnByb3RvdHlwZS5fc2hvd0JhY2tkcm9wPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT10KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk/bS5GQURFOlwiXCI7aWYodGhpcy5faXNTaG93biYmdGhpcy5fY29uZmlnLmJhY2tkcm9wKXt2YXIgbz1yLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZpO2lmKHRoaXMuX2JhY2tkcm9wPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdGhpcy5fYmFja2Ryb3AuY2xhc3NOYW1lPW0uQkFDS0RST1AsaSYmdCh0aGlzLl9iYWNrZHJvcCkuYWRkQ2xhc3MoaSksdCh0aGlzLl9iYWNrZHJvcCkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSksdCh0aGlzLl9lbGVtZW50KS5vbihwLkNMSUNLX0RJU01JU1MsZnVuY3Rpb24odCl7cmV0dXJuIG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s/dm9pZChuLl9pZ25vcmVCYWNrZHJvcENsaWNrPSExKTp2b2lkKHQudGFyZ2V0PT09dC5jdXJyZW50VGFyZ2V0JiYoXCJzdGF0aWNcIj09PW4uX2NvbmZpZy5iYWNrZHJvcD9uLl9lbGVtZW50LmZvY3VzKCk6bi5oaWRlKCkpKX0pLG8mJnIucmVmbG93KHRoaXMuX2JhY2tkcm9wKSx0KHRoaXMuX2JhY2tkcm9wKS5hZGRDbGFzcyhtLlNIT1cpLCFlKXJldHVybjtpZighbylyZXR1cm4gdm9pZCBlKCk7dCh0aGlzLl9iYWNrZHJvcCkub25lKHIuVFJBTlNJVElPTl9FTkQsZSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoZCl9ZWxzZSBpZighdGhpcy5faXNTaG93biYmdGhpcy5fYmFja2Ryb3Ape3QodGhpcy5fYmFja2Ryb3ApLnJlbW92ZUNsYXNzKG0uU0hPVyk7dmFyIHM9ZnVuY3Rpb24oKXtuLl9yZW1vdmVCYWNrZHJvcCgpLGUmJmUoKX07ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpP3QodGhpcy5fYmFja2Ryb3ApLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGQpOnMoKX1lbHNlIGUmJmUoKX0saC5wcm90b3R5cGUuX2hhbmRsZVVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuX2FkanVzdERpYWxvZygpfSxoLnByb3RvdHlwZS5fYWRqdXN0RGlhbG9nPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fZWxlbWVudC5zY3JvbGxIZWlnaHQ+ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDshdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcmJnQmJih0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0PXRoaXMuX3Njcm9sbGJhcldpZHRoK1wicHhcIiksdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcmJiF0JiYodGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQ9dGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKX0saC5wcm90b3R5cGUuX3Jlc2V0QWRqdXN0bWVudHM9ZnVuY3Rpb24oKXt0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0PVwiXCIsdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQ9XCJcIn0saC5wcm90b3R5cGUuX2NoZWNrU2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dGhpcy5faXNCb2R5T3ZlcmZsb3dpbmc9ZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDx3aW5kb3cuaW5uZXJXaWR0aCx0aGlzLl9zY3JvbGxiYXJXaWR0aD10aGlzLl9nZXRTY3JvbGxiYXJXaWR0aCgpfSxoLnByb3RvdHlwZS5fc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dmFyIGU9cGFyc2VJbnQodChFLkZJWEVEX0NPTlRFTlQpLmNzcyhcInBhZGRpbmctcmlnaHRcIil8fDAsMTApO3RoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHR8fFwiXCIsdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcmJihkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodD1lK3RoaXMuX3Njcm9sbGJhcldpZHRoK1wicHhcIil9LGgucHJvdG90eXBlLl9yZXNldFNjcm9sbGJhcj1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0PXRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmd9LGgucHJvdG90eXBlLl9nZXRTY3JvbGxiYXJXaWR0aD1mdW5jdGlvbigpe3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dC5jbGFzc05hbWU9bS5TQ1JPTExCQVJfTUVBU1VSRVIsZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0KTt2YXIgZT10Lm9mZnNldFdpZHRoLXQuY2xpZW50V2lkdGg7cmV0dXJuIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodCksZX0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUsbil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBvPXQodGhpcykuZGF0YShhKSxyPXQuZXh0ZW5kKHt9LGguRGVmYXVsdCx0KHRoaXMpLmRhdGEoKSxcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmUpO2lmKG98fChvPW5ldyBoKHRoaXMsciksdCh0aGlzKS5kYXRhKGEsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1vW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO29bZV0obil9ZWxzZSByLnNob3cmJm8uc2hvdyhuKX0pfSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIF99fV0pLGh9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKHAuQ0xJQ0tfREFUQV9BUEksRS5EQVRBX1RPR0dMRSxmdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9dm9pZCAwLG89ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpO28mJihpPXQobylbMF0pO3ZhciBzPXQoaSkuZGF0YShhKT9cInRvZ2dsZVwiOnQuZXh0ZW5kKHt9LHQoaSkuZGF0YSgpLHQodGhpcykuZGF0YSgpKTtcIkFcIiE9PXRoaXMudGFnTmFtZSYmXCJBUkVBXCIhPT10aGlzLnRhZ05hbWV8fGUucHJldmVudERlZmF1bHQoKTt2YXIgbD10KGkpLm9uZShwLlNIT1csZnVuY3Rpb24oZSl7ZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8bC5vbmUocC5ISURERU4sZnVuY3Rpb24oKXt0KG4pLmlzKFwiOnZpc2libGVcIikmJm4uZm9jdXMoKX0pfSk7di5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChpKSxzLHRoaXMpfSksdC5mbltlXT12Ll9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj12LHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsdi5falF1ZXJ5SW50ZXJmYWNlfSx2fShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwic2Nyb2xsc3B5XCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMuc2Nyb2xsc3B5XCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT17b2Zmc2V0OjEwLG1ldGhvZDpcImF1dG9cIix0YXJnZXQ6XCJcIn0sZD17b2Zmc2V0OlwibnVtYmVyXCIsbWV0aG9kOlwic3RyaW5nXCIsdGFyZ2V0OlwiKHN0cmluZ3xlbGVtZW50KVwifSxmPXtBQ1RJVkFURTpcImFjdGl2YXRlXCIrbCxTQ1JPTEw6XCJzY3JvbGxcIitsLExPQURfREFUQV9BUEk6XCJsb2FkXCIrbCtofSxfPXtEUk9QRE9XTl9JVEVNOlwiZHJvcGRvd24taXRlbVwiLERST1BET1dOX01FTlU6XCJkcm9wZG93bi1tZW51XCIsTkFWX0xJTks6XCJuYXYtbGlua1wiLE5BVjpcIm5hdlwiLEFDVElWRTpcImFjdGl2ZVwifSxnPXtEQVRBX1NQWTonW2RhdGEtc3B5PVwic2Nyb2xsXCJdJyxBQ1RJVkU6XCIuYWN0aXZlXCIsTElTVF9JVEVNOlwiLmxpc3QtaXRlbVwiLExJOlwibGlcIixMSV9EUk9QRE9XTjpcImxpLmRyb3Bkb3duXCIsTkFWX0xJTktTOlwiLm5hdi1saW5rXCIsRFJPUERPV046XCIuZHJvcGRvd25cIixEUk9QRE9XTl9JVEVNUzpcIi5kcm9wZG93bi1pdGVtXCIsRFJPUERPV05fVE9HR0xFOlwiLmRyb3Bkb3duLXRvZ2dsZVwifSxwPXtPRkZTRVQ6XCJvZmZzZXRcIixQT1NJVElPTjpcInBvc2l0aW9uXCJ9LG09ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKGUsaSl7dmFyIG89dGhpcztuKHRoaXMsaCksdGhpcy5fZWxlbWVudD1lLHRoaXMuX3Njcm9sbEVsZW1lbnQ9XCJCT0RZXCI9PT1lLnRhZ05hbWU/d2luZG93OmUsdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9zZWxlY3Rvcj10aGlzLl9jb25maWcudGFyZ2V0K1wiIFwiK2cuTkFWX0xJTktTK1wiLFwiKyh0aGlzLl9jb25maWcudGFyZ2V0K1wiIFwiK2cuRFJPUERPV05fSVRFTVMpLHRoaXMuX29mZnNldHM9W10sdGhpcy5fdGFyZ2V0cz1bXSx0aGlzLl9hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLl9zY3JvbGxIZWlnaHQ9MCx0KHRoaXMuX3Njcm9sbEVsZW1lbnQpLm9uKGYuU0NST0xMLGZ1bmN0aW9uKHQpe3JldHVybiBvLl9wcm9jZXNzKHQpfSksdGhpcy5yZWZyZXNoKCksdGhpcy5fcHJvY2VzcygpfXJldHVybiBoLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxuPXRoaXMuX3Njcm9sbEVsZW1lbnQhPT10aGlzLl9zY3JvbGxFbGVtZW50LndpbmRvdz9wLlBPU0lUSU9OOnAuT0ZGU0VULGk9XCJhdXRvXCI9PT10aGlzLl9jb25maWcubWV0aG9kP246dGhpcy5fY29uZmlnLm1ldGhvZCxvPWk9PT1wLlBPU0lUSU9OP3RoaXMuX2dldFNjcm9sbFRvcCgpOjA7dGhpcy5fb2Zmc2V0cz1bXSx0aGlzLl90YXJnZXRzPVtdLHRoaXMuX3Njcm9sbEhlaWdodD10aGlzLl9nZXRTY3JvbGxIZWlnaHQoKTt2YXIgcz10Lm1ha2VBcnJheSh0KHRoaXMuX3NlbGVjdG9yKSk7cy5tYXAoZnVuY3Rpb24oZSl7dmFyIG49dm9pZCAwLHM9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBzJiYobj10KHMpWzBdKSxuJiYobi5vZmZzZXRXaWR0aHx8bi5vZmZzZXRIZWlnaHQpP1t0KG4pW2ldKCkudG9wK28sc106bnVsbH0pLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdH0pLnNvcnQoZnVuY3Rpb24odCxlKXtyZXR1cm4gdFswXS1lWzBdfSkuZm9yRWFjaChmdW5jdGlvbih0KXtlLl9vZmZzZXRzLnB1c2godFswXSksZS5fdGFyZ2V0cy5wdXNoKHRbMV0pfSl9LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0KHRoaXMuX3Njcm9sbEVsZW1lbnQpLm9mZihsKSx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5fc2Nyb2xsRWxlbWVudD1udWxsLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX3NlbGVjdG9yPW51bGwsdGhpcy5fb2Zmc2V0cz1udWxsLHRoaXMuX3RhcmdldHM9bnVsbCx0aGlzLl9hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLl9zY3JvbGxIZWlnaHQ9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtpZihuPXQuZXh0ZW5kKHt9LHUsbiksXCJzdHJpbmdcIiE9dHlwZW9mIG4udGFyZ2V0KXt2YXIgaT10KG4udGFyZ2V0KS5hdHRyKFwiaWRcIik7aXx8KGk9ci5nZXRVSUQoZSksdChuLnRhcmdldCkuYXR0cihcImlkXCIsaSkpLG4udGFyZ2V0PVwiI1wiK2l9cmV0dXJuIHIudHlwZUNoZWNrQ29uZmlnKGUsbixkKSxufSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsVG9wPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQ9PT13aW5kb3c/dGhpcy5fc2Nyb2xsRWxlbWVudC5wYWdlWU9mZnNldDp0aGlzLl9zY3JvbGxFbGVtZW50LnNjcm9sbFRvcH0saC5wcm90b3R5cGUuX2dldFNjcm9sbEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50LnNjcm9sbEhlaWdodHx8TWF0aC5tYXgoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCl9LGgucHJvdG90eXBlLl9nZXRPZmZzZXRIZWlnaHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudD09PXdpbmRvdz93aW5kb3cuaW5uZXJIZWlnaHQ6dGhpcy5fc2Nyb2xsRWxlbWVudC5vZmZzZXRIZWlnaHR9LGgucHJvdG90eXBlLl9wcm9jZXNzPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fZ2V0U2Nyb2xsVG9wKCkrdGhpcy5fY29uZmlnLm9mZnNldCxlPXRoaXMuX2dldFNjcm9sbEhlaWdodCgpLG49dGhpcy5fY29uZmlnLm9mZnNldCtlLXRoaXMuX2dldE9mZnNldEhlaWdodCgpO2lmKHRoaXMuX3Njcm9sbEhlaWdodCE9PWUmJnRoaXMucmVmcmVzaCgpLHQ+PW4pe3ZhciBpPXRoaXMuX3RhcmdldHNbdGhpcy5fdGFyZ2V0cy5sZW5ndGgtMV07cmV0dXJuIHZvaWQodGhpcy5fYWN0aXZlVGFyZ2V0IT09aSYmdGhpcy5fYWN0aXZhdGUoaSkpfWlmKHRoaXMuX2FjdGl2ZVRhcmdldCYmdDx0aGlzLl9vZmZzZXRzWzBdJiZ0aGlzLl9vZmZzZXRzWzBdPjApcmV0dXJuIHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHZvaWQgdGhpcy5fY2xlYXIoKTtmb3IodmFyIG89dGhpcy5fb2Zmc2V0cy5sZW5ndGg7by0tOyl7dmFyIHI9dGhpcy5fYWN0aXZlVGFyZ2V0IT09dGhpcy5fdGFyZ2V0c1tvXSYmdD49dGhpcy5fb2Zmc2V0c1tvXSYmKHZvaWQgMD09PXRoaXMuX29mZnNldHNbbysxXXx8dDx0aGlzLl9vZmZzZXRzW28rMV0pO3ImJnRoaXMuX2FjdGl2YXRlKHRoaXMuX3RhcmdldHNbb10pfX0saC5wcm90b3R5cGUuX2FjdGl2YXRlPWZ1bmN0aW9uKGUpe3RoaXMuX2FjdGl2ZVRhcmdldD1lLHRoaXMuX2NsZWFyKCk7dmFyIG49dGhpcy5fc2VsZWN0b3Iuc3BsaXQoXCIsXCIpO249bi5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQrJ1tkYXRhLXRhcmdldD1cIicrZSsnXCJdLCcrKHQrJ1tocmVmPVwiJytlKydcIl0nKX0pO3ZhciBpPXQobi5qb2luKFwiLFwiKSk7aS5oYXNDbGFzcyhfLkRST1BET1dOX0lURU0pPyhpLmNsb3Nlc3QoZy5EUk9QRE9XTikuZmluZChnLkRST1BET1dOX1RPR0dMRSkuYWRkQ2xhc3MoXy5BQ1RJVkUpLGkuYWRkQ2xhc3MoXy5BQ1RJVkUpKTppLnBhcmVudHMoZy5MSSkuZmluZChcIj4gXCIrZy5OQVZfTElOS1MpLmFkZENsYXNzKF8uQUNUSVZFKSx0KHRoaXMuX3Njcm9sbEVsZW1lbnQpLnRyaWdnZXIoZi5BQ1RJVkFURSx7cmVsYXRlZFRhcmdldDplfSl9LGgucHJvdG90eXBlLl9jbGVhcj1mdW5jdGlvbigpe3QodGhpcy5fc2VsZWN0b3IpLmZpbHRlcihnLkFDVElWRSkucmVtb3ZlQ2xhc3MoXy5BQ1RJVkUpfSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZTtcclxuaWYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW5bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7bltlXSgpfX0pfSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHV9fV0pLGh9KCk7cmV0dXJuIHQod2luZG93KS5vbihmLkxPQURfREFUQV9BUEksZnVuY3Rpb24oKXtmb3IodmFyIGU9dC5tYWtlQXJyYXkodChnLkRBVEFfU1BZKSksbj1lLmxlbmd0aDtuLS07KXt2YXIgaT10KGVbbl0pO20uX2pRdWVyeUludGVyZmFjZS5jYWxsKGksaS5kYXRhKCkpfX0pLHQuZm5bZV09bS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9bSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1jLG0uX2pRdWVyeUludGVyZmFjZX0sbX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cInRhYlwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLnRhYlwiLGE9XCIuXCIrcyxsPVwiLmRhdGEtYXBpXCIsaD10LmZuW2VdLGM9MTUwLHU9e0hJREU6XCJoaWRlXCIrYSxISURERU46XCJoaWRkZW5cIithLFNIT1c6XCJzaG93XCIrYSxTSE9XTjpcInNob3duXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsfSxkPXtEUk9QRE9XTl9NRU5VOlwiZHJvcGRvd24tbWVudVwiLEFDVElWRTpcImFjdGl2ZVwiLERJU0FCTEVEOlwiZGlzYWJsZWRcIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LGY9e0E6XCJhXCIsTEk6XCJsaVwiLERST1BET1dOOlwiLmRyb3Bkb3duXCIsTElTVDpcInVsOm5vdCguZHJvcGRvd24tbWVudSksIG9sOm5vdCguZHJvcGRvd24tbWVudSksIG5hdjpub3QoLmRyb3Bkb3duLW1lbnUpXCIsRkFERV9DSElMRDpcIj4gLm5hdi1pdGVtIC5mYWRlLCA+IC5mYWRlXCIsQUNUSVZFOlwiLmFjdGl2ZVwiLEFDVElWRV9DSElMRDpcIj4gLm5hdi1pdGVtID4gLmFjdGl2ZSwgPiAuYWN0aXZlXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cInRhYlwiXSwgW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsRFJPUERPV05fVE9HR0xFOlwiLmRyb3Bkb3duLXRvZ2dsZVwiLERST1BET1dOX0FDVElWRV9DSElMRDpcIj4gLmRyb3Bkb3duLW1lbnUgLmFjdGl2ZVwifSxfPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10fXJldHVybiBlLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZighKHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZSYmdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlPT09Tm9kZS5FTEVNRU5UX05PREUmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZC5BQ1RJVkUpfHx0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGQuRElTQUJMRUQpKSl7dmFyIG49dm9pZCAwLGk9dm9pZCAwLG89dCh0aGlzLl9lbGVtZW50KS5jbG9zZXN0KGYuTElTVClbMF0scz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcy5fZWxlbWVudCk7byYmKGk9dC5tYWtlQXJyYXkodChvKS5maW5kKGYuQUNUSVZFKSksaT1pW2kubGVuZ3RoLTFdKTt2YXIgYT10LkV2ZW50KHUuSElERSx7cmVsYXRlZFRhcmdldDp0aGlzLl9lbGVtZW50fSksbD10LkV2ZW50KHUuU0hPVyx7cmVsYXRlZFRhcmdldDppfSk7aWYoaSYmdChpKS50cmlnZ2VyKGEpLHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihsKSwhbC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmIWEuaXNEZWZhdWx0UHJldmVudGVkKCkpe3MmJihuPXQocylbMF0pLHRoaXMuX2FjdGl2YXRlKHRoaXMuX2VsZW1lbnQsbyk7dmFyIGg9ZnVuY3Rpb24oKXt2YXIgbj10LkV2ZW50KHUuSElEREVOLHtyZWxhdGVkVGFyZ2V0OmUuX2VsZW1lbnR9KSxvPXQuRXZlbnQodS5TSE9XTix7cmVsYXRlZFRhcmdldDppfSk7dChpKS50cmlnZ2VyKG4pLHQoZS5fZWxlbWVudCkudHJpZ2dlcihvKX07bj90aGlzLl9hY3RpdmF0ZShuLG4ucGFyZW50Tm9kZSxoKTpoKCl9fX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlQ2xhc3ModGhpcy5fZWxlbWVudCxzKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9hY3RpdmF0ZT1mdW5jdGlvbihlLG4saSl7dmFyIG89dGhpcyxzPXQobikuZmluZChmLkFDVElWRV9DSElMRClbMF0sYT1pJiZyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiYocyYmdChzKS5oYXNDbGFzcyhkLkZBREUpfHxCb29sZWFuKHQobikuZmluZChmLkZBREVfQ0hJTEQpWzBdKSksbD1mdW5jdGlvbigpe3JldHVybiBvLl90cmFuc2l0aW9uQ29tcGxldGUoZSxzLGEsaSl9O3MmJmE/dChzKS5vbmUoci5UUkFOU0lUSU9OX0VORCxsKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjKTpsKCkscyYmdChzKS5yZW1vdmVDbGFzcyhkLlNIT1cpfSxlLnByb3RvdHlwZS5fdHJhbnNpdGlvbkNvbXBsZXRlPWZ1bmN0aW9uKGUsbixpLG8pe2lmKG4pe3QobikucmVtb3ZlQ2xhc3MoZC5BQ1RJVkUpO3ZhciBzPXQobi5wYXJlbnROb2RlKS5maW5kKGYuRFJPUERPV05fQUNUSVZFX0NISUxEKVswXTtzJiZ0KHMpLnJlbW92ZUNsYXNzKGQuQUNUSVZFKSxuLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMSl9aWYodChlKS5hZGRDbGFzcyhkLkFDVElWRSksZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApLGk/KHIucmVmbG93KGUpLHQoZSkuYWRkQ2xhc3MoZC5TSE9XKSk6dChlKS5yZW1vdmVDbGFzcyhkLkZBREUpLGUucGFyZW50Tm9kZSYmdChlLnBhcmVudE5vZGUpLmhhc0NsYXNzKGQuRFJPUERPV05fTUVOVSkpe3ZhciBhPXQoZSkuY2xvc2VzdChmLkRST1BET1dOKVswXTthJiZ0KGEpLmZpbmQoZi5EUk9QRE9XTl9UT0dHTEUpLmFkZENsYXNzKGQuQUNUSVZFKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCl9byYmbygpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcyksbz1pLmRhdGEocyk7aWYob3x8KG89bmV3IGUodGhpcyksaS5kYXRhKHMsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBuKXtpZih2b2lkIDA9PT1vW25dKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytuKydcIicpO29bbl0oKX19KX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKHUuQ0xJQ0tfREFUQV9BUEksZi5EQVRBX1RPR0dMRSxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCksXy5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodCh0aGlzKSxcInNob3dcIil9KSx0LmZuW2VdPV8uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPV8sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxfLl9qUXVlcnlJbnRlcmZhY2V9LF99KGpRdWVyeSksZnVuY3Rpb24odCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFRldGhlcil0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAgdG9vbHRpcHMgcmVxdWlyZSBUZXRoZXIgKGh0dHA6Ly90ZXRoZXIuaW8vKVwiKTt2YXIgZT1cInRvb2x0aXBcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy50b29sdGlwXCIsbD1cIi5cIithLGg9dC5mbltlXSxjPTE1MCx1PVwiYnMtdGV0aGVyXCIsZD17YW5pbWF0aW9uOiEwLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLHRyaWdnZXI6XCJob3ZlciBmb2N1c1wiLHRpdGxlOlwiXCIsZGVsYXk6MCxodG1sOiExLHNlbGVjdG9yOiExLHBsYWNlbWVudDpcInRvcFwiLG9mZnNldDpcIjAgMFwiLGNvbnN0cmFpbnRzOltdLGNvbnRhaW5lcjohMX0sZj17YW5pbWF0aW9uOlwiYm9vbGVhblwiLHRlbXBsYXRlOlwic3RyaW5nXCIsdGl0bGU6XCIoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pXCIsdHJpZ2dlcjpcInN0cmluZ1wiLGRlbGF5OlwiKG51bWJlcnxvYmplY3QpXCIsaHRtbDpcImJvb2xlYW5cIixzZWxlY3RvcjpcIihzdHJpbmd8Ym9vbGVhbilcIixwbGFjZW1lbnQ6XCIoc3RyaW5nfGZ1bmN0aW9uKVwiLG9mZnNldDpcInN0cmluZ1wiLGNvbnN0cmFpbnRzOlwiYXJyYXlcIixjb250YWluZXI6XCIoc3RyaW5nfGVsZW1lbnR8Ym9vbGVhbilcIn0sXz17VE9QOlwiYm90dG9tIGNlbnRlclwiLFJJR0hUOlwibWlkZGxlIGxlZnRcIixCT1RUT006XCJ0b3AgY2VudGVyXCIsTEVGVDpcIm1pZGRsZSByaWdodFwifSxnPXtTSE9XOlwic2hvd1wiLE9VVDpcIm91dFwifSxwPXtISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxTSE9XOlwic2hvd1wiK2wsU0hPV046XCJzaG93blwiK2wsSU5TRVJURUQ6XCJpbnNlcnRlZFwiK2wsQ0xJQ0s6XCJjbGlja1wiK2wsRk9DVVNJTjpcImZvY3VzaW5cIitsLEZPQ1VTT1VUOlwiZm9jdXNvdXRcIitsLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrbCxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2x9LG09e0ZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sRT17VE9PTFRJUDpcIi50b29sdGlwXCIsVE9PTFRJUF9JTk5FUjpcIi50b29sdGlwLWlubmVyXCJ9LHY9e2VsZW1lbnQ6ITEsZW5hYmxlZDohMX0sVD17SE9WRVI6XCJob3ZlclwiLEZPQ1VTOlwiZm9jdXNcIixDTElDSzpcImNsaWNrXCIsTUFOVUFMOlwibWFudWFsXCJ9LEk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKHQsZSl7bih0aGlzLGgpLHRoaXMuX2lzRW5hYmxlZD0hMCx0aGlzLl90aW1lb3V0PTAsdGhpcy5faG92ZXJTdGF0ZT1cIlwiLHRoaXMuX2FjdGl2ZVRyaWdnZXI9e30sdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX3RldGhlcj1udWxsLHRoaXMuZWxlbWVudD10LHRoaXMuY29uZmlnPXRoaXMuX2dldENvbmZpZyhlKSx0aGlzLnRpcD1udWxsLHRoaXMuX3NldExpc3RlbmVycygpfXJldHVybiBoLnByb3RvdHlwZS5lbmFibGU9ZnVuY3Rpb24oKXt0aGlzLl9pc0VuYWJsZWQ9ITB9LGgucHJvdG90eXBlLmRpc2FibGU9ZnVuY3Rpb24oKXt0aGlzLl9pc0VuYWJsZWQ9ITF9LGgucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQ9ZnVuY3Rpb24oKXt0aGlzLl9pc0VuYWJsZWQ9IXRoaXMuX2lzRW5hYmxlZH0saC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGUpe2lmKGUpe3ZhciBuPXRoaXMuY29uc3RydWN0b3IuREFUQV9LRVksaT10KGUuY3VycmVudFRhcmdldCkuZGF0YShuKTtpfHwoaT1uZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsdGhpcy5fZ2V0RGVsZWdhdGVDb25maWcoKSksdChlLmN1cnJlbnRUYXJnZXQpLmRhdGEobixpKSksaS5fYWN0aXZlVHJpZ2dlci5jbGljaz0haS5fYWN0aXZlVHJpZ2dlci5jbGljayxpLl9pc1dpdGhBY3RpdmVUcmlnZ2VyKCk/aS5fZW50ZXIobnVsbCxpKTppLl9sZWF2ZShudWxsLGkpfWVsc2V7aWYodCh0aGlzLmdldFRpcEVsZW1lbnQoKSkuaGFzQ2xhc3MobS5TSE9XKSlyZXR1cm4gdm9pZCB0aGlzLl9sZWF2ZShudWxsLHRoaXMpO3RoaXMuX2VudGVyKG51bGwsdGhpcyl9fSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXQpLHRoaXMuY2xlYW51cFRldGhlcigpLHQucmVtb3ZlRGF0YSh0aGlzLmVsZW1lbnQsdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSksdCh0aGlzLmVsZW1lbnQpLm9mZih0aGlzLmNvbnN0cnVjdG9yLkVWRU5UX0tFWSksdCh0aGlzLmVsZW1lbnQpLmNsb3Nlc3QoXCIubW9kYWxcIikub2ZmKFwiaGlkZS5icy5tb2RhbFwiKSx0aGlzLnRpcCYmdCh0aGlzLnRpcCkucmVtb3ZlKCksdGhpcy5faXNFbmFibGVkPW51bGwsdGhpcy5fdGltZW91dD1udWxsLHRoaXMuX2hvdmVyU3RhdGU9bnVsbCx0aGlzLl9hY3RpdmVUcmlnZ2VyPW51bGwsdGhpcy5fdGV0aGVyPW51bGwsdGhpcy5lbGVtZW50PW51bGwsdGhpcy5jb25maWc9bnVsbCx0aGlzLnRpcD1udWxsfSxoLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZihcIm5vbmVcIj09PXQodGhpcy5lbGVtZW50KS5jc3MoXCJkaXNwbGF5XCIpKXRocm93IG5ldyBFcnJvcihcIlBsZWFzZSB1c2Ugc2hvdyBvbiB2aXNpYmxlIGVsZW1lbnRzXCIpO3ZhciBuPXQuRXZlbnQodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5TSE9XKTtpZih0aGlzLmlzV2l0aENvbnRlbnQoKSYmdGhpcy5faXNFbmFibGVkKXtpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiVG9vbHRpcCBpcyB0cmFuc2l0aW9uaW5nXCIpO3QodGhpcy5lbGVtZW50KS50cmlnZ2VyKG4pO3ZhciBpPXQuY29udGFpbnModGhpcy5lbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LHRoaXMuZWxlbWVudCk7aWYobi5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8IWkpcmV0dXJuO3ZhciBvPXRoaXMuZ2V0VGlwRWxlbWVudCgpLHM9ci5nZXRVSUQodGhpcy5jb25zdHJ1Y3Rvci5OQU1FKTtvLnNldEF0dHJpYnV0ZShcImlkXCIscyksdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIixzKSx0aGlzLnNldENvbnRlbnQoKSx0aGlzLmNvbmZpZy5hbmltYXRpb24mJnQobykuYWRkQ2xhc3MobS5GQURFKTt2YXIgYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy5wbGFjZW1lbnQ/dGhpcy5jb25maWcucGxhY2VtZW50LmNhbGwodGhpcyxvLHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcucGxhY2VtZW50LGw9dGhpcy5fZ2V0QXR0YWNobWVudChhKSxjPXRoaXMuY29uZmlnLmNvbnRhaW5lcj09PSExP2RvY3VtZW50LmJvZHk6dCh0aGlzLmNvbmZpZy5jb250YWluZXIpO3QobykuZGF0YSh0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZLHRoaXMpLmFwcGVuZFRvKGMpLHQodGhpcy5lbGVtZW50KS50cmlnZ2VyKHRoaXMuY29uc3RydWN0b3IuRXZlbnQuSU5TRVJURUQpLHRoaXMuX3RldGhlcj1uZXcgVGV0aGVyKHthdHRhY2htZW50OmwsZWxlbWVudDpvLHRhcmdldDp0aGlzLmVsZW1lbnQsY2xhc3Nlczp2LGNsYXNzUHJlZml4OnUsb2Zmc2V0OnRoaXMuY29uZmlnLm9mZnNldCxjb25zdHJhaW50czp0aGlzLmNvbmZpZy5jb25zdHJhaW50cyxhZGRUYXJnZXRDbGFzc2VzOiExfSksci5yZWZsb3cobyksdGhpcy5fdGV0aGVyLnBvc2l0aW9uKCksdChvKS5hZGRDbGFzcyhtLlNIT1cpO3ZhciBkPWZ1bmN0aW9uKCl7dmFyIG49ZS5faG92ZXJTdGF0ZTtlLl9ob3ZlclN0YXRlPW51bGwsZS5faXNUcmFuc2l0aW9uaW5nPSExLHQoZS5lbGVtZW50KS50cmlnZ2VyKGUuY29uc3RydWN0b3IuRXZlbnQuU0hPV04pLG49PT1nLk9VVCYmZS5fbGVhdmUobnVsbCxlKX07aWYoci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLnRpcCkuaGFzQ2xhc3MobS5GQURFKSlyZXR1cm4gdGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwLHZvaWQgdCh0aGlzLnRpcCkub25lKHIuVFJBTlNJVElPTl9FTkQsZCkuZW11bGF0ZVRyYW5zaXRpb25FbmQoaC5fVFJBTlNJVElPTl9EVVJBVElPTik7ZCgpfX0saC5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9dGhpcy5nZXRUaXBFbGVtZW50KCksbz10LkV2ZW50KHRoaXMuY29uc3RydWN0b3IuRXZlbnQuSElERSk7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIlRvb2x0aXAgaXMgdHJhbnNpdGlvbmluZ1wiKTt2YXIgcz1mdW5jdGlvbigpe24uX2hvdmVyU3RhdGUhPT1nLlNIT1cmJmkucGFyZW50Tm9kZSYmaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGkpLG4uZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpLHQobi5lbGVtZW50KS50cmlnZ2VyKG4uY29uc3RydWN0b3IuRXZlbnQuSElEREVOKSxuLl9pc1RyYW5zaXRpb25pbmc9ITEsbi5jbGVhbnVwVGV0aGVyKCksZSYmZSgpfTt0KHRoaXMuZWxlbWVudCkudHJpZ2dlcihvKSxvLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwodChpKS5yZW1vdmVDbGFzcyhtLlNIT1cpLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5DTElDS109ITEsdGhpcy5fYWN0aXZlVHJpZ2dlcltULkZPQ1VTXT0hMSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuSE9WRVJdPSExLHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy50aXApLmhhc0NsYXNzKG0uRkFERSk/KHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCx0KGkpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpKTpzKCksdGhpcy5faG92ZXJTdGF0ZT1cIlwiKX0saC5wcm90b3R5cGUuaXNXaXRoQ29udGVudD1mdW5jdGlvbigpe3JldHVybiBCb29sZWFuKHRoaXMuZ2V0VGl0bGUoKSl9LGgucHJvdG90eXBlLmdldFRpcEVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aXA9dGhpcy50aXB8fHQodGhpcy5jb25maWcudGVtcGxhdGUpWzBdfSxoLnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzLmdldFRpcEVsZW1lbnQoKSk7dGhpcy5zZXRFbGVtZW50Q29udGVudChlLmZpbmQoRS5UT09MVElQX0lOTkVSKSx0aGlzLmdldFRpdGxlKCkpLGUucmVtb3ZlQ2xhc3MobS5GQURFK1wiIFwiK20uU0hPVyksdGhpcy5jbGVhbnVwVGV0aGVyKCl9LGgucHJvdG90eXBlLnNldEVsZW1lbnRDb250ZW50PWZ1bmN0aW9uKGUsbil7dmFyIG89dGhpcy5jb25maWcuaHRtbDtcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBuP1widW5kZWZpbmVkXCI6aShuKSkmJihuLm5vZGVUeXBlfHxuLmpxdWVyeSk/bz90KG4pLnBhcmVudCgpLmlzKGUpfHxlLmVtcHR5KCkuYXBwZW5kKG4pOmUudGV4dCh0KG4pLnRleHQoKSk6ZVtvP1wiaHRtbFwiOlwidGV4dFwiXShuKX0saC5wcm90b3R5cGUuZ2V0VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKTtyZXR1cm4gdHx8KHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5jb25maWcudGl0bGU/dGhpcy5jb25maWcudGl0bGUuY2FsbCh0aGlzLmVsZW1lbnQpOnRoaXMuY29uZmlnLnRpdGxlKSx0fSxoLnByb3RvdHlwZS5jbGVhbnVwVGV0aGVyPWZ1bmN0aW9uKCl7dGhpcy5fdGV0aGVyJiZ0aGlzLl90ZXRoZXIuZGVzdHJveSgpfSxoLnByb3RvdHlwZS5fZ2V0QXR0YWNobWVudD1mdW5jdGlvbih0KXtyZXR1cm4gX1t0LnRvVXBwZXJDYXNlKCldfSxoLnByb3RvdHlwZS5fc2V0TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxuPXRoaXMuY29uZmlnLnRyaWdnZXIuc3BsaXQoXCIgXCIpO24uZm9yRWFjaChmdW5jdGlvbihuKXtpZihcImNsaWNrXCI9PT1uKXQoZS5lbGVtZW50KS5vbihlLmNvbnN0cnVjdG9yLkV2ZW50LkNMSUNLLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLnRvZ2dsZSh0KX0pO2Vsc2UgaWYobiE9PVQuTUFOVUFMKXt2YXIgaT1uPT09VC5IT1ZFUj9lLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFRU5URVI6ZS5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU0lOLG89bj09PVQuSE9WRVI/ZS5jb25zdHJ1Y3Rvci5FdmVudC5NT1VTRUxFQVZFOmUuY29uc3RydWN0b3IuRXZlbnQuRk9DVVNPVVQ7dChlLmVsZW1lbnQpLm9uKGksZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUuX2VudGVyKHQpfSkub24obyxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS5fbGVhdmUodCl9KX10KGUuZWxlbWVudCkuY2xvc2VzdChcIi5tb2RhbFwiKS5vbihcImhpZGUuYnMubW9kYWxcIixmdW5jdGlvbigpe3JldHVybiBlLmhpZGUoKX0pfSksdGhpcy5jb25maWcuc2VsZWN0b3I/dGhpcy5jb25maWc9dC5leHRlbmQoe30sdGhpcy5jb25maWcse3RyaWdnZXI6XCJtYW51YWxcIixzZWxlY3RvcjpcIlwifSk6dGhpcy5fZml4VGl0bGUoKX0saC5wcm90b3R5cGUuX2ZpeFRpdGxlPWZ1bmN0aW9uKCl7dmFyIHQ9aSh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSk7KHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKXx8XCJzdHJpbmdcIiE9PXQpJiYodGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIix0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGl0bGVcIil8fFwiXCIpLHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLFwiXCIpKX0saC5wcm90b3R5cGUuX2VudGVyPWZ1bmN0aW9uKGUsbil7dmFyIGk9dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWTtyZXR1cm4gbj1ufHx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpKSxufHwobj1uZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsdGhpcy5fZ2V0RGVsZWdhdGVDb25maWcoKSksdChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSxuKSksZSYmKG4uX2FjdGl2ZVRyaWdnZXJbXCJmb2N1c2luXCI9PT1lLnR5cGU/VC5GT0NVUzpULkhPVkVSXT0hMCksdChuLmdldFRpcEVsZW1lbnQoKSkuaGFzQ2xhc3MobS5TSE9XKXx8bi5faG92ZXJTdGF0ZT09PWcuU0hPVz92b2lkKG4uX2hvdmVyU3RhdGU9Zy5TSE9XKTooY2xlYXJUaW1lb3V0KG4uX3RpbWVvdXQpLG4uX2hvdmVyU3RhdGU9Zy5TSE9XLG4uY29uZmlnLmRlbGF5JiZuLmNvbmZpZy5kZWxheS5zaG93P3ZvaWQobi5fdGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZT09PWcuU0hPVyYmbi5zaG93KCl9LG4uY29uZmlnLmRlbGF5LnNob3cpKTp2b2lkIG4uc2hvdygpKX0saC5wcm90b3R5cGUuX2xlYXZlPWZ1bmN0aW9uKGUsbil7dmFyIGk9dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWTtpZihuPW58fHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGkpLG58fChuPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpLG4pKSxlJiYobi5fYWN0aXZlVHJpZ2dlcltcImZvY3Vzb3V0XCI9PT1lLnR5cGU/VC5GT0NVUzpULkhPVkVSXT0hMSksIW4uX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKSlyZXR1cm4gY2xlYXJUaW1lb3V0KG4uX3RpbWVvdXQpLG4uX2hvdmVyU3RhdGU9Zy5PVVQsbi5jb25maWcuZGVsYXkmJm4uY29uZmlnLmRlbGF5LmhpZGU/dm9pZChuLl90aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlPT09Zy5PVVQmJm4uaGlkZSgpfSxuLmNvbmZpZy5kZWxheS5oaWRlKSk6dm9pZCBuLmhpZGUoKX0saC5wcm90b3R5cGUuX2lzV2l0aEFjdGl2ZVRyaWdnZXI9ZnVuY3Rpb24oKXtmb3IodmFyIHQgaW4gdGhpcy5fYWN0aXZlVHJpZ2dlcilpZih0aGlzLl9hY3RpdmVUcmlnZ2VyW3RdKXJldHVybiEwO3JldHVybiExfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCx0KHRoaXMuZWxlbWVudCkuZGF0YSgpLG4pLG4uZGVsYXkmJlwibnVtYmVyXCI9PXR5cGVvZiBuLmRlbGF5JiYobi5kZWxheT17c2hvdzpuLmRlbGF5LGhpZGU6bi5kZWxheX0pLHIudHlwZUNoZWNrQ29uZmlnKGUsbix0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlKSxufSxoLnByb3RvdHlwZS5fZ2V0RGVsZWdhdGVDb25maWc9ZnVuY3Rpb24oKXt2YXIgdD17fTtpZih0aGlzLmNvbmZpZylmb3IodmFyIGUgaW4gdGhpcy5jb25maWcpdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0W2VdIT09dGhpcy5jb25maWdbZV0mJih0W2VdPXRoaXMuY29uZmlnW2VdKTtyZXR1cm4gdH0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLmRhdGEoYSksbz1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmU7aWYoKG58fCEvZGlzcG9zZXxoaWRlLy50ZXN0KGUpKSYmKG58fChuPW5ldyBoKHRoaXMsbyksdCh0aGlzKS5kYXRhKGEsbikpLFwic3RyaW5nXCI9PXR5cGVvZiBlKSl7aWYodm9pZCAwPT09bltlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtuW2VdKCl9fSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZH19LHtrZXk6XCJOQU1FXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGV9fSx7a2V5OlwiREFUQV9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYX19LHtrZXk6XCJFdmVudFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBwfX0se2tleTpcIkVWRU5UX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBsfX0se2tleTpcIkRlZmF1bHRUeXBlXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ9fV0pLGh9KCk7cmV0dXJuIHQuZm5bZV09SS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9SSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLEkuX2pRdWVyeUludGVyZmFjZX0sSX0oalF1ZXJ5KSk7KGZ1bmN0aW9uKHIpe3ZhciBhPVwicG9wb3ZlclwiLGw9XCI0LjAuMC1hbHBoYS42XCIsaD1cImJzLnBvcG92ZXJcIixjPVwiLlwiK2gsdT1yLmZuW2FdLGQ9ci5leHRlbmQoe30scy5EZWZhdWx0LHtwbGFjZW1lbnQ6XCJyaWdodFwiLHRyaWdnZXI6XCJjbGlja1wiLGNvbnRlbnQ6XCJcIix0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nfSksZj1yLmV4dGVuZCh7fSxzLkRlZmF1bHRUeXBlLHtjb250ZW50OlwiKHN0cmluZ3xlbGVtZW50fGZ1bmN0aW9uKVwifSksXz17RkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxnPXtUSVRMRTpcIi5wb3BvdmVyLXRpdGxlXCIsQ09OVEVOVDpcIi5wb3BvdmVyLWNvbnRlbnRcIn0scD17SElERTpcImhpZGVcIitjLEhJRERFTjpcImhpZGRlblwiK2MsU0hPVzpcInNob3dcIitjLFNIT1dOOlwic2hvd25cIitjLElOU0VSVEVEOlwiaW5zZXJ0ZWRcIitjLENMSUNLOlwiY2xpY2tcIitjLEZPQ1VTSU46XCJmb2N1c2luXCIrYyxGT0NVU09VVDpcImZvY3Vzb3V0XCIrYyxNT1VTRUVOVEVSOlwibW91c2VlbnRlclwiK2MsTU9VU0VMRUFWRTpcIm1vdXNlbGVhdmVcIitjfSxtPWZ1bmN0aW9uKHMpe2Z1bmN0aW9uIHUoKXtyZXR1cm4gbih0aGlzLHUpLHQodGhpcyxzLmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9cmV0dXJuIGUodSxzKSx1LnByb3RvdHlwZS5pc1dpdGhDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VGl0bGUoKXx8dGhpcy5fZ2V0Q29udGVudCgpfSx1LnByb3RvdHlwZS5nZXRUaXBFbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlwPXRoaXMudGlwfHxyKHRoaXMuY29uZmlnLnRlbXBsYXRlKVswXX0sdS5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciB0PXIodGhpcy5nZXRUaXBFbGVtZW50KCkpO3RoaXMuc2V0RWxlbWVudENvbnRlbnQodC5maW5kKGcuVElUTEUpLHRoaXMuZ2V0VGl0bGUoKSksdGhpcy5zZXRFbGVtZW50Q29udGVudCh0LmZpbmQoZy5DT05URU5UKSx0aGlzLl9nZXRDb250ZW50KCkpLHQucmVtb3ZlQ2xhc3MoXy5GQURFK1wiIFwiK18uU0hPVyksdGhpcy5jbGVhbnVwVGV0aGVyKCl9LHUucHJvdG90eXBlLl9nZXRDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbnRlbnRcIil8fChcImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy5jb250ZW50P3RoaXMuY29uZmlnLmNvbnRlbnQuY2FsbCh0aGlzLmVsZW1lbnQpOnRoaXMuY29uZmlnLmNvbnRlbnQpfSx1Ll9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPXIodGhpcykuZGF0YShoKSxuPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjppKHQpKT90Om51bGw7aWYoKGV8fCEvZGVzdHJveXxoaWRlLy50ZXN0KHQpKSYmKGV8fChlPW5ldyB1KHRoaXMsbikscih0aGlzKS5kYXRhKGgsZSkpLFwic3RyaW5nXCI9PXR5cGVvZiB0KSl7aWYodm9pZCAwPT09ZVt0XSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrdCsnXCInKTtlW3RdKCl9fSl9LG8odSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBsfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZH19LHtrZXk6XCJOQU1FXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGF9fSx7a2V5OlwiREFUQV9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaH19LHtrZXk6XCJFdmVudFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBwfX0se2tleTpcIkVWRU5UX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBjfX0se2tleTpcIkRlZmF1bHRUeXBlXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ9fV0pLHV9KHMpO3JldHVybiByLmZuW2FdPW0uX2pRdWVyeUludGVyZmFjZSxyLmZuW2FdLkNvbnN0cnVjdG9yPW0sci5mblthXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHIuZm5bYV09dSxtLl9qUXVlcnlJbnRlcmZhY2V9LG19KShqUXVlcnkpfSgpOyIsIi8qXHJcbiogU2V0IHZhbHVlIG9uIGEgZmllbGQgb25mb2N1cyBldmVudCBpZiBmaWVsZCB2YWx1ZSBpcyBlbXB0eVxyXG4qXHJcbiogQHBhcmFtIE9iamVjdCBlbGVtZW50IFRoZSBmaWVsZFxyXG4qIEBwYXJhbSBzdHJpbmcgdmFsdWUgICBUaGUgdmFsdWUgXHJcbiovXHJcbmZ1bmN0aW9uIHNldEZvY3VzVmFsdWUoZWxlbWVudCwgdmFsdWUpe1xyXG4gICAgaWYoISQoZWxlbWVudCkudmFsKCkpXHJcbiAgICB7XHJcbiAgICAgICAgJChlbGVtZW50KS52YWwodmFsdWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4qIENvbGxhcHNlcyBhY2NvcmRpb24ocykgXHJcbipcclxuKiBAcGFyYW0gZWxlbWVudCAgICBhY2NvcmRpb24gICBUaGUgYWNjb3JkaW9uIGVsZW1lbnRcclxuKiBAcGFyYW0gc3RyaW5nICAgICBhY3Rpb24gICAgICBUaGUgYWN0aW9uXHJcbiovXHJcbmZ1bmN0aW9uIGNvbGxhcHNlQWxsKGFjY29yZGlvbiwgYWN0aW9uKVxyXG57XHJcbiAgICAkKGFjY29yZGlvbikuY29sbGFwc2UoYWN0aW9uKTtcclxufVxyXG5cclxuLy8gQ2hlY2tzIGFsbCB0aGUgY2hlY2tib3hlcyBjaGlsZHJlbiB3aG8gaGF2ZSB0aGUgLmNoZWNrQWxsIGVsZW1lbnQgaWRcclxuJCgnLmNoZWNrQWxsJykuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgIC8vIGdldCB0aGUgaWRcclxuICAgIHZhciBpZCA9ICQodGhpcykuYXR0cignaWQnKTtcclxuXHJcbiAgICAvLyBjaGVjayBhbGwgdGhlIGNoZWNrYm94ZXMgd2hvIGhhdmUgdGhlIHBhcmVudCBpZCBhcyBjbGFzc1xyXG4gICAgJCgnLicgKyBpZCkucHJvcCgnY2hlY2tlZCcsIHRoaXMuY2hlY2tlZCk7XHJcbn0pXHJcblxyXG4vKlxyXG4qICAgRW5hYmxlcy9kaXNhYmxlcyBpbmxpbmUgZWRpdGluZ1xyXG4qL1xyXG5mdW5jdGlvbiBlZGl0SW5saW5lRWRpdGFibGUoKXtcclxuICAgIC8vIGhpZGUvc2hvdyB0aGUgYWRkIGFuZCBlZGl0IGJ1dHRvbnMgYW5kIHNob3cvaGlkZSBlZGl0IGFjdGlvbiBidXR0b25zXHJcbiAgICAkKCcuSW5saW5lLWVkaXRhYmxlLS1lbmFibGUnKS50b2dnbGUoKTtcclxuICAgICQoJy5BZGQtbmV3LWlubGluZS1lZGl0YWJsZScpLnRvZ2dsZSgpO1xyXG4gICAgJCgnLkVkaXQtaW5saW5lLWFjdGlvbicpLnRvZ2dsZSgpO1xyXG5cclxuICAgIC8vIHNob3cvaGlkZSB0aGUgZWRpdGFibGUgaW5wdXRzXHJcbiAgICAkKCcuRWRpdGFibGUtY2hlY2stdGV4dCBpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgZnVuY3Rpb24oaSwgdikgeyByZXR1cm4gIXY7IH0pOztcclxufSIsIiQoJ3NlbGVjdCcpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSBcIm1vZGFsLXRyaWdnZXJcIikge1xyXG4gICAgICAgICQoJyNteU1vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgIH1cclxufSk7IiwiJCgnLkhhbWJ1cmdlcicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ09wZW4nKTtcclxuICAgICQoJy5TdWItaGVhZGVyX2JhcicpLnRvZ2dsZUNsYXNzKCdIYW1idXJnZXItb3BlbicpO1xyXG4gICAgY29uc29sZS5sb2coJ3RvZ2dsZWQnKVxyXG59KTsiLCIkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkgeyAgICBcclxuICAgIHZhciBzY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgaWYgKHNjcm9sbCA+PSA1MCkge1xyXG4gICAgICAgICQoXCIuU3ViLWhlYWRlcl9iYXJcIikuYWRkQ2xhc3MoXCJTdGlja3ktaGVhZGVyXCIpO1xyXG4gICAgICAgICQoXCIuSGVhZGVyX2JhclwiKS5hZGRDbGFzcyhcIk9ubHlcIik7XHJcbiAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJXLVN0aWNreS1uYXYtLWVuXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkKFwiLlN1Yi1oZWFkZXJfYmFyXCIpLnJlbW92ZUNsYXNzKFwiU3RpY2t5LWhlYWRlclwiKTtcclxuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikucmVtb3ZlQ2xhc3MoXCJPbmx5XCIpO1xyXG4gICAgICAgICQoXCJodG1sXCIpLnJlbW92ZUNsYXNzKFwiVy1TdGlja3ktbmF2LS1lblwiKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4kKCcuSGVhZGVyX2Jhcl9fYWxlcnQnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgJCgnLkhlYWRlcl9iYXJfX2FsZXJ0LS1ub3RpZmljYXRpb24nKS5oaWRlKCk7XHJcbn0pIiwiLypcclxuKiBBZGRzIGEgbWFya2VyIG9uIHRoZSBtYXBcclxuKlxyXG4qIEBwYXJhbSBNYXBcdG1hcFx0XHRcdFx0VGhlIG1hcCB3aGVyZSB0byBhZGQgdGhlIG1hcmtlclxyXG4qIEBwYXJhbSBmbG9hdCAgbGF0ICAgICBcdFx0VGhlIHBsYWNlIGxhdGl0dWRlIFxyXG4qIEBwYXJhbSBmbG9hdCAgbG9uZyAgICBcdFx0VGhlIHBsYWNlIGxvbmdpdHVkZVxyXG4qIEBwYXJhbSBzdHJpbmcgY29udGVudFN0cmluZ1x0VGhlIHdpbmRvdyBpbmZvIGNvbnRlbnRcclxuKiBAcGFyYW0gc3RyaW5nIHR5cGUgICAgXHRcdFRoZSBwaW4gdHlwZS4gQXZhaWxhYmxlIHBpbnM6IFtyZWQsYW1iZXIsZ3JlZW5dXHJcbiogQHBhcmFtIHN0cmluZyBsYWJlbCAgIFx0XHRUaGUgcGluIGxhYmVsLiBBdmFpbGFibGUgbGFiZWw6IFtjeWNsb25lLGNvbmZsaWN0LGVhcnRocXVha2UsdHN1bmFtaSxzdG9ybSx2b2xjYW5vLHRvcm5hZG8saW5zZWN0LWluZmVzdGF0aW9uLGRhbmdlcm91cy1hcmVhXVxyXG4qIEByZXR1cm4ge051bWJlcn0gc3VtXHJcbiovXHJcbmZ1bmN0aW9uIGFkZE1hcmtlcihtYXAsIGxhdCwgbG9uZywgY29udGVudFN0cmluZywgdHlwZSAsIGxhYmVsID0gbnVsbClcclxue1xyXG5cdHZhciBtYXJrZXIgPSBuZXcgTWFya2VyKHtcclxuXHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG9uZyksXHJcblx0XHRtYXA6IG1hcCxcclxuXHRcdGljb246ICdpbWcvbWFya2Vycy8nICsgdHlwZSArICcuc3ZnJyxcclxuXHRcdG1hcF9pY29uX2xhYmVsOiAobGFiZWwgIT09IG51bGwpID8gJzxpIGNsYXNzPVwibWFwLWljb24gSWNvbi0tJyArIGxhYmVsICsgJyBJY29uLS1zbVwiPjwvaT4nIDogJydcclxuXHR9KTtcclxuIFx0XHJcblx0dmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcsXHJcblx0XHRcdG1heFdpZHRoOiA0ODBcclxuXHR9KTtcclxuXHJcblx0bWFya2VyLmFkZExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0aW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcclxuXHR9KTtcclxufSIsIiQoJy5JdGVtX19zZWxlY3RhYmxlJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnU2VsZWN0ZWQnKTtcclxufSk7IiwiJChcIi5SaWJib25fX2hlYWRlcl9fY2hldnJvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIC8vUmVzZXQgYWxsIGFjdGl2ZSBjbGFzc2VzXHJcbiAgICBpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggXCJBY3RpdmVcIiApICkge1xyXG4gICAgICAgICQoXCIuUmliYm9uX19oZWFkZXJfX3dyYXAsIC5SaWJib25fX3Jlc3BvbnNlLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikucmVtb3ZlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICAkKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19yZXNwb25zZSwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlVXAoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgQWN0aXZlIHRvIFJpYmJvbiBIZWFkZXIgV3JhcFxyXG4gICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkubmV4dChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5cclxuJChcIi5idG4tY29udGludWVcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAvL1Jlc2V0IGFsbCBhY3RpdmUgY2xhc3Nlc1xyXG4gICAgICAgICQoXCIuUmliYm9uX19oZWFkZXJfX3dyYXAsIC5SaWJib25fX3Jlc3BvbnNlLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikucmVtb3ZlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xyXG5cclxuICAgICAgICAvL0FkZCBBY3RpdmUgdG8gbmV4dCByaWJib25cclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoKS5uZXh0KFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlRG93bigpO1xyXG59KTtcclxuXHJcbi8vIEludmVyc2VzIGFycm93IG9uIGFjY29yZGlvbiBleHBhbnNpb25cclxuJCgnLmNvbGxhcHNlJykub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWYoISQoZS50YXJnZXQpLmhhc0NsYXNzKCdwcmV2ZW50X3BhcmVudF9jb2xsYXBzZScpKXsgLy8gcHJldmVudHMgdGhlIHRyaWdlcnJpbmcgdGhlIGNvbGxhcHNlIGV2ZW50IGZvciBwYXJlbnRcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZChcIi5mYS1jYXJldC1kb3duXCIpLnJlbW92ZUNsYXNzKFwiZmEtY2FyZXQtZG93blwiKS5hZGRDbGFzcyhcImZhLWNhcmV0LXVwXCIpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuSGlkZS1hbGwnKS5zaG93KCk7XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoJy5TaG93LWFsbCcpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KS5vbignaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWYoISQoZS50YXJnZXQpLmhhc0NsYXNzKCdwcmV2ZW50X3BhcmVudF9jb2xsYXBzZScpKXsgLy8gcHJldmVudHMgdGhlIHRyaWdlcnJpbmcgdGhlIGNvbGxhcHNlIGV2ZW50IGZvciBwYXJlbnRcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZChcIi5mYS1jYXJldC11cFwiKS5yZW1vdmVDbGFzcyhcImZhLWNhcmV0LXVwXCIpLmFkZENsYXNzKFwiZmEtY2FyZXQtZG93blwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLkhpZGUtYWxsJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuU2hvdy1hbGwnKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG59KTsiXX0=
