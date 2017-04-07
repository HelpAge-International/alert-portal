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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1hZG1pbi5qcyIsImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImZvcm1zLmpzIiwiaW5pdGlhbF9fZHJvcGRvd24tbW9kYWwtdHJpZ2dlci5qcyIsImluaXRpYWxfX2hhbWJ1cmdlci5qcyIsImluaXRpYWxfX3N0aWNreS1uYXYuanMiLCJtYXAuanMiLCJyZXNwb25zZS1wbGFuX19tdWx0aS1zZWxlY3QuanMiLCJyZXNwb25zZS1wbGFuX19yZXZlYWwtcmliYm9uLmpzIl0sIm5hbWVzIjpbImNvdW50cnlfcmVtb3ZlZCIsImNvdW50cmllcyIsIiQiLCJsZW5ndGgiLCJoaWRlIiwic2hvdyIsImdwYUFjdGlvbkNoYW5nZWQiLCJlbGVtZW50IiwiYWRkQWN0aW9uQnV0dG9uIiwiY2hlY2tlZCIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiZmluZCIsImkiLCJlYWNoIiwiYWRkQ2xhc3MiLCJhZGREZXBhcnRtZW50TW9kYWwiLCJzZWxlY3QiLCJtb2RhbF9pZCIsImhhc0NsYXNzIiwibW9kYWwiLCJyZWFkVVJMIiwiaW5wdXQiLCJmaWxlcyIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiY3NzIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzRGF0YVVSTCIsImNoYW5nZSIsInRoaXMiLCJjbGljayIsInByZXZlbnREZWZhdWx0IiwidHJpZ2dlciIsImpRdWVyeSIsIkVycm9yIiwidCIsImZuIiwianF1ZXJ5Iiwic3BsaXQiLCJSZWZlcmVuY2VFcnJvciIsIl90eXBlb2YiLCJUeXBlRXJyb3IiLCJwcm90b3R5cGUiLCJPYmplY3QiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInZhbHVlIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJuIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvIiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJyIiwidG9TdHJpbmciLCJjYWxsIiwibWF0Y2giLCJ0b0xvd2VyQ2FzZSIsIm5vZGVUeXBlIiwiYmluZFR5cGUiLCJhIiwiZW5kIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aW5kb3ciLCJRVW5pdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImgiLCJzdHlsZSIsIm9uZSIsImMiLCJUUkFOU0lUSU9OX0VORCIsInNldFRpbWVvdXQiLCJ0cmlnZ2VyVHJhbnNpdGlvbkVuZCIsInMiLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsInN1cHBvcnRzVHJhbnNpdGlvbkVuZCIsImV2ZW50Iiwic3BlY2lhbCIsImwiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIk9UcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsImdldFVJRCIsIk1hdGgiLCJyYW5kb20iLCJnZXRFbGVtZW50QnlJZCIsImdldFNlbGVjdG9yRnJvbUVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJ0ZXN0IiwicmVmbG93Iiwib2Zmc2V0SGVpZ2h0IiwiQm9vbGVhbiIsInR5cGVDaGVja0NvbmZpZyIsImhhc093blByb3BlcnR5IiwiUmVnRXhwIiwidG9VcHBlckNhc2UiLCJ1IiwiRElTTUlTUyIsImQiLCJDTE9TRSIsIkNMT1NFRCIsIkNMSUNLX0RBVEFfQVBJIiwiZiIsIkFMRVJUIiwiRkFERSIsIlNIT1ciLCJfIiwiX2VsZW1lbnQiLCJjbG9zZSIsIl9nZXRSb290RWxlbWVudCIsIl90cmlnZ2VyQ2xvc2VFdmVudCIsImlzRGVmYXVsdFByZXZlbnRlZCIsIl9yZW1vdmVFbGVtZW50IiwiZGlzcG9zZSIsInJlbW92ZURhdGEiLCJjbG9zZXN0IiwiRXZlbnQiLCJfZGVzdHJveUVsZW1lbnQiLCJkZXRhY2giLCJyZW1vdmUiLCJfalF1ZXJ5SW50ZXJmYWNlIiwiZGF0YSIsIl9oYW5kbGVEaXNtaXNzIiwiZ2V0Iiwib24iLCJDb25zdHJ1Y3RvciIsIm5vQ29uZmxpY3QiLCJBQ1RJVkUiLCJCVVRUT04iLCJGT0NVUyIsIkRBVEFfVE9HR0xFX0NBUlJPVCIsIkRBVEFfVE9HR0xFIiwiSU5QVVQiLCJGT0NVU19CTFVSX0RBVEFfQVBJIiwidG9nZ2xlIiwidHlwZSIsImZvY3VzIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlQ2xhc3MiLCJpbnRlcnZhbCIsImtleWJvYXJkIiwic2xpZGUiLCJwYXVzZSIsIndyYXAiLCJnIiwicCIsIk5FWFQiLCJQUkVWIiwiTEVGVCIsIlJJR0hUIiwibSIsIlNMSURFIiwiU0xJRCIsIktFWURPV04iLCJNT1VTRUVOVEVSIiwiTU9VU0VMRUFWRSIsIkxPQURfREFUQV9BUEkiLCJFIiwiQ0FST1VTRUwiLCJJVEVNIiwidiIsIkFDVElWRV9JVEVNIiwiTkVYVF9QUkVWIiwiSU5ESUNBVE9SUyIsIkRBVEFfU0xJREUiLCJEQVRBX1JJREUiLCJUIiwiX2l0ZW1zIiwiX2ludGVydmFsIiwiX2FjdGl2ZUVsZW1lbnQiLCJfaXNQYXVzZWQiLCJfaXNTbGlkaW5nIiwiX2NvbmZpZyIsIl9nZXRDb25maWciLCJfaW5kaWNhdG9yc0VsZW1lbnQiLCJfYWRkRXZlbnRMaXN0ZW5lcnMiLCJuZXh0IiwiX3NsaWRlIiwibmV4dFdoZW5WaXNpYmxlIiwiaGlkZGVuIiwicHJldiIsIlBSRVZJT1VTIiwiY3ljbGUiLCJjbGVhckludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJ2aXNpYmlsaXR5U3RhdGUiLCJiaW5kIiwidG8iLCJfZ2V0SXRlbUluZGV4Iiwib2ZmIiwiZXh0ZW5kIiwiX2tleWRvd24iLCJkb2N1bWVudEVsZW1lbnQiLCJ0YWdOYW1lIiwid2hpY2giLCJtYWtlQXJyYXkiLCJpbmRleE9mIiwiX2dldEl0ZW1CeURpcmVjdGlvbiIsIl90cmlnZ2VyU2xpZGVFdmVudCIsInJlbGF0ZWRUYXJnZXQiLCJkaXJlY3Rpb24iLCJfc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudCIsImNoaWxkcmVuIiwiX2RhdGFBcGlDbGlja0hhbmRsZXIiLCJTSE9XTiIsIkhJREUiLCJISURERU4iLCJDT0xMQVBTRSIsIkNPTExBUFNJTkciLCJDT0xMQVBTRUQiLCJXSURUSCIsIkhFSUdIVCIsIkFDVElWRVMiLCJfaXNUcmFuc2l0aW9uaW5nIiwiX3RyaWdnZXJBcnJheSIsImlkIiwiX3BhcmVudCIsIl9nZXRQYXJlbnQiLCJfYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzIiwiX2dldERpbWVuc2lvbiIsImF0dHIiLCJzZXRUcmFuc2l0aW9uaW5nIiwic2xpY2UiLCJfZ2V0VGFyZ2V0RnJvbUVsZW1lbnQiLCJDTElDSyIsIkZPQ1VTSU5fREFUQV9BUEkiLCJLRVlET1dOX0RBVEFfQVBJIiwiQkFDS0RST1AiLCJESVNBQkxFRCIsIkZPUk1fQ0hJTEQiLCJST0xFX01FTlUiLCJST0xFX0xJU1RCT1giLCJOQVZCQVJfTkFWIiwiVklTSUJMRV9JVEVNUyIsImRpc2FibGVkIiwiX2dldFBhcmVudEZyb21FbGVtZW50IiwiX2NsZWFyTWVudXMiLCJjbGFzc05hbWUiLCJpbnNlcnRCZWZvcmUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjb250YWlucyIsIl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJiYWNrZHJvcCIsIkZPQ1VTSU4iLCJSRVNJWkUiLCJDTElDS19ESVNNSVNTIiwiS0VZRE9XTl9ESVNNSVNTIiwiTU9VU0VVUF9ESVNNSVNTIiwiTU9VU0VET1dOX0RJU01JU1MiLCJTQ1JPTExCQVJfTUVBU1VSRVIiLCJPUEVOIiwiRElBTE9HIiwiREFUQV9ESVNNSVNTIiwiRklYRURfQ09OVEVOVCIsIl9kaWFsb2ciLCJfYmFja2Ryb3AiLCJfaXNTaG93biIsIl9pc0JvZHlPdmVyZmxvd2luZyIsIl9pZ25vcmVCYWNrZHJvcENsaWNrIiwiX29yaWdpbmFsQm9keVBhZGRpbmciLCJfc2Nyb2xsYmFyV2lkdGgiLCJfY2hlY2tTY3JvbGxiYXIiLCJfc2V0U2Nyb2xsYmFyIiwiYm9keSIsIl9zZXRFc2NhcGVFdmVudCIsIl9zZXRSZXNpemVFdmVudCIsIl9zaG93QmFja2Ryb3AiLCJfc2hvd0VsZW1lbnQiLCJfaGlkZU1vZGFsIiwiTm9kZSIsIkVMRU1FTlRfTk9ERSIsImFwcGVuZENoaWxkIiwiZGlzcGxheSIsInJlbW92ZUF0dHJpYnV0ZSIsInNjcm9sbFRvcCIsIl9lbmZvcmNlRm9jdXMiLCJoYXMiLCJfaGFuZGxlVXBkYXRlIiwiX3Jlc2V0QWRqdXN0bWVudHMiLCJfcmVzZXRTY3JvbGxiYXIiLCJfcmVtb3ZlQmFja2Ryb3AiLCJhcHBlbmRUbyIsImN1cnJlbnRUYXJnZXQiLCJfYWRqdXN0RGlhbG9nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJjbGllbnRXaWR0aCIsImlubmVyV2lkdGgiLCJfZ2V0U2Nyb2xsYmFyV2lkdGgiLCJwYXJzZUludCIsIm9mZnNldFdpZHRoIiwiRGVmYXVsdCIsIm9mZnNldCIsIm1ldGhvZCIsIkFDVElWQVRFIiwiU0NST0xMIiwiRFJPUERPV05fSVRFTSIsIkRST1BET1dOX01FTlUiLCJOQVZfTElOSyIsIk5BViIsIkRBVEFfU1BZIiwiTElTVF9JVEVNIiwiTEkiLCJMSV9EUk9QRE9XTiIsIk5BVl9MSU5LUyIsIkRST1BET1dOIiwiRFJPUERPV05fSVRFTVMiLCJEUk9QRE9XTl9UT0dHTEUiLCJPRkZTRVQiLCJQT1NJVElPTiIsIl9zY3JvbGxFbGVtZW50IiwiX3NlbGVjdG9yIiwiX29mZnNldHMiLCJfdGFyZ2V0cyIsIl9hY3RpdmVUYXJnZXQiLCJfc2Nyb2xsSGVpZ2h0IiwiX3Byb2Nlc3MiLCJyZWZyZXNoIiwiX2dldFNjcm9sbFRvcCIsIl9nZXRTY3JvbGxIZWlnaHQiLCJtYXAiLCJ0b3AiLCJmaWx0ZXIiLCJzb3J0IiwiZm9yRWFjaCIsInB1c2giLCJwYWdlWU9mZnNldCIsIm1heCIsIl9nZXRPZmZzZXRIZWlnaHQiLCJpbm5lckhlaWdodCIsIl9hY3RpdmF0ZSIsIl9jbGVhciIsImpvaW4iLCJwYXJlbnRzIiwiQSIsIkxJU1QiLCJGQURFX0NISUxEIiwiQUNUSVZFX0NISUxEIiwiRFJPUERPV05fQUNUSVZFX0NISUxEIiwiX3RyYW5zaXRpb25Db21wbGV0ZSIsIlRldGhlciIsImFuaW1hdGlvbiIsInRlbXBsYXRlIiwidGl0bGUiLCJkZWxheSIsImh0bWwiLCJzZWxlY3RvciIsInBsYWNlbWVudCIsImNvbnN0cmFpbnRzIiwiY29udGFpbmVyIiwiVE9QIiwiQk9UVE9NIiwiT1VUIiwiSU5TRVJURUQiLCJGT0NVU09VVCIsIlRPT0xUSVAiLCJUT09MVElQX0lOTkVSIiwiZW5hYmxlZCIsIkhPVkVSIiwiTUFOVUFMIiwiSSIsIl9pc0VuYWJsZWQiLCJfdGltZW91dCIsIl9ob3ZlclN0YXRlIiwiX2FjdGl2ZVRyaWdnZXIiLCJfdGV0aGVyIiwiY29uZmlnIiwidGlwIiwiX3NldExpc3RlbmVycyIsImVuYWJsZSIsImRpc2FibGUiLCJ0b2dnbGVFbmFibGVkIiwiREFUQV9LRVkiLCJfZ2V0RGVsZWdhdGVDb25maWciLCJfaXNXaXRoQWN0aXZlVHJpZ2dlciIsIl9lbnRlciIsIl9sZWF2ZSIsImdldFRpcEVsZW1lbnQiLCJjbGVhclRpbWVvdXQiLCJjbGVhbnVwVGV0aGVyIiwiRVZFTlRfS0VZIiwiaXNXaXRoQ29udGVudCIsIm93bmVyRG9jdW1lbnQiLCJOQU1FIiwic2V0Q29udGVudCIsIl9nZXRBdHRhY2htZW50IiwiYXR0YWNobWVudCIsImNsYXNzZXMiLCJjbGFzc1ByZWZpeCIsImFkZFRhcmdldENsYXNzZXMiLCJwb3NpdGlvbiIsIl9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiZ2V0VGl0bGUiLCJzZXRFbGVtZW50Q29udGVudCIsImVtcHR5IiwiYXBwZW5kIiwidGV4dCIsImRlc3Ryb3kiLCJfZml4VGl0bGUiLCJEZWZhdWx0VHlwZSIsImNvbnRlbnQiLCJUSVRMRSIsIkNPTlRFTlQiLCJfZ2V0Q29udGVudCIsInNldEZvY3VzVmFsdWUiLCJ2YWwiLCJjb2xsYXBzZUFsbCIsImFjY29yZGlvbiIsImFjdGlvbiIsImNvbGxhcHNlIiwicHJvcCIsImNvbnNvbGUiLCJsb2ciLCJzY3JvbGwiLCJhZGRNYXJrZXIiLCJsYXQiLCJsb25nIiwiY29udGVudFN0cmluZyIsImxhYmVsIiwidW5kZWZpbmVkIiwibWFya2VyIiwiTWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIkxhdExuZyIsImljb24iLCJtYXBfaWNvbl9sYWJlbCIsImluZm93aW5kb3ciLCJJbmZvV2luZG93IiwibWF4V2lkdGgiLCJhZGRMaXN0ZW5lciIsIm9wZW4iLCJzbGlkZVVwIiwic2xpZGVUb2dnbGUiLCJzbGlkZURvd24iXSwibWFwcGluZ3MiOiI7O0FBQ0EsU0FBU0E7SUFFTCxJQUFJQyxZQUFZQyxFQUFFO0lBRWxCLElBQUdELFVBQVVFLFVBQVUsR0FDdkI7UUFFSUQsRUFBRSxpQkFBaUJFO1dBQ2xCO1FBQ0RGLEVBQUUsaUJBQWlCRzs7OztBQUszQixTQUFTQyxpQkFBa0JDO0lBQ3ZCLElBQUlDLGtCQUFrQk4sRUFBRTtJQUN4QixJQUFJSyxRQUFRRSxTQUFTO1FBRWpCRCxnQkFBZ0JFLFlBQVk7UUFHNUJSLEVBQUVLLFNBQVNJLFNBQVNBLFNBQVNDLEtBQUssMEJBQTBCUDtXQUN6RDtRQUVISCxFQUFFSyxTQUFTSSxTQUFTQSxTQUFTQyxLQUFLLDBCQUEwQlI7UUFHNUQsSUFBSVMsSUFBSTtRQUNSWCxFQUFFLGtDQUFrQ1ksS0FBSztZQUNyQ0Q7O1FBRUosSUFBSUEsSUFBSSxHQUFHO1lBQ1BMLGdCQUFnQk8sU0FBUzs7Ozs7QUFXckMsU0FBU0MsbUJBQW1CQyxRQUFRQztJQUNoQyxJQUFHaEIsRUFBRWUsUUFBUUwsS0FBSyxhQUFhTyxTQUFTLG1CQUN4QztRQUNJakIsRUFBRWdCLFVBQVVFLE1BQU07Ozs7OztBQy9DMUIsU0FBU0MsUUFBUUM7SUFDZixJQUFJQSxNQUFNQyxTQUFTRCxNQUFNQyxNQUFNLElBQUk7UUFDL0IsSUFBSUMsU0FBUyxJQUFJQztRQUVqQkQsT0FBT0UsU0FBUyxTQUFVQztZQUN0QnpCLEVBQUUsa0NBQWtDMEIsSUFBSSxvQkFBb0IsU0FBU0QsRUFB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LHNCQUFzQixTQUFTbEg7SUFDakMsS0FBSXpCLEVBQUV5QixFQUFFRSxRQUFRVixTQUFTLDRCQUEyQjtRQUNoRGpCLEVBQUUrQixNQUFNb0ssT0FBT3pMLEtBQUssZ0JBQWdCRixZQUFZLGVBQWVLLFNBQVM7UUFDeEViLEVBQUUrQixNQUFNb0ssT0FBT3pMLEtBQUssYUFBYVI7UUFDakNGLEVBQUUrQixNQUFNb0ssT0FBT3pMLEtBQUssYUFBYVA7Ozs7OztDVHZDN0MsU0FBQUgsR0FBQTRFLFFBQVM5RSxVQUFBQTtJQUVMO0dBS0lFLFFBQUU0RSxRQUFBRSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gV2hlbiBhIHJlbW92ZSBmaWVsZCBpcyBjbGlja2VkXHJcbmZ1bmN0aW9uIGNvdW50cnlfcmVtb3ZlZCgpXHJcbntcclxuICAgIHZhciBjb3VudHJpZXMgPSAkKCcjY291bnRyaWVzX3BhcmVudCBzZWxlY3QnKTtcclxuXHJcbiAgICBpZihjb3VudHJpZXMubGVuZ3RoIDw9IDEpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gaGlkZSB0aGUgcmVtb3ZlIGxpbmtzXHJcbiAgICAgICAgJCgnLnJlbW92ZV9maWVsZCcpLmhpZGUoKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgICQoJy5yZW1vdmVfZmllbGQnKS5zaG93KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdlbmVyaWMgcHJlcGFyZWRuZXNzIGFjdGlvbiBpdGVtXHJcbmZ1bmN0aW9uIGdwYUFjdGlvbkNoYW5nZWQoIGVsZW1lbnQgKSB7XHJcbiAgICB2YXIgYWRkQWN0aW9uQnV0dG9uID0gJChcIiNhZGQtYWN0aW9uLWJ0blwiKTtcclxuICAgIGlmIChlbGVtZW50LmNoZWNrZWQpIHtcclxuICAgICAgICAvLyBFbmFibGUgdGhlIGFkZCBhY3Rpb24gYnV0dG9uXHJcbiAgICAgICAgYWRkQWN0aW9uQnV0dG9uLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU2hvdyBkZXBhcnRtZW50IGRyb3Bkb3duXHJcbiAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiLmdwYV9hY3Rpb25fZGVwYXJ0bWVudFwiKS5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEhpZGUgZGVwYXJ0bWVudCBkcm9wZG93blxyXG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkuZmluZChcIi5ncGFfYWN0aW9uX2RlcGFydG1lbnRcIikuaGlkZSgpO1xyXG5cclxuICAgICAgICAvLyBEaXNhYmxlIHRoZSBhZGQgYWN0aW9uIGJ1dHRvbiBpZiB0aGVyZSBhcmUgbm8gY2hlY2tlZCBhY3Rpb25zXHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICQoXCJpbnB1dFtuYW1lPWdwYV9hY3Rpb25dOmNoZWNrZWRcIikuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChpIDwgMSkge1xyXG4gICAgICAgICAgICBhZGRBY3Rpb25CdXR0b24uYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKlxyXG4qIFZlcmlmeSBpZiB0aGUgQWRkIGRlcGFydG1lbnQgb3B0aW9uIGlzIHNlbGVjdGVkIGFuZCBvcGVuIHRoZSBtb2RhbCB3aW5kb3dcclxuKlxyXG4qIEBwYXJhbSBPYmplY3Qgc2VsZWN0ICAgICAgVGhlIHNlbGVjdCBPYmplY3RcclxuKiBAcGFyYW0gc3RyaW5nIG1vZGFsX2lkICAgIFRoZSBtb2RhbCBpZCB0byBvcGVuXHJcbiovXHJcbmZ1bmN0aW9uIGFkZERlcGFydG1lbnRNb2RhbChzZWxlY3QsIG1vZGFsX2lkKXtcclxuICAgIGlmKCQoc2VsZWN0KS5maW5kKFwiOnNlbGVjdGVkXCIpLmhhc0NsYXNzKCdhZGQtZGVwYXJ0bWVudCcpKVxyXG4gICAge1xyXG4gICAgICAgICQobW9kYWxfaWQpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcbn0iLCJmdW5jdGlvbiByZWFkVVJMKGlucHV0KSB7XHJcbiAgaWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzWzBdKSB7XHJcbiAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICBcclxuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBlLnRhcmdldC5yZXN1bHQgKyAnKScpO1xyXG4gICAgICAgICAgJCgnLkFnZW5jeS1kZXRhaWxzX19sb2dvX19wcmV2aWV3JykuYWRkQ2xhc3MoJ1NlbGVjdGVkJylcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xyXG4gIH1cclxufVxyXG5cclxuJChcIiNpbWdJbnBcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcbiAgcmVhZFVSTCh0aGlzKTtcclxuICAkKFwiI3NlbGVjdC1sb2dvXCIpLmhpZGUoKTtcclxuICAkKFwiI3JlcGxhY2UtbG9nb1wiKS5zaG93KCk7XHJcbiAgJChcIiNyZW1vdmUtbG9nb1wiKS5zaG93KCk7XHJcbn0pO1xyXG5cclxuJChcIiNzZWxlY3QtbG9nbywjcmVwbGFjZS1sb2dvXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG4gICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICQoXCIjaW1nSW5wXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbn0pO1xyXG5cclxuJChcIiNyZW1vdmUtbG9nb1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJChcIiNyZXBsYWNlLWxvZ29cIikuaGlkZSgpO1xyXG4gICAgJChcIiNyZW1vdmUtbG9nb1wiKS5oaWRlKCk7XHJcbiAgICAkKFwiI3NlbGVjdC1sb2dvXCIpLnNob3coKTtcclxuICAgICQoJy5BZ2VuY3ktZGV0YWlsc19fbG9nb19fcHJldmlldycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICdub25lJyk7XHJcbiAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5yZW1vdmVDbGFzcygnU2VsZWN0ZWQnKVxyXG59KTsiLCIvKiFcclxuICogQm9vdHN0cmFwIHY0LjAuMC1hbHBoYS42IChodHRwczovL2dldGJvb3RzdHJhcC5jb20pXHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTcgVGhlIEJvb3RzdHJhcCBBdXRob3JzIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvZ3JhcGhzL2NvbnRyaWJ1dG9ycylcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICovXHJcbmlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBqUXVlcnkpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkuIGpRdWVyeSBtdXN0IGJlIGluY2x1ZGVkIGJlZm9yZSBCb290c3RyYXAncyBKYXZhU2NyaXB0LlwiKTsrZnVuY3Rpb24odCl7dmFyIGU9dC5mbi5qcXVlcnkuc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiLlwiKTtpZihlWzBdPDImJmVbMV08OXx8MT09ZVswXSYmOT09ZVsxXSYmZVsyXTwxfHxlWzBdPj00KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgYXQgbGVhc3QgalF1ZXJ5IHYxLjkuMSBidXQgbGVzcyB0aGFuIHY0LjAuMFwiKX0oalF1ZXJ5KSwrZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFlfHxcIm9iamVjdFwiIT10eXBlb2YgZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT90OmV9ZnVuY3Rpb24gZSh0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBlKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LGUpOnQuX19wcm90b19fPWUpfWZ1bmN0aW9uIG4odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LG89ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKSxyPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7cmV0dXJue30udG9TdHJpbmcuY2FsbCh0KS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIG4odCl7cmV0dXJuKHRbMF18fHQpLm5vZGVUeXBlfWZ1bmN0aW9uIGkoKXtyZXR1cm57YmluZFR5cGU6YS5lbmQsZGVsZWdhdGVUeXBlOmEuZW5kLGhhbmRsZTpmdW5jdGlvbihlKXtpZih0KGUudGFyZ2V0KS5pcyh0aGlzKSlyZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fX1mdW5jdGlvbiBvKCl7aWYod2luZG93LlFVbml0KXJldHVybiExO3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib290c3RyYXBcIik7Zm9yKHZhciBlIGluIGgpaWYodm9pZCAwIT09dC5zdHlsZVtlXSlyZXR1cm57ZW5kOmhbZV19O3JldHVybiExfWZ1bmN0aW9uIHIoZSl7dmFyIG49dGhpcyxpPSExO3JldHVybiB0KHRoaXMpLm9uZShjLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKCl7aT0hMH0pLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpfHxjLnRyaWdnZXJUcmFuc2l0aW9uRW5kKG4pfSxlKSx0aGlzfWZ1bmN0aW9uIHMoKXthPW8oKSx0LmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kPXIsYy5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHQuZXZlbnQuc3BlY2lhbFtjLlRSQU5TSVRJT05fRU5EXT1pKCkpfXZhciBhPSExLGw9MWU2LGg9e1dlYmtpdFRyYW5zaXRpb246XCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCIsTW96VHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIixPVHJhbnNpdGlvbjpcIm9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kXCIsdHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIn0sYz17VFJBTlNJVElPTl9FTkQ6XCJic1RyYW5zaXRpb25FbmRcIixnZXRVSUQ6ZnVuY3Rpb24odCl7ZG8gdCs9fn4oTWF0aC5yYW5kb20oKSpsKTt3aGlsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0KSk7cmV0dXJuIHR9LGdldFNlbGVjdG9yRnJvbUVsZW1lbnQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhcmdldFwiKTtyZXR1cm4gZXx8KGU9dC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfHxcIlwiLGU9L14jW2Etel0vaS50ZXN0KGUpP2U6bnVsbCksZX0scmVmbG93OmZ1bmN0aW9uKHQpe3JldHVybiB0Lm9mZnNldEhlaWdodH0sdHJpZ2dlclRyYW5zaXRpb25FbmQ6ZnVuY3Rpb24oZSl7dChlKS50cmlnZ2VyKGEuZW5kKX0sc3VwcG9ydHNUcmFuc2l0aW9uRW5kOmZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4oYSl9LHR5cGVDaGVja0NvbmZpZzpmdW5jdGlvbih0LGksbyl7Zm9yKHZhciByIGluIG8paWYoby5oYXNPd25Qcm9wZXJ0eShyKSl7dmFyIHM9b1tyXSxhPWlbcl0sbD1hJiZuKGEpP1wiZWxlbWVudFwiOmUoYSk7aWYoIW5ldyBSZWdFeHAocykudGVzdChsKSl0aHJvdyBuZXcgRXJyb3IodC50b1VwcGVyQ2FzZSgpK1wiOiBcIisoJ09wdGlvbiBcIicrcisnXCIgcHJvdmlkZWQgdHlwZSBcIicrbCsnXCIgJykrKCdidXQgZXhwZWN0ZWQgdHlwZSBcIicrcysnXCIuJykpfX19O3JldHVybiBzKCksY30oalF1ZXJ5KSxzPShmdW5jdGlvbih0KXt2YXIgZT1cImFsZXJ0XCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMuYWxlcnRcIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTE1MCx1PXtESVNNSVNTOidbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nfSxkPXtDTE9TRTpcImNsb3NlXCIrYSxDTE9TRUQ6XCJjbG9zZWRcIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGY9e0FMRVJUOlwiYWxlcnRcIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKHQpe3Q9dHx8dGhpcy5fZWxlbWVudDt2YXIgZT10aGlzLl9nZXRSb290RWxlbWVudCh0KSxuPXRoaXMuX3RyaWdnZXJDbG9zZUV2ZW50KGUpO24uaXNEZWZhdWx0UHJldmVudGVkKCl8fHRoaXMuX3JlbW92ZUVsZW1lbnQoZSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxzKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9nZXRSb290RWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSksaT0hMTtyZXR1cm4gbiYmKGk9dChuKVswXSksaXx8KGk9dChlKS5jbG9zZXN0KFwiLlwiK2YuQUxFUlQpWzBdKSxpfSxlLnByb3RvdHlwZS5fdHJpZ2dlckNsb3NlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dC5FdmVudChkLkNMT1NFKTtyZXR1cm4gdChlKS50cmlnZ2VyKG4pLG59LGUucHJvdG90eXBlLl9yZW1vdmVFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7cmV0dXJuIHQoZSkucmVtb3ZlQ2xhc3MoZi5TSE9XKSxyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KGUpLmhhc0NsYXNzKGYuRkFERSk/dm9pZCB0KGUpLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKHQpe3JldHVybiBuLl9kZXN0cm95RWxlbWVudChlLHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYyk6dm9pZCB0aGlzLl9kZXN0cm95RWxlbWVudChlKX0sZS5wcm90b3R5cGUuX2Rlc3Ryb3lFbGVtZW50PWZ1bmN0aW9uKGUpe3QoZSkuZGV0YWNoKCkudHJpZ2dlcihkLkNMT1NFRCkucmVtb3ZlKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJjbG9zZVwiPT09biYmb1tuXSh0aGlzKX0pfSxlLl9oYW5kbGVEaXNtaXNzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXtlJiZlLnByZXZlbnREZWZhdWx0KCksdC5jbG9zZSh0aGlzKX19LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihkLkNMSUNLX0RBVEFfQVBJLHUuRElTTUlTUyxfLl9oYW5kbGVEaXNtaXNzKG5ldyBfKSksdC5mbltlXT1fLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1fLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsXy5falF1ZXJ5SW50ZXJmYWNlfSxffShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiYnV0dG9uXCIsaT1cIjQuMC4wLWFscGhhLjZcIixyPVwiYnMuYnV0dG9uXCIscz1cIi5cIityLGE9XCIuZGF0YS1hcGlcIixsPXQuZm5bZV0saD17QUNUSVZFOlwiYWN0aXZlXCIsQlVUVE9OOlwiYnRuXCIsRk9DVVM6XCJmb2N1c1wifSxjPXtEQVRBX1RPR0dMRV9DQVJST1Q6J1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJyxJTlBVVDpcImlucHV0XCIsQUNUSVZFOlwiLmFjdGl2ZVwiLEJVVFRPTjpcIi5idG5cIn0sdT17Q0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK3MrYSxGT0NVU19CTFVSX0RBVEFfQVBJOlwiZm9jdXNcIitzK2ErXCIgXCIrKFwiYmx1clwiK3MrYSl9LGQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3ZhciBlPSEwLG49dCh0aGlzLl9lbGVtZW50KS5jbG9zZXN0KGMuREFUQV9UT0dHTEUpWzBdO2lmKG4pe3ZhciBpPXQodGhpcy5fZWxlbWVudCkuZmluZChjLklOUFVUKVswXTtpZihpKXtpZihcInJhZGlvXCI9PT1pLnR5cGUpaWYoaS5jaGVja2VkJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSllPSExO2Vsc2V7dmFyIG89dChuKS5maW5kKGMuQUNUSVZFKVswXTtvJiZ0KG8pLnJlbW92ZUNsYXNzKGguQUNUSVZFKX1lJiYoaS5jaGVja2VkPSF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSx0KGkpLnRyaWdnZXIoXCJjaGFuZ2VcIikpLGkuZm9jdXMoKX19dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXByZXNzZWRcIiwhdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSkpLGUmJnQodGhpcy5fZWxlbWVudCkudG9nZ2xlQ2xhc3MoaC5BQ1RJVkUpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsciksdGhpcy5fZWxlbWVudD1udWxsfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShyKTtpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocixpKSksXCJ0b2dnbGVcIj09PW4mJmlbbl0oKX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxjLkRBVEFfVE9HR0xFX0NBUlJPVCxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIG49ZS50YXJnZXQ7dChuKS5oYXNDbGFzcyhoLkJVVFRPTil8fChuPXQobikuY2xvc2VzdChjLkJVVFRPTikpLGQuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJ0b2dnbGVcIil9KS5vbih1LkZPQ1VTX0JMVVJfREFUQV9BUEksYy5EQVRBX1RPR0dMRV9DQVJST1QsZnVuY3Rpb24oZSl7dmFyIG49dChlLnRhcmdldCkuY2xvc2VzdChjLkJVVFRPTilbMF07dChuKS50b2dnbGVDbGFzcyhoLkZPQ1VTLC9eZm9jdXMoaW4pPyQvLnRlc3QoZS50eXBlKSl9KSx0LmZuW2VdPWQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPWQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09bCxkLl9qUXVlcnlJbnRlcmZhY2V9LGR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjYXJvdXNlbFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNhcm91c2VsXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD0zNyxmPTM5LF89e2ludGVydmFsOjVlMyxrZXlib2FyZDohMCxzbGlkZTohMSxwYXVzZTpcImhvdmVyXCIsd3JhcDohMH0sZz17aW50ZXJ2YWw6XCIobnVtYmVyfGJvb2xlYW4pXCIsa2V5Ym9hcmQ6XCJib29sZWFuXCIsc2xpZGU6XCIoYm9vbGVhbnxzdHJpbmcpXCIscGF1c2U6XCIoc3RyaW5nfGJvb2xlYW4pXCIsd3JhcDpcImJvb2xlYW5cIn0scD17TkVYVDpcIm5leHRcIixQUkVWOlwicHJldlwiLExFRlQ6XCJsZWZ0XCIsUklHSFQ6XCJyaWdodFwifSxtPXtTTElERTpcInNsaWRlXCIrbCxTTElEOlwic2xpZFwiK2wsS0VZRE9XTjpcImtleWRvd25cIitsLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrbCxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2gsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sRT17Q0FST1VTRUw6XCJjYXJvdXNlbFwiLEFDVElWRTpcImFjdGl2ZVwiLFNMSURFOlwic2xpZGVcIixSSUdIVDpcImNhcm91c2VsLWl0ZW0tcmlnaHRcIixMRUZUOlwiY2Fyb3VzZWwtaXRlbS1sZWZ0XCIsTkVYVDpcImNhcm91c2VsLWl0ZW0tbmV4dFwiLFBSRVY6XCJjYXJvdXNlbC1pdGVtLXByZXZcIixJVEVNOlwiY2Fyb3VzZWwtaXRlbVwifSx2PXtBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0lURU06XCIuYWN0aXZlLmNhcm91c2VsLWl0ZW1cIixJVEVNOlwiLmNhcm91c2VsLWl0ZW1cIixORVhUX1BSRVY6XCIuY2Fyb3VzZWwtaXRlbS1uZXh0LCAuY2Fyb3VzZWwtaXRlbS1wcmV2XCIsSU5ESUNBVE9SUzpcIi5jYXJvdXNlbC1pbmRpY2F0b3JzXCIsREFUQV9TTElERTpcIltkYXRhLXNsaWRlXSwgW2RhdGEtc2xpZGUtdG9dXCIsREFUQV9SSURFOidbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nfSxUPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe24odGhpcyxoKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2ludGVydmFsPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2lzUGF1c2VkPSExLHRoaXMuX2lzU2xpZGluZz0hMSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX2VsZW1lbnQ9dChlKVswXSx0aGlzLl9pbmRpY2F0b3JzRWxlbWVudD10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5JTkRJQ0FUT1JTKVswXSx0aGlzLl9hZGRFdmVudExpc3RlbmVycygpfXJldHVybiBoLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7aWYodGhpcy5faXNTbGlkaW5nKXRocm93IG5ldyBFcnJvcihcIkNhcm91c2VsIGlzIHNsaWRpbmdcIik7dGhpcy5fc2xpZGUocC5ORVhUKX0saC5wcm90b3R5cGUubmV4dFdoZW5WaXNpYmxlPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuaGlkZGVufHx0aGlzLm5leHQoKX0saC5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe2lmKHRoaXMuX2lzU2xpZGluZyl0aHJvdyBuZXcgRXJyb3IoXCJDYXJvdXNlbCBpcyBzbGlkaW5nXCIpO3RoaXMuX3NsaWRlKHAuUFJFVklPVVMpfSxoLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihlKXtlfHwodGhpcy5faXNQYXVzZWQ9ITApLHQodGhpcy5fZWxlbWVudCkuZmluZCh2Lk5FWFRfUFJFVilbMF0mJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihyLnRyaWdnZXJUcmFuc2l0aW9uRW5kKHRoaXMuX2VsZW1lbnQpLHRoaXMuY3ljbGUoITApKSxjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsKSx0aGlzLl9pbnRlcnZhbD1udWxsfSxoLnByb3RvdHlwZS5jeWNsZT1mdW5jdGlvbih0KXt0fHwodGhpcy5faXNQYXVzZWQ9ITEpLHRoaXMuX2ludGVydmFsJiYoY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCksdGhpcy5faW50ZXJ2YWw9bnVsbCksdGhpcy5fY29uZmlnLmludGVydmFsJiYhdGhpcy5faXNQYXVzZWQmJih0aGlzLl9pbnRlcnZhbD1zZXRJbnRlcnZhbCgoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlP3RoaXMubmV4dFdoZW5WaXNpYmxlOnRoaXMubmV4dCkuYmluZCh0aGlzKSx0aGlzLl9jb25maWcuaW50ZXJ2YWwpKX0saC5wcm90b3R5cGUudG89ZnVuY3Rpb24oZSl7dmFyIG49dGhpczt0aGlzLl9hY3RpdmVFbGVtZW50PXQodGhpcy5fZWxlbWVudCkuZmluZCh2LkFDVElWRV9JVEVNKVswXTt2YXIgaT10aGlzLl9nZXRJdGVtSW5kZXgodGhpcy5fYWN0aXZlRWxlbWVudCk7aWYoIShlPnRoaXMuX2l0ZW1zLmxlbmd0aC0xfHxlPDApKXtpZih0aGlzLl9pc1NsaWRpbmcpcmV0dXJuIHZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUobS5TTElELGZ1bmN0aW9uKCl7cmV0dXJuIG4udG8oZSl9KTtpZihpPT09ZSlyZXR1cm4gdGhpcy5wYXVzZSgpLHZvaWQgdGhpcy5jeWNsZSgpO3ZhciBvPWU+aT9wLk5FWFQ6cC5QUkVWSU9VUzt0aGlzLl9zbGlkZShvLHRoaXMuX2l0ZW1zW2VdKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9mZihsKSx0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9pbnRlcnZhbD1udWxsLHRoaXMuX2lzUGF1c2VkPW51bGwsdGhpcy5faXNTbGlkaW5nPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2luZGljYXRvcnNFbGVtZW50PW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sXyxuKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZyksbn0saC5wcm90b3R5cGUuX2FkZEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9jb25maWcua2V5Ym9hcmQmJnQodGhpcy5fZWxlbWVudCkub24obS5LRVlET1dOLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9rZXlkb3duKHQpfSksXCJob3ZlclwiIT09dGhpcy5fY29uZmlnLnBhdXNlfHxcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50fHx0KHRoaXMuX2VsZW1lbnQpLm9uKG0uTU9VU0VFTlRFUixmdW5jdGlvbih0KXtyZXR1cm4gZS5wYXVzZSh0KX0pLm9uKG0uTU9VU0VMRUFWRSxmdW5jdGlvbih0KXtyZXR1cm4gZS5jeWNsZSh0KX0pfSxoLnByb3RvdHlwZS5fa2V5ZG93bj1mdW5jdGlvbih0KXtpZighL2lucHV0fHRleHRhcmVhL2kudGVzdCh0LnRhcmdldC50YWdOYW1lKSlzd2l0Y2godC53aGljaCl7Y2FzZSBkOnQucHJldmVudERlZmF1bHQoKSx0aGlzLnByZXYoKTticmVhaztjYXNlIGY6dC5wcmV2ZW50RGVmYXVsdCgpLHRoaXMubmV4dCgpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufX0saC5wcm90b3R5cGUuX2dldEl0ZW1JbmRleD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5faXRlbXM9dC5tYWtlQXJyYXkodChlKS5wYXJlbnQoKS5maW5kKHYuSVRFTSkpLHRoaXMuX2l0ZW1zLmluZGV4T2YoZSl9LGgucHJvdG90eXBlLl9nZXRJdGVtQnlEaXJlY3Rpb249ZnVuY3Rpb24odCxlKXt2YXIgbj10PT09cC5ORVhULGk9dD09PXAuUFJFVklPVVMsbz10aGlzLl9nZXRJdGVtSW5kZXgoZSkscj10aGlzLl9pdGVtcy5sZW5ndGgtMSxzPWkmJjA9PT1vfHxuJiZvPT09cjtpZihzJiYhdGhpcy5fY29uZmlnLndyYXApcmV0dXJuIGU7dmFyIGE9dD09PXAuUFJFVklPVVM/LTE6MSxsPShvK2EpJXRoaXMuX2l0ZW1zLmxlbmd0aDtyZXR1cm4gbD09PS0xP3RoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aC0xXTp0aGlzLl9pdGVtc1tsXX0saC5wcm90b3R5cGUuX3RyaWdnZXJTbGlkZUV2ZW50PWZ1bmN0aW9uKGUsbil7dmFyIGk9dC5FdmVudChtLlNMSURFLHtyZWxhdGVkVGFyZ2V0OmUsZGlyZWN0aW9uOm59KTtyZXR1cm4gdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLGl9LGgucHJvdG90eXBlLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50PWZ1bmN0aW9uKGUpe2lmKHRoaXMuX2luZGljYXRvcnNFbGVtZW50KXt0KHRoaXMuX2luZGljYXRvcnNFbGVtZW50KS5maW5kKHYuQUNUSVZFKS5yZW1vdmVDbGFzcyhFLkFDVElWRSk7dmFyIG49dGhpcy5faW5kaWNhdG9yc0VsZW1lbnQuY2hpbGRyZW5bdGhpcy5fZ2V0SXRlbUluZGV4KGUpXTtuJiZ0KG4pLmFkZENsYXNzKEUuQUNUSVZFKX19LGgucHJvdG90eXBlLl9zbGlkZT1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMsbz10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5BQ1RJVkVfSVRFTSlbMF0scz1ufHxvJiZ0aGlzLl9nZXRJdGVtQnlEaXJlY3Rpb24oZSxvKSxhPUJvb2xlYW4odGhpcy5faW50ZXJ2YWwpLGw9dm9pZCAwLGg9dm9pZCAwLGM9dm9pZCAwO2lmKGU9PT1wLk5FWFQ/KGw9RS5MRUZULGg9RS5ORVhULGM9cC5MRUZUKToobD1FLlJJR0hULGg9RS5QUkVWLGM9cC5SSUdIVCkscyYmdChzKS5oYXNDbGFzcyhFLkFDVElWRSkpcmV0dXJuIHZvaWQodGhpcy5faXNTbGlkaW5nPSExKTt2YXIgZD10aGlzLl90cmlnZ2VyU2xpZGVFdmVudChzLGMpO2lmKCFkLmlzRGVmYXVsdFByZXZlbnRlZCgpJiZvJiZzKXt0aGlzLl9pc1NsaWRpbmc9ITAsYSYmdGhpcy5wYXVzZSgpLHRoaXMuX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQocyk7dmFyIGY9dC5FdmVudChtLlNMSUQse3JlbGF0ZWRUYXJnZXQ6cyxkaXJlY3Rpb246Y30pO3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoRS5TTElERSk/KHQocykuYWRkQ2xhc3MoaCksci5yZWZsb3cocyksdChvKS5hZGRDbGFzcyhsKSx0KHMpLmFkZENsYXNzKGwpLHQobykub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24oKXt0KHMpLnJlbW92ZUNsYXNzKGwrXCIgXCIraCkuYWRkQ2xhc3MoRS5BQ1RJVkUpLHQobykucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUrXCIgXCIraCtcIiBcIitsKSxpLl9pc1NsaWRpbmc9ITEsc2V0VGltZW91dChmdW5jdGlvbigpe3JldHVybiB0KGkuX2VsZW1lbnQpLnRyaWdnZXIoZil9LDApfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSkpOih0KG8pLnJlbW92ZUNsYXNzKEUuQUNUSVZFKSx0KHMpLmFkZENsYXNzKEUuQUNUSVZFKSx0aGlzLl9pc1NsaWRpbmc9ITEsdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGYpKSxhJiZ0aGlzLmN5Y2xlKCl9fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPXQuZXh0ZW5kKHt9LF8sdCh0aGlzKS5kYXRhKCkpO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmdC5leHRlbmQobyxlKTt2YXIgcj1cInN0cmluZ1wiPT10eXBlb2YgZT9lOm8uc2xpZGU7aWYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJudW1iZXJcIj09dHlwZW9mIGUpbi50byhlKTtlbHNlIGlmKFwic3RyaW5nXCI9PXR5cGVvZiByKXtpZih2b2lkIDA9PT1uW3JdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytyKydcIicpO25bcl0oKX1lbHNlIG8uaW50ZXJ2YWwmJihuLnBhdXNlKCksbi5jeWNsZSgpKX0pfSxoLl9kYXRhQXBpQ2xpY2tIYW5kbGVyPWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKTtpZihuKXt2YXIgaT10KG4pWzBdO2lmKGkmJnQoaSkuaGFzQ2xhc3MoRS5DQVJPVVNFTCkpe3ZhciBvPXQuZXh0ZW5kKHt9LHQoaSkuZGF0YSgpLHQodGhpcykuZGF0YSgpKSxzPXRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b1wiKTtzJiYoby5pbnRlcnZhbD0hMSksaC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChpKSxvKSxzJiZ0KGkpLmRhdGEoYSkudG8ocyksZS5wcmV2ZW50RGVmYXVsdCgpfX19LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24obS5DTElDS19EQVRBX0FQSSx2LkRBVEFfU0xJREUsVC5fZGF0YUFwaUNsaWNrSGFuZGxlciksdCh3aW5kb3cpLm9uKG0uTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe3Qodi5EQVRBX1JJREUpLmVhY2goZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMpO1QuX2pRdWVyeUludGVyZmFjZS5jYWxsKGUsZS5kYXRhKCkpfSl9KSx0LmZuW2VdPVQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPVQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxULl9qUXVlcnlJbnRlcmZhY2V9LFR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjb2xsYXBzZVwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNvbGxhcHNlXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD17dG9nZ2xlOiEwLHBhcmVudDpcIlwifSxmPXt0b2dnbGU6XCJib29sZWFuXCIscGFyZW50Olwic3RyaW5nXCJ9LF89e1NIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxnPXtTSE9XOlwic2hvd1wiLENPTExBUFNFOlwiY29sbGFwc2VcIixDT0xMQVBTSU5HOlwiY29sbGFwc2luZ1wiLENPTExBUFNFRDpcImNvbGxhcHNlZFwifSxwPXtXSURUSDpcIndpZHRoXCIsSEVJR0hUOlwiaGVpZ2h0XCJ9LG09e0FDVElWRVM6XCIuY2FyZCA+IC5zaG93LCAuY2FyZCA+IC5jb2xsYXBzaW5nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJ30sRT1mdW5jdGlvbigpe2Z1bmN0aW9uIGwoZSxpKXtuKHRoaXMsbCksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3RyaWdnZXJBcnJheT10Lm1ha2VBcnJheSh0KCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycrZS5pZCsnXCJdLCcrKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnK2UuaWQrJ1wiXScpKSksdGhpcy5fcGFyZW50PXRoaXMuX2NvbmZpZy5wYXJlbnQ/dGhpcy5fZ2V0UGFyZW50KCk6bnVsbCx0aGlzLl9jb25maWcucGFyZW50fHx0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy5fZWxlbWVudCx0aGlzLl90cmlnZ2VyQXJyYXkpLHRoaXMuX2NvbmZpZy50b2dnbGUmJnRoaXMudG9nZ2xlKCl9cmV0dXJuIGwucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKT90aGlzLmhpZGUoKTp0aGlzLnNob3coKX0sbC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIkNvbGxhcHNlIGlzIHRyYW5zaXRpb25pbmdcIik7aWYoIXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuX3BhcmVudCYmKG49dC5tYWtlQXJyYXkodCh0aGlzLl9wYXJlbnQpLmZpbmQobS5BQ1RJVkVTKSksbi5sZW5ndGh8fChuPW51bGwpKSwhKG4mJihpPXQobikuZGF0YShhKSxpJiZpLl9pc1RyYW5zaXRpb25pbmcpKSl7dmFyIG89dC5FdmVudChfLlNIT1cpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihvKSwhby5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7biYmKGwuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJoaWRlXCIpLGl8fHQobikuZGF0YShhLG51bGwpKTt2YXIgcz10aGlzLl9nZXREaW1lbnNpb24oKTt0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0UpLmFkZENsYXNzKGcuQ09MTEFQU0lORyksdGhpcy5fZWxlbWVudC5zdHlsZVtzXT0wLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIGg9ZnVuY3Rpb24oKXt0KGUuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0lORykuYWRkQ2xhc3MoZy5DT0xMQVBTRSkuYWRkQ2xhc3MoZy5TSE9XKSxlLl9lbGVtZW50LnN0eWxlW3NdPVwiXCIsZS5zZXRUcmFuc2l0aW9uaW5nKCExKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIoXy5TSE9XTil9O2lmKCFyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpKXJldHVybiB2b2lkIGgoKTt2YXIgYz1zWzBdLnRvVXBwZXJDYXNlKCkrcy5zbGljZSgxKSxkPVwic2Nyb2xsXCIrYzt0KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELGgpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpLHRoaXMuX2VsZW1lbnQuc3R5bGVbc109dGhpcy5fZWxlbWVudFtkXStcInB4XCJ9fX19LGwucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJDb2xsYXBzZSBpcyB0cmFuc2l0aW9uaW5nXCIpO2lmKHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dC5FdmVudChfLkhJREUpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihuKSwhbi5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7dmFyIGk9dGhpcy5fZ2V0RGltZW5zaW9uKCksbz1pPT09cC5XSURUSD9cIm9mZnNldFdpZHRoXCI6XCJvZmZzZXRIZWlnaHRcIjt0aGlzLl9lbGVtZW50LnN0eWxlW2ldPXRoaXMuX2VsZW1lbnRbb10rXCJweFwiLHIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MoZy5DT0xMQVBTSU5HKS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFKS5yZW1vdmVDbGFzcyhnLlNIT1cpLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkuYWRkQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIHM9ZnVuY3Rpb24oKXtlLnNldFRyYW5zaXRpb25pbmcoITEpLHQoZS5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTSU5HKS5hZGRDbGFzcyhnLkNPTExBUFNFKS50cmlnZ2VyKF8uSElEREVOKX07cmV0dXJuIHRoaXMuX2VsZW1lbnQuc3R5bGVbaV09XCJcIixyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpP3ZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTp2b2lkIHMoKX19fSxsLnByb3RvdHlwZS5zZXRUcmFuc2l0aW9uaW5nPWZ1bmN0aW9uKHQpe3RoaXMuX2lzVHJhbnNpdGlvbmluZz10fSxsLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fcGFyZW50PW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX3RyaWdnZXJBcnJheT1udWxsLHRoaXMuX2lzVHJhbnNpdGlvbmluZz1udWxsfSxsLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LGQsbiksbi50b2dnbGU9Qm9vbGVhbihuLnRvZ2dsZSksci50eXBlQ2hlY2tDb25maWcoZSxuLGYpLG59LGwucHJvdG90eXBlLl9nZXREaW1lbnNpb249ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKHAuV0lEVEgpO3JldHVybiBlP3AuV0lEVEg6cC5IRUlHSFR9LGwucHJvdG90eXBlLl9nZXRQYXJlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dCh0aGlzLl9jb25maWcucGFyZW50KVswXSxpPSdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicrdGhpcy5fY29uZmlnLnBhcmVudCsnXCJdJztyZXR1cm4gdChuKS5maW5kKGkpLmVhY2goZnVuY3Rpb24odCxuKXtlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MobC5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQobiksW25dKX0pLG59LGwucHJvdG90eXBlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3M9ZnVuY3Rpb24oZSxuKXtpZihlKXt2YXIgaT10KGUpLmhhc0NsYXNzKGcuU0hPVyk7ZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsaSksbi5sZW5ndGgmJnQobikudG9nZ2xlQ2xhc3MoZy5DT0xMQVBTRUQsIWkpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsaSl9fSxsLl9nZXRUYXJnZXRGcm9tRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIG4/dChuKVswXTpudWxsfSxsLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcyksbz1uLmRhdGEoYSkscj10LmV4dGVuZCh7fSxkLG4uZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYoIW8mJnIudG9nZ2xlJiYvc2hvd3xoaWRlLy50ZXN0KGUpJiYoci50b2dnbGU9ITEpLG98fChvPW5ldyBsKHRoaXMsciksbi5kYXRhKGEsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1vW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO29bZV0oKX19KX0sbyhsLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX1dKSxsfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihfLkNMSUNLX0RBVEFfQVBJLG0uREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBuPUUuX2dldFRhcmdldEZyb21FbGVtZW50KHRoaXMpLGk9dChuKS5kYXRhKGEpLG89aT9cInRvZ2dsZVwiOnQodGhpcykuZGF0YSgpO0UuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksbyl9KSx0LmZuW2VdPUUuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPUUsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxFLl9qUXVlcnlJbnRlcmZhY2V9LEV9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJkcm9wZG93blwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLmRyb3Bkb3duXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0yNyx1PTM4LGQ9NDAsZj0zLF89e0hJREU6XCJoaWRlXCIrYSxISURERU46XCJoaWRkZW5cIithLFNIT1c6XCJzaG93XCIrYSxTSE9XTjpcInNob3duXCIrYSxDTElDSzpcImNsaWNrXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsLEZPQ1VTSU5fREFUQV9BUEk6XCJmb2N1c2luXCIrYStsLEtFWURPV05fREFUQV9BUEk6XCJrZXlkb3duXCIrYStsfSxnPXtCQUNLRFJPUDpcImRyb3Bkb3duLWJhY2tkcm9wXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLFNIT1c6XCJzaG93XCJ9LHA9e0JBQ0tEUk9QOlwiLmRyb3Bkb3duLWJhY2tkcm9wXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxGT1JNX0NISUxEOlwiLmRyb3Bkb3duIGZvcm1cIixST0xFX01FTlU6J1tyb2xlPVwibWVudVwiXScsUk9MRV9MSVNUQk9YOidbcm9sZT1cImxpc3Rib3hcIl0nLE5BVkJBUl9OQVY6XCIubmF2YmFyLW5hdlwiLFZJU0lCTEVfSVRFTVM6J1tyb2xlPVwibWVudVwiXSBsaTpub3QoLmRpc2FibGVkKSBhLCBbcm9sZT1cImxpc3Rib3hcIl0gbGk6bm90KC5kaXNhYmxlZCkgYSd9LG09ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXQsdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKX1yZXR1cm4gZS5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7aWYodGhpcy5kaXNhYmxlZHx8dCh0aGlzKS5oYXNDbGFzcyhnLkRJU0FCTEVEKSlyZXR1cm4hMTt2YXIgbj1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxpPXQobikuaGFzQ2xhc3MoZy5TSE9XKTtpZihlLl9jbGVhck1lbnVzKCksaSlyZXR1cm4hMTtpZihcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50JiYhdChuKS5jbG9zZXN0KHAuTkFWQkFSX05BVikubGVuZ3RoKXt2YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO28uY2xhc3NOYW1lPWcuQkFDS0RST1AsdChvKS5pbnNlcnRCZWZvcmUodGhpcyksdChvKS5vbihcImNsaWNrXCIsZS5fY2xlYXJNZW51cyl9dmFyIHI9e3JlbGF0ZWRUYXJnZXQ6dGhpc30scz10LkV2ZW50KF8uU0hPVyxyKTtyZXR1cm4gdChuKS50cmlnZ2VyKHMpLCFzLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYodGhpcy5mb2N1cygpLHRoaXMuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0KG4pLnRvZ2dsZUNsYXNzKGcuU0hPVyksdChuKS50cmlnZ2VyKHQuRXZlbnQoXy5TSE9XTixyKSksITEpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQscyksdCh0aGlzLl9lbGVtZW50KS5vZmYoYSksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9uKF8uQ0xJQ0ssdGhpcy50b2dnbGUpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShzKTtpZihpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PWlbbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7aVtuXS5jYWxsKHRoaXMpfX0pfSxlLl9jbGVhck1lbnVzPWZ1bmN0aW9uKG4pe2lmKCFufHxuLndoaWNoIT09Zil7dmFyIGk9dChwLkJBQ0tEUk9QKVswXTtpJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSk7Zm9yKHZhciBvPXQubWFrZUFycmF5KHQocC5EQVRBX1RPR0dMRSkpLHI9MDtyPG8ubGVuZ3RoO3IrKyl7dmFyIHM9ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQob1tyXSksYT17cmVsYXRlZFRhcmdldDpvW3JdfTtpZih0KHMpLmhhc0NsYXNzKGcuU0hPVykmJiEobiYmKFwiY2xpY2tcIj09PW4udHlwZSYmL2lucHV0fHRleHRhcmVhL2kudGVzdChuLnRhcmdldC50YWdOYW1lKXx8XCJmb2N1c2luXCI9PT1uLnR5cGUpJiZ0LmNvbnRhaW5zKHMsbi50YXJnZXQpKSl7dmFyIGw9dC5FdmVudChfLkhJREUsYSk7dChzKS50cmlnZ2VyKGwpLGwuaXNEZWZhdWx0UHJldmVudGVkKCl8fChvW3JdLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIixcImZhbHNlXCIpLHQocykucmVtb3ZlQ2xhc3MoZy5TSE9XKS50cmlnZ2VyKHQuRXZlbnQoXy5ISURERU4sYSkpKX19fX0sZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dm9pZCAwLGk9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBpJiYobj10KGkpWzBdKSxufHxlLnBhcmVudE5vZGV9LGUuX2RhdGFBcGlLZXlkb3duSGFuZGxlcj1mdW5jdGlvbihuKXtpZigvKDM4fDQwfDI3fDMyKS8udGVzdChuLndoaWNoKSYmIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3Qobi50YXJnZXQudGFnTmFtZSkmJihuLnByZXZlbnREZWZhdWx0KCksbi5zdG9wUHJvcGFnYXRpb24oKSwhdGhpcy5kaXNhYmxlZCYmIXQodGhpcykuaGFzQ2xhc3MoZy5ESVNBQkxFRCkpKXt2YXIgaT1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxvPXQoaSkuaGFzQ2xhc3MoZy5TSE9XKTtpZighbyYmbi53aGljaCE9PWN8fG8mJm4ud2hpY2g9PT1jKXtpZihuLndoaWNoPT09Yyl7dmFyIHI9dChpKS5maW5kKHAuREFUQV9UT0dHTEUpWzBdO3QocikudHJpZ2dlcihcImZvY3VzXCIpfXJldHVybiB2b2lkIHQodGhpcykudHJpZ2dlcihcImNsaWNrXCIpfXZhciBzPXQoaSkuZmluZChwLlZJU0lCTEVfSVRFTVMpLmdldCgpO2lmKHMubGVuZ3RoKXt2YXIgYT1zLmluZGV4T2Yobi50YXJnZXQpO24ud2hpY2g9PT11JiZhPjAmJmEtLSxuLndoaWNoPT09ZCYmYTxzLmxlbmd0aC0xJiZhKyssYTwwJiYoYT0wKSxzW2FdLmZvY3VzKCl9fX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9NRU5VLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9MSVNUQk9YLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5DTElDS19EQVRBX0FQSStcIiBcIitfLkZPQ1VTSU5fREFUQV9BUEksbS5fY2xlYXJNZW51cykub24oXy5DTElDS19EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0ucHJvdG90eXBlLnRvZ2dsZSkub24oXy5DTElDS19EQVRBX0FQSSxwLkZPUk1fQ0hJTEQsZnVuY3Rpb24odCl7dC5zdG9wUHJvcGFnYXRpb24oKX0pLHQuZm5bZV09bS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9bSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLG0uX2pRdWVyeUludGVyZmFjZX0sbX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cIm1vZGFsXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMubW9kYWxcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTMwMCxkPTE1MCxmPTI3LF89e2JhY2tkcm9wOiEwLGtleWJvYXJkOiEwLGZvY3VzOiEwLHNob3c6ITB9LGc9e2JhY2tkcm9wOlwiKGJvb2xlYW58c3RyaW5nKVwiLGtleWJvYXJkOlwiYm9vbGVhblwiLGZvY3VzOlwiYm9vbGVhblwiLHNob3c6XCJib29sZWFuXCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsUkVTSVpFOlwicmVzaXplXCIrbCxDTElDS19ESVNNSVNTOlwiY2xpY2suZGlzbWlzc1wiK2wsS0VZRE9XTl9ESVNNSVNTOlwia2V5ZG93bi5kaXNtaXNzXCIrbCxNT1VTRVVQX0RJU01JU1M6XCJtb3VzZXVwLmRpc21pc3NcIitsLE1PVVNFRE9XTl9ESVNNSVNTOlwibW91c2Vkb3duLmRpc21pc3NcIitsLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LG09e1NDUk9MTEJBUl9NRUFTVVJFUjpcIm1vZGFsLXNjcm9sbGJhci1tZWFzdXJlXCIsQkFDS0RST1A6XCJtb2RhbC1iYWNrZHJvcFwiLE9QRU46XCJtb2RhbC1vcGVuXCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtESUFMT0c6XCIubW9kYWwtZGlhbG9nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJyxEQVRBX0RJU01JU1M6J1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsRklYRURfQ09OVEVOVDpcIi5maXhlZC10b3AsIC5maXhlZC1ib3R0b20sIC5pcy1maXhlZCwgLnN0aWNreS10b3BcIn0sdj1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXtuKHRoaXMsaCksdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fZGlhbG9nPXQoZSkuZmluZChFLkRJQUxPRylbMF0sdGhpcy5fYmFja2Ryb3A9bnVsbCx0aGlzLl9pc1Nob3duPSExLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nPSExLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEsdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9MCx0aGlzLl9zY3JvbGxiYXJXaWR0aD0wfXJldHVybiBoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2lzU2hvd24/dGhpcy5oaWRlKCk6dGhpcy5zaG93KHQpfSxoLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpJiYodGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwKTt2YXIgaT10LkV2ZW50KHAuU0hPVyx7cmVsYXRlZFRhcmdldDplfSk7dCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLHRoaXMuX2lzU2hvd258fGkuaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0aGlzLl9pc1Nob3duPSEwLHRoaXMuX2NoZWNrU2Nyb2xsYmFyKCksdGhpcy5fc2V0U2Nyb2xsYmFyKCksdChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhtLk9QRU4pLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxFLkRBVEFfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5oaWRlKHQpfSksdCh0aGlzLl9kaWFsb2cpLm9uKHAuTU9VU0VET1dOX0RJU01JU1MsZnVuY3Rpb24oKXt0KG4uX2VsZW1lbnQpLm9uZShwLk1PVVNFVVBfRElTTUlTUyxmdW5jdGlvbihlKXt0KGUudGFyZ2V0KS5pcyhuLl9lbGVtZW50KSYmKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITApfSl9KSx0aGlzLl9zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtyZXR1cm4gbi5fc2hvd0VsZW1lbnQoZSl9KSl9LGgucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztpZihlJiZlLnByZXZlbnREZWZhdWx0KCksdGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7dmFyIGk9ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpO2kmJih0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITApO3ZhciBvPXQuRXZlbnQocC5ISURFKTt0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobyksdGhpcy5faXNTaG93biYmIW8uaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLl9pc1Nob3duPSExLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KGRvY3VtZW50KS5vZmYocC5GT0NVU0lOKSx0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKG0uU0hPVyksdCh0aGlzLl9lbGVtZW50KS5vZmYocC5DTElDS19ESVNNSVNTKSx0KHRoaXMuX2RpYWxvZykub2ZmKHAuTU9VU0VET1dOX0RJU01JU1MpLGk/dCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbih0KXtyZXR1cm4gbi5faGlkZU1vZGFsKHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6dGhpcy5faGlkZU1vZGFsKCkpfSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdCh3aW5kb3csZG9jdW1lbnQsdGhpcy5fZWxlbWVudCx0aGlzLl9iYWNrZHJvcCkub2ZmKGwpLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9kaWFsb2c9bnVsbCx0aGlzLl9iYWNrZHJvcD1udWxsLHRoaXMuX2lzU2hvd249bnVsbCx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1udWxsLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9bnVsbCx0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPW51bGwsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxfLG4pLHIudHlwZUNoZWNrQ29uZmlnKGUsbixnKSxufSxoLnByb3RvdHlwZS5fc2hvd0VsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKTt0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUmJnRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFfHxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnQpLHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheT1cImJsb2NrXCIsdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSx0aGlzLl9lbGVtZW50LnNjcm9sbFRvcD0wLGkmJnIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MobS5TSE9XKSx0aGlzLl9jb25maWcuZm9jdXMmJnRoaXMuX2VuZm9yY2VGb2N1cygpO3ZhciBvPXQuRXZlbnQocC5TSE9XTix7cmVsYXRlZFRhcmdldDplfSkscz1mdW5jdGlvbigpe24uX2NvbmZpZy5mb2N1cyYmbi5fZWxlbWVudC5mb2N1cygpLG4uX2lzVHJhbnNpdGlvbmluZz0hMSx0KG4uX2VsZW1lbnQpLnRyaWdnZXIobyl9O2k/dCh0aGlzLl9kaWFsb2cpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnMoKX0saC5wcm90b3R5cGUuX2VuZm9yY2VGb2N1cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dChkb2N1bWVudCkub2ZmKHAuRk9DVVNJTikub24ocC5GT0NVU0lOLGZ1bmN0aW9uKG4pe2RvY3VtZW50PT09bi50YXJnZXR8fGUuX2VsZW1lbnQ9PT1uLnRhcmdldHx8dChlLl9lbGVtZW50KS5oYXMobi50YXJnZXQpLmxlbmd0aHx8ZS5fZWxlbWVudC5mb2N1cygpfSl9LGgucHJvdG90eXBlLl9zZXRFc2NhcGVFdmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5faXNTaG93biYmdGhpcy5fY29uZmlnLmtleWJvYXJkP3QodGhpcy5fZWxlbWVudCkub24ocC5LRVlET1dOX0RJU01JU1MsZnVuY3Rpb24odCl7dC53aGljaD09PWYmJmUuaGlkZSgpfSk6dGhpcy5faXNTaG93bnx8dCh0aGlzLl9lbGVtZW50KS5vZmYocC5LRVlET1dOX0RJU01JU1MpfSxoLnByb3RvdHlwZS5fc2V0UmVzaXplRXZlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2lzU2hvd24/dCh3aW5kb3cpLm9uKHAuUkVTSVpFLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9oYW5kbGVVcGRhdGUodCl9KTp0KHdpbmRvdykub2ZmKHAuUkVTSVpFKX0saC5wcm90b3R5cGUuX2hpZGVNb2RhbD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbigpe3QoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MobS5PUEVOKSxlLl9yZXNldEFkanVzdG1lbnRzKCksZS5fcmVzZXRTY3JvbGxiYXIoKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIocC5ISURERU4pfSl9LGgucHJvdG90eXBlLl9yZW1vdmVCYWNrZHJvcD1mdW5jdGlvbigpe3RoaXMuX2JhY2tkcm9wJiYodCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlKCksdGhpcy5fYmFja2Ryb3A9bnVsbCl9LGgucHJvdG90eXBlLl9zaG93QmFja2Ryb3A9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKT9tLkZBREU6XCJcIjtpZih0aGlzLl9pc1Nob3duJiZ0aGlzLl9jb25maWcuYmFja2Ryb3Ape3ZhciBvPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJmk7aWYodGhpcy5fYmFja2Ryb3A9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLl9iYWNrZHJvcC5jbGFzc05hbWU9bS5CQUNLRFJPUCxpJiZ0KHRoaXMuX2JhY2tkcm9wKS5hZGRDbGFzcyhpKSx0KHRoaXMuX2JhY2tkcm9wKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5faWdub3JlQmFja2Ryb3BDbGljaz92b2lkKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEpOnZvaWQodC50YXJnZXQ9PT10LmN1cnJlbnRUYXJnZXQmJihcInN0YXRpY1wiPT09bi5fY29uZmlnLmJhY2tkcm9wP24uX2VsZW1lbnQuZm9jdXMoKTpuLmhpZGUoKSkpfSksbyYmci5yZWZsb3codGhpcy5fYmFja2Ryb3ApLHQodGhpcy5fYmFja2Ryb3ApLmFkZENsYXNzKG0uU0hPVyksIWUpcmV0dXJuO2lmKCFvKXJldHVybiB2b2lkIGUoKTt0KHRoaXMuX2JhY2tkcm9wKS5vbmUoci5UUkFOU0lUSU9OX0VORCxlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkKX1lbHNlIGlmKCF0aGlzLl9pc1Nob3duJiZ0aGlzLl9iYWNrZHJvcCl7dCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlQ2xhc3MobS5TSE9XKTt2YXIgcz1mdW5jdGlvbigpe24uX3JlbW92ZUJhY2tkcm9wKCksZSYmZSgpfTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk/dCh0aGlzLl9iYWNrZHJvcCkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoZCk6cygpfWVsc2UgZSYmZSgpfSxoLnByb3RvdHlwZS5faGFuZGxlVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5fYWRqdXN0RGlhbG9nKCl9LGgucHJvdG90eXBlLl9hZGp1c3REaWFsb2c9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodD5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyF0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmdCYmKHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9dGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKSx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmIXQmJih0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD10aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpfSxoLnByb3RvdHlwZS5fcmVzZXRBZGp1c3RtZW50cz1mdW5jdGlvbigpe3RoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9XCJcIix0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD1cIlwifSxoLnByb3RvdHlwZS5fY2hlY2tTY3JvbGxiYXI9ZnVuY3Rpb24oKXt0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoPHdpbmRvdy5pbm5lcldpZHRoLHRoaXMuX3Njcm9sbGJhcldpZHRoPXRoaXMuX2dldFNjcm9sbGJhcldpZHRoKCl9LGgucHJvdG90eXBlLl9zZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgZT1wYXJzZUludCh0KEUuRklYRURfQ09OVEVOVCkuY3NzKFwicGFkZGluZy1yaWdodFwiKXx8MCwxMCk7dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz1kb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodHx8XCJcIix0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmKGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0PWUrdGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKX0saC5wcm90b3R5cGUuX3Jlc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQ9dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZ30saC5wcm90b3R5cGUuX2dldFNjcm9sbGJhcldpZHRoPWZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0LmNsYXNzTmFtZT1tLlNDUk9MTEJBUl9NRUFTVVJFUixkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQpO3ZhciBlPXQub2Zmc2V0V2lkdGgtdC5jbGllbnRXaWR0aDtyZXR1cm4gZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0KSxlfSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSxuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG89dCh0aGlzKS5kYXRhKGEpLHI9dC5leHRlbmQoe30saC5EZWZhdWx0LHQodGhpcykuZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYob3x8KG89bmV3IGgodGhpcyxyKSx0KHRoaXMpLmRhdGEoYSxvKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW9bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7b1tlXShuKX1lbHNlIHIuc2hvdyYmby5zaG93KG4pfSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24ocC5DTElDS19EQVRBX0FQSSxFLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT12b2lkIDAsbz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7byYmKGk9dChvKVswXSk7dmFyIHM9dChpKS5kYXRhKGEpP1widG9nZ2xlXCI6dC5leHRlbmQoe30sdChpKS5kYXRhKCksdCh0aGlzKS5kYXRhKCkpO1wiQVwiIT09dGhpcy50YWdOYW1lJiZcIkFSRUFcIiE9PXRoaXMudGFnTmFtZXx8ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBsPXQoaSkub25lKHAuU0hPVyxmdW5jdGlvbihlKXtlLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxsLm9uZShwLkhJRERFTixmdW5jdGlvbigpe3QobikuaXMoXCI6dmlzaWJsZVwiKSYmbi5mb2N1cygpfSl9KTt2Ll9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KGkpLHMsdGhpcyl9KSx0LmZuW2VdPXYuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPXYsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09Yyx2Ll9qUXVlcnlJbnRlcmZhY2V9LHZ9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJzY3JvbGxzcHlcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5zY3JvbGxzcHlcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PXtvZmZzZXQ6MTAsbWV0aG9kOlwiYXV0b1wiLHRhcmdldDpcIlwifSxkPXtvZmZzZXQ6XCJudW1iZXJcIixtZXRob2Q6XCJzdHJpbmdcIix0YXJnZXQ6XCIoc3RyaW5nfGVsZW1lbnQpXCJ9LGY9e0FDVElWQVRFOlwiYWN0aXZhdGVcIitsLFNDUk9MTDpcInNjcm9sbFwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2h9LF89e0RST1BET1dOX0lURU06XCJkcm9wZG93bi1pdGVtXCIsRFJPUERPV05fTUVOVTpcImRyb3Bkb3duLW1lbnVcIixOQVZfTElOSzpcIm5hdi1saW5rXCIsTkFWOlwibmF2XCIsQUNUSVZFOlwiYWN0aXZlXCJ9LGc9e0RBVEFfU1BZOidbZGF0YS1zcHk9XCJzY3JvbGxcIl0nLEFDVElWRTpcIi5hY3RpdmVcIixMSVNUX0lURU06XCIubGlzdC1pdGVtXCIsTEk6XCJsaVwiLExJX0RST1BET1dOOlwibGkuZHJvcGRvd25cIixOQVZfTElOS1M6XCIubmF2LWxpbmtcIixEUk9QRE9XTjpcIi5kcm9wZG93blwiLERST1BET1dOX0lURU1TOlwiLmRyb3Bkb3duLWl0ZW1cIixEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCJ9LHA9e09GRlNFVDpcIm9mZnNldFwiLFBPU0lUSU9OOlwicG9zaXRpb25cIn0sbT1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXt2YXIgbz10aGlzO24odGhpcyxoKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fc2Nyb2xsRWxlbWVudD1cIkJPRFlcIj09PWUudGFnTmFtZT93aW5kb3c6ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3NlbGVjdG9yPXRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5OQVZfTElOS1MrXCIsXCIrKHRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5EUk9QRE9XTl9JVEVNUyksdGhpcy5fb2Zmc2V0cz1bXSx0aGlzLl90YXJnZXRzPVtdLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD0wLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub24oZi5TQ1JPTEwsZnVuY3Rpb24odCl7cmV0dXJuIG8uX3Byb2Nlc3ModCl9KSx0aGlzLnJlZnJlc2goKSx0aGlzLl9wcm9jZXNzKCl9cmV0dXJuIGgucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5fc2Nyb2xsRWxlbWVudCE9PXRoaXMuX3Njcm9sbEVsZW1lbnQud2luZG93P3AuUE9TSVRJT046cC5PRkZTRVQsaT1cImF1dG9cIj09PXRoaXMuX2NvbmZpZy5tZXRob2Q/bjp0aGlzLl9jb25maWcubWV0aG9kLG89aT09PXAuUE9TSVRJT04/dGhpcy5fZ2V0U2Nyb2xsVG9wKCk6MDt0aGlzLl9vZmZzZXRzPVtdLHRoaXMuX3RhcmdldHM9W10sdGhpcy5fc2Nyb2xsSGVpZ2h0PXRoaXMuX2dldFNjcm9sbEhlaWdodCgpO3ZhciBzPXQubWFrZUFycmF5KHQodGhpcy5fc2VsZWN0b3IpKTtzLm1hcChmdW5jdGlvbihlKXt2YXIgbj12b2lkIDAscz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIHMmJihuPXQocylbMF0pLG4mJihuLm9mZnNldFdpZHRofHxuLm9mZnNldEhlaWdodCk/W3QobilbaV0oKS50b3ArbyxzXTpudWxsfSkuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiB0fSkuc29ydChmdW5jdGlvbih0LGUpe3JldHVybiB0WzBdLWVbMF19KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UuX29mZnNldHMucHVzaCh0WzBdKSxlLl90YXJnZXRzLnB1c2godFsxXSl9KX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub2ZmKGwpLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9zY3JvbGxFbGVtZW50PW51bGwsdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fc2VsZWN0b3I9bnVsbCx0aGlzLl9vZmZzZXRzPW51bGwsdGhpcy5fdGFyZ2V0cz1udWxsLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe2lmKG49dC5leHRlbmQoe30sdSxuKSxcInN0cmluZ1wiIT10eXBlb2Ygbi50YXJnZXQpe3ZhciBpPXQobi50YXJnZXQpLmF0dHIoXCJpZFwiKTtpfHwoaT1yLmdldFVJRChlKSx0KG4udGFyZ2V0KS5hdHRyKFwiaWRcIixpKSksbi50YXJnZXQ9XCIjXCIraX1yZXR1cm4gci50eXBlQ2hlY2tDb25maWcoZSxuLGQpLG59LGgucHJvdG90eXBlLl9nZXRTY3JvbGxUb3A9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudD09PXdpbmRvdz90aGlzLl9zY3JvbGxFbGVtZW50LnBhZ2VZT2Zmc2V0OnRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsVG9wfSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsSGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsSGVpZ2h0fHxNYXRoLm1heChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KX0saC5wcm90b3R5cGUuX2dldE9mZnNldEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50PT09d2luZG93P3dpbmRvdy5pbm5lckhlaWdodDp0aGlzLl9zY3JvbGxFbGVtZW50Lm9mZnNldEhlaWdodH0saC5wcm90b3R5cGUuX3Byb2Nlc3M9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9nZXRTY3JvbGxUb3AoKSt0aGlzLl9jb25maWcub2Zmc2V0LGU9dGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KCksbj10aGlzLl9jb25maWcub2Zmc2V0K2UtdGhpcy5fZ2V0T2Zmc2V0SGVpZ2h0KCk7aWYodGhpcy5fc2Nyb2xsSGVpZ2h0IT09ZSYmdGhpcy5yZWZyZXNoKCksdD49bil7dmFyIGk9dGhpcy5fdGFyZ2V0c1t0aGlzLl90YXJnZXRzLmxlbmd0aC0xXTtyZXR1cm4gdm9pZCh0aGlzLl9hY3RpdmVUYXJnZXQhPT1pJiZ0aGlzLl9hY3RpdmF0ZShpKSl9aWYodGhpcy5fYWN0aXZlVGFyZ2V0JiZ0PHRoaXMuX29mZnNldHNbMF0mJnRoaXMuX29mZnNldHNbMF0+MClyZXR1cm4gdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdm9pZCB0aGlzLl9jbGVhcigpO2Zvcih2YXIgbz10aGlzLl9vZmZzZXRzLmxlbmd0aDtvLS07KXt2YXIgcj10aGlzLl9hY3RpdmVUYXJnZXQhPT10aGlzLl90YXJnZXRzW29dJiZ0Pj10aGlzLl9vZmZzZXRzW29dJiYodm9pZCAwPT09dGhpcy5fb2Zmc2V0c1tvKzFdfHx0PHRoaXMuX29mZnNldHNbbysxXSk7ciYmdGhpcy5fYWN0aXZhdGUodGhpcy5fdGFyZ2V0c1tvXSl9fSxoLnByb3RvdHlwZS5fYWN0aXZhdGU9ZnVuY3Rpb24oZSl7dGhpcy5fYWN0aXZlVGFyZ2V0PWUsdGhpcy5fY2xlYXIoKTt2YXIgbj10aGlzLl9zZWxlY3Rvci5zcGxpdChcIixcIik7bj1uLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdCsnW2RhdGEtdGFyZ2V0PVwiJytlKydcIl0sJysodCsnW2hyZWY9XCInK2UrJ1wiXScpfSk7dmFyIGk9dChuLmpvaW4oXCIsXCIpKTtpLmhhc0NsYXNzKF8uRFJPUERPV05fSVRFTSk/KGkuY2xvc2VzdChnLkRST1BET1dOKS5maW5kKGcuRFJPUERPV05fVE9HR0xFKS5hZGRDbGFzcyhfLkFDVElWRSksaS5hZGRDbGFzcyhfLkFDVElWRSkpOmkucGFyZW50cyhnLkxJKS5maW5kKFwiPiBcIitnLk5BVl9MSU5LUykuYWRkQ2xhc3MoXy5BQ1RJVkUpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkudHJpZ2dlcihmLkFDVElWQVRFLHtyZWxhdGVkVGFyZ2V0OmV9KX0saC5wcm90b3R5cGUuX2NsZWFyPWZ1bmN0aW9uKCl7dCh0aGlzLl9zZWxlY3RvcikuZmlsdGVyKGcuQUNUSVZFKS5yZW1vdmVDbGFzcyhfLkFDVElWRSl9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlO1xyXG5pZihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09bltlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtuW2VdKCl9fSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdX19XSksaH0oKTtyZXR1cm4gdCh3aW5kb3cpLm9uKGYuTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe2Zvcih2YXIgZT10Lm1ha2VBcnJheSh0KGcuREFUQV9TUFkpKSxuPWUubGVuZ3RoO24tLTspe3ZhciBpPXQoZVtuXSk7bS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoaSxpLmRhdGEoKSl9fSksdC5mbltlXT1tLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1tLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwidGFiXCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMudGFiXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0xNTAsdT17SElERTpcImhpZGVcIithLEhJRERFTjpcImhpZGRlblwiK2EsU0hPVzpcInNob3dcIithLFNIT1dOOlwic2hvd25cIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGQ9e0RST1BET1dOX01FTlU6XCJkcm9wZG93bi1tZW51XCIsQUNUSVZFOlwiYWN0aXZlXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sZj17QTpcImFcIixMSTpcImxpXCIsRFJPUERPV046XCIuZHJvcGRvd25cIixMSVNUOlwidWw6bm90KC5kcm9wZG93bi1tZW51KSwgb2w6bm90KC5kcm9wZG93bi1tZW51KSwgbmF2Om5vdCguZHJvcGRvd24tbWVudSlcIixGQURFX0NISUxEOlwiPiAubmF2LWl0ZW0gLmZhZGUsID4gLmZhZGVcIixBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0NISUxEOlwiPiAubmF2LWl0ZW0gPiAuYWN0aXZlLCA+IC5hY3RpdmVcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwidGFiXCJdLCBbZGF0YS10b2dnbGU9XCJwaWxsXCJdJyxEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCIsRFJPUERPV05fQUNUSVZFX0NISUxEOlwiPiAuZHJvcGRvd24tbWVudSAuYWN0aXZlXCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKCEodGhpcy5fZWxlbWVudC5wYXJlbnROb2RlJiZ0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhkLkFDVElWRSl8fHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZC5ESVNBQkxFRCkpKXt2YXIgbj12b2lkIDAsaT12b2lkIDAsbz10KHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoZi5MSVNUKVswXSxzPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtvJiYoaT10Lm1ha2VBcnJheSh0KG8pLmZpbmQoZi5BQ1RJVkUpKSxpPWlbaS5sZW5ndGgtMV0pO3ZhciBhPXQuRXZlbnQodS5ISURFLHtyZWxhdGVkVGFyZ2V0OnRoaXMuX2VsZW1lbnR9KSxsPXQuRXZlbnQodS5TSE9XLHtyZWxhdGVkVGFyZ2V0Oml9KTtpZihpJiZ0KGkpLnRyaWdnZXIoYSksdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGwpLCFsLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYhYS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7cyYmKG49dChzKVswXSksdGhpcy5fYWN0aXZhdGUodGhpcy5fZWxlbWVudCxvKTt2YXIgaD1mdW5jdGlvbigpe3ZhciBuPXQuRXZlbnQodS5ISURERU4se3JlbGF0ZWRUYXJnZXQ6ZS5fZWxlbWVudH0pLG89dC5FdmVudCh1LlNIT1dOLHtyZWxhdGVkVGFyZ2V0Oml9KTt0KGkpLnRyaWdnZXIobiksdChlLl9lbGVtZW50KS50cmlnZ2VyKG8pfTtuP3RoaXMuX2FjdGl2YXRlKG4sbi5wYXJlbnROb2RlLGgpOmgoKX19fSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50LHMpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2FjdGl2YXRlPWZ1bmN0aW9uKGUsbixpKXt2YXIgbz10aGlzLHM9dChuKS5maW5kKGYuQUNUSVZFX0NISUxEKVswXSxhPWkmJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihzJiZ0KHMpLmhhc0NsYXNzKGQuRkFERSl8fEJvb2xlYW4odChuKS5maW5kKGYuRkFERV9DSElMRClbMF0pKSxsPWZ1bmN0aW9uKCl7cmV0dXJuIG8uX3RyYW5zaXRpb25Db21wbGV0ZShlLHMsYSxpKX07cyYmYT90KHMpLm9uZShyLlRSQU5TSVRJT05fRU5ELGwpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpOmwoKSxzJiZ0KHMpLnJlbW92ZUNsYXNzKGQuU0hPVyl9LGUucHJvdG90eXBlLl90cmFuc2l0aW9uQ29tcGxldGU9ZnVuY3Rpb24oZSxuLGksbyl7aWYobil7dChuKS5yZW1vdmVDbGFzcyhkLkFDVElWRSk7dmFyIHM9dChuLnBhcmVudE5vZGUpLmZpbmQoZi5EUk9QRE9XTl9BQ1RJVkVfQ0hJTEQpWzBdO3MmJnQocykucmVtb3ZlQ2xhc3MoZC5BQ1RJVkUpLG4uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKX1pZih0KGUpLmFkZENsYXNzKGQuQUNUSVZFKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksaT8oci5yZWZsb3coZSksdChlKS5hZGRDbGFzcyhkLlNIT1cpKTp0KGUpLnJlbW92ZUNsYXNzKGQuRkFERSksZS5wYXJlbnROb2RlJiZ0KGUucGFyZW50Tm9kZSkuaGFzQ2xhc3MoZC5EUk9QRE9XTl9NRU5VKSl7dmFyIGE9dChlKS5jbG9zZXN0KGYuRFJPUERPV04pWzBdO2EmJnQoYSkuZmluZChmLkRST1BET1dOX1RPR0dMRSkuYWRkQ2xhc3MoZC5BQ1RJVkUpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKX1vJiZvKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtpZihvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PW9bbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7b1tuXSgpfX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxmLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKSxfLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KHRoaXMpLFwic2hvd1wiKX0pLHQuZm5bZV09Xy5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9Xyx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLF8uX2pRdWVyeUludGVyZmFjZX0sX30oalF1ZXJ5KSxmdW5jdGlvbih0KXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgVGV0aGVyKXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCB0b29sdGlwcyByZXF1aXJlIFRldGhlciAoaHR0cDovL3RldGhlci5pby8pXCIpO3ZhciBlPVwidG9vbHRpcFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLnRvb2x0aXBcIixsPVwiLlwiK2EsaD10LmZuW2VdLGM9MTUwLHU9XCJicy10ZXRoZXJcIixkPXthbmltYXRpb246ITAsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsdHJpZ2dlcjpcImhvdmVyIGZvY3VzXCIsdGl0bGU6XCJcIixkZWxheTowLGh0bWw6ITEsc2VsZWN0b3I6ITEscGxhY2VtZW50OlwidG9wXCIsb2Zmc2V0OlwiMCAwXCIsY29uc3RyYWludHM6W10sY29udGFpbmVyOiExfSxmPXthbmltYXRpb246XCJib29sZWFuXCIsdGVtcGxhdGU6XCJzdHJpbmdcIix0aXRsZTpcIihzdHJpbmd8ZWxlbWVudHxmdW5jdGlvbilcIix0cmlnZ2VyOlwic3RyaW5nXCIsZGVsYXk6XCIobnVtYmVyfG9iamVjdClcIixodG1sOlwiYm9vbGVhblwiLHNlbGVjdG9yOlwiKHN0cmluZ3xib29sZWFuKVwiLHBsYWNlbWVudDpcIihzdHJpbmd8ZnVuY3Rpb24pXCIsb2Zmc2V0Olwic3RyaW5nXCIsY29uc3RyYWludHM6XCJhcnJheVwiLGNvbnRhaW5lcjpcIihzdHJpbmd8ZWxlbWVudHxib29sZWFuKVwifSxfPXtUT1A6XCJib3R0b20gY2VudGVyXCIsUklHSFQ6XCJtaWRkbGUgbGVmdFwiLEJPVFRPTTpcInRvcCBjZW50ZXJcIixMRUZUOlwibWlkZGxlIHJpZ2h0XCJ9LGc9e1NIT1c6XCJzaG93XCIsT1VUOlwib3V0XCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxJTlNFUlRFRDpcImluc2VydGVkXCIrbCxDTElDSzpcImNsaWNrXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsRk9DVVNPVVQ6XCJmb2N1c291dFwiK2wsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitsLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrbH0sbT17RkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtUT09MVElQOlwiLnRvb2x0aXBcIixUT09MVElQX0lOTkVSOlwiLnRvb2x0aXAtaW5uZXJcIn0sdj17ZWxlbWVudDohMSxlbmFibGVkOiExfSxUPXtIT1ZFUjpcImhvdmVyXCIsRk9DVVM6XCJmb2N1c1wiLENMSUNLOlwiY2xpY2tcIixNQU5VQUw6XCJtYW51YWxcIn0sST1mdW5jdGlvbigpe2Z1bmN0aW9uIGgodCxlKXtuKHRoaXMsaCksdGhpcy5faXNFbmFibGVkPSEwLHRoaXMuX3RpbWVvdXQ9MCx0aGlzLl9ob3ZlclN0YXRlPVwiXCIsdGhpcy5fYWN0aXZlVHJpZ2dlcj17fSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fdGV0aGVyPW51bGwsdGhpcy5lbGVtZW50PXQsdGhpcy5jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGUpLHRoaXMudGlwPW51bGwsdGhpcy5fc2V0TGlzdGVuZXJzKCl9cmV0dXJuIGgucHJvdG90eXBlLmVuYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMH0saC5wcm90b3R5cGUuZGlzYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMX0saC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZD1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hdGhpcy5faXNFbmFibGVkfSxoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIG49dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSxpPXQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKG4pO2l8fChpPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShuLGkpKSxpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrPSFpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrLGkuX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKT9pLl9lbnRlcihudWxsLGkpOmkuX2xlYXZlKG51bGwsaSl9ZWxzZXtpZih0KHRoaXMuZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpKXJldHVybiB2b2lkIHRoaXMuX2xlYXZlKG51bGwsdGhpcyk7dGhpcy5fZW50ZXIobnVsbCx0aGlzKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCksdGhpcy5jbGVhbnVwVGV0aGVyKCksdC5yZW1vdmVEYXRhKHRoaXMuZWxlbWVudCx0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZKSx0KHRoaXMuZWxlbWVudCkub2ZmKHRoaXMuY29uc3RydWN0b3IuRVZFTlRfS0VZKSx0KHRoaXMuZWxlbWVudCkuY2xvc2VzdChcIi5tb2RhbFwiKS5vZmYoXCJoaWRlLmJzLm1vZGFsXCIpLHRoaXMudGlwJiZ0KHRoaXMudGlwKS5yZW1vdmUoKSx0aGlzLl9pc0VuYWJsZWQ9bnVsbCx0aGlzLl90aW1lb3V0PW51bGwsdGhpcy5faG92ZXJTdGF0ZT1udWxsLHRoaXMuX2FjdGl2ZVRyaWdnZXI9bnVsbCx0aGlzLl90ZXRoZXI9bnVsbCx0aGlzLmVsZW1lbnQ9bnVsbCx0aGlzLmNvbmZpZz1udWxsLHRoaXMudGlwPW51bGx9LGgucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKFwibm9uZVwiPT09dCh0aGlzLmVsZW1lbnQpLmNzcyhcImRpc3BsYXlcIikpdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIHVzZSBzaG93IG9uIHZpc2libGUgZWxlbWVudHNcIik7dmFyIG49dC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1cpO2lmKHRoaXMuaXNXaXRoQ29udGVudCgpJiZ0aGlzLl9pc0VuYWJsZWQpe2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJUb29sdGlwIGlzIHRyYW5zaXRpb25pbmdcIik7dCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIobik7dmFyIGk9dC5jb250YWlucyh0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsdGhpcy5lbGVtZW50KTtpZihuLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwhaSlyZXR1cm47dmFyIG89dGhpcy5nZXRUaXBFbGVtZW50KCkscz1yLmdldFVJRCh0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO28uc2V0QXR0cmlidXRlKFwiaWRcIixzKSx0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLHMpLHRoaXMuc2V0Q29udGVudCgpLHRoaXMuY29uZmlnLmFuaW1hdGlvbiYmdChvKS5hZGRDbGFzcyhtLkZBREUpO3ZhciBhPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLnBsYWNlbWVudD90aGlzLmNvbmZpZy5wbGFjZW1lbnQuY2FsbCh0aGlzLG8sdGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy5wbGFjZW1lbnQsbD10aGlzLl9nZXRBdHRhY2htZW50KGEpLGM9dGhpcy5jb25maWcuY29udGFpbmVyPT09ITE/ZG9jdW1lbnQuYm9keTp0KHRoaXMuY29uZmlnLmNvbnRhaW5lcik7dChvKS5kYXRhKHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVksdGhpcykuYXBwZW5kVG8oYyksdCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5JTlNFUlRFRCksdGhpcy5fdGV0aGVyPW5ldyBUZXRoZXIoe2F0dGFjaG1lbnQ6bCxlbGVtZW50Om8sdGFyZ2V0OnRoaXMuZWxlbWVudCxjbGFzc2VzOnYsY2xhc3NQcmVmaXg6dSxvZmZzZXQ6dGhpcy5jb25maWcub2Zmc2V0LGNvbnN0cmFpbnRzOnRoaXMuY29uZmlnLmNvbnN0cmFpbnRzLGFkZFRhcmdldENsYXNzZXM6ITF9KSxyLnJlZmxvdyhvKSx0aGlzLl90ZXRoZXIucG9zaXRpb24oKSx0KG8pLmFkZENsYXNzKG0uU0hPVyk7dmFyIGQ9ZnVuY3Rpb24oKXt2YXIgbj1lLl9ob3ZlclN0YXRlO2UuX2hvdmVyU3RhdGU9bnVsbCxlLl9pc1RyYW5zaXRpb25pbmc9ITEsdChlLmVsZW1lbnQpLnRyaWdnZXIoZS5jb25zdHJ1Y3Rvci5FdmVudC5TSE9XTiksbj09PWcuT1VUJiZlLl9sZWF2ZShudWxsLGUpfTtpZihyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMudGlwKS5oYXNDbGFzcyhtLkZBREUpKXJldHVybiB0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITAsdm9pZCB0KHRoaXMudGlwKS5vbmUoci5UUkFOU0lUSU9OX0VORCxkKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChoLl9UUkFOU0lUSU9OX0RVUkFUSU9OKTtkKCl9fSxoLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT10aGlzLmdldFRpcEVsZW1lbnQoKSxvPXQuRXZlbnQodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5ISURFKTtpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiVG9vbHRpcCBpcyB0cmFuc2l0aW9uaW5nXCIpO3ZhciBzPWZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZSE9PWcuU0hPVyYmaS5wYXJlbnROb2RlJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSksbi5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiksdChuLmVsZW1lbnQpLnRyaWdnZXIobi5jb25zdHJ1Y3Rvci5FdmVudC5ISURERU4pLG4uX2lzVHJhbnNpdGlvbmluZz0hMSxuLmNsZWFudXBUZXRoZXIoKSxlJiZlKCl9O3QodGhpcy5lbGVtZW50KS50cmlnZ2VyKG8pLG8uaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0KGkpLnJlbW92ZUNsYXNzKG0uU0hPVyksdGhpcy5fYWN0aXZlVHJpZ2dlcltULkNMSUNLXT0hMSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuRk9DVVNdPSExLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5IT1ZFUl09ITEsci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLnRpcCkuaGFzQ2xhc3MobS5GQURFKT8odGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwLHQoaSkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoYykpOnMoKSx0aGlzLl9ob3ZlclN0YXRlPVwiXCIpfSxoLnByb3RvdHlwZS5pc1dpdGhDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4odGhpcy5nZXRUaXRsZSgpKX0saC5wcm90b3R5cGUuZ2V0VGlwRWxlbWVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpcD10aGlzLnRpcHx8dCh0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF19LGgucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuZ2V0VGlwRWxlbWVudCgpKTt0aGlzLnNldEVsZW1lbnRDb250ZW50KGUuZmluZChFLlRPT0xUSVBfSU5ORVIpLHRoaXMuZ2V0VGl0bGUoKSksZS5yZW1vdmVDbGFzcyhtLkZBREUrXCIgXCIrbS5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0saC5wcm90b3R5cGUuc2V0RWxlbWVudENvbnRlbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgbz10aGlzLmNvbmZpZy5odG1sO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIG4/XCJ1bmRlZmluZWRcIjppKG4pKSYmKG4ubm9kZVR5cGV8fG4uanF1ZXJ5KT9vP3QobikucGFyZW50KCkuaXMoZSl8fGUuZW1wdHkoKS5hcHBlbmQobik6ZS50ZXh0KHQobikudGV4dCgpKTplW28/XCJodG1sXCI6XCJ0ZXh0XCJdKG4pfSxoLnByb3RvdHlwZS5nZXRUaXRsZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpO3JldHVybiB0fHwodD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy50aXRsZT90aGlzLmNvbmZpZy50aXRsZS5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcudGl0bGUpLHR9LGgucHJvdG90eXBlLmNsZWFudXBUZXRoZXI9ZnVuY3Rpb24oKXt0aGlzLl90ZXRoZXImJnRoaXMuX3RldGhlci5kZXN0cm95KCl9LGgucHJvdG90eXBlLl9nZXRBdHRhY2htZW50PWZ1bmN0aW9uKHQpe3JldHVybiBfW3QudG9VcHBlckNhc2UoKV19LGgucHJvdG90eXBlLl9zZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5jb25maWcudHJpZ2dlci5zcGxpdChcIiBcIik7bi5mb3JFYWNoKGZ1bmN0aW9uKG4pe2lmKFwiY2xpY2tcIj09PW4pdChlLmVsZW1lbnQpLm9uKGUuY29uc3RydWN0b3IuRXZlbnQuQ0xJQ0ssZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUudG9nZ2xlKHQpfSk7ZWxzZSBpZihuIT09VC5NQU5VQUwpe3ZhciBpPW49PT1ULkhPVkVSP2UuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VFTlRFUjplLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTSU4sbz1uPT09VC5IT1ZFUj9lLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFTEVBVkU6ZS5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU09VVDt0KGUuZWxlbWVudCkub24oaSxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS5fZW50ZXIodCl9KS5vbihvLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9sZWF2ZSh0KX0pfXQoZS5lbGVtZW50KS5jbG9zZXN0KFwiLm1vZGFsXCIpLm9uKFwiaGlkZS5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGUuaGlkZSgpfSl9KSx0aGlzLmNvbmZpZy5zZWxlY3Rvcj90aGlzLmNvbmZpZz10LmV4dGVuZCh7fSx0aGlzLmNvbmZpZyx7dHJpZ2dlcjpcIm1hbnVhbFwiLHNlbGVjdG9yOlwiXCJ9KTp0aGlzLl9maXhUaXRsZSgpfSxoLnByb3RvdHlwZS5fZml4VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD1pKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKTsodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInRpdGxlXCIpfHxcInN0cmluZ1wiIT09dCkmJih0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiLHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKXx8XCJcIiksdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsXCJcIikpfSxoLnByb3RvdHlwZS5fZW50ZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO3JldHVybiBuPW58fHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGkpLG58fChuPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpLG4pKSxlJiYobi5fYWN0aXZlVHJpZ2dlcltcImZvY3VzaW5cIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSEwKSx0KG4uZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpfHxuLl9ob3ZlclN0YXRlPT09Zy5TSE9XP3ZvaWQobi5faG92ZXJTdGF0ZT1nLlNIT1cpOihjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLlNIT1csbi5jb25maWcuZGVsYXkmJm4uY29uZmlnLmRlbGF5LnNob3c/dm9pZChuLl90aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlPT09Zy5TSE9XJiZuLnNob3coKX0sbi5jb25maWcuZGVsYXkuc2hvdykpOnZvaWQgbi5zaG93KCkpfSxoLnByb3RvdHlwZS5fbGVhdmU9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO2lmKG49bnx8dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSksbnx8KG49bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGksbikpLGUmJihuLl9hY3RpdmVUcmlnZ2VyW1wiZm9jdXNvdXRcIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSExKSwhbi5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKXJldHVybiBjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLk9VVCxuLmNvbmZpZy5kZWxheSYmbi5jb25maWcuZGVsYXkuaGlkZT92b2lkKG4uX3RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe24uX2hvdmVyU3RhdGU9PT1nLk9VVCYmbi5oaWRlKCl9LG4uY29uZmlnLmRlbGF5LmhpZGUpKTp2b2lkIG4uaGlkZSgpfSxoLnByb3RvdHlwZS5faXNXaXRoQWN0aXZlVHJpZ2dlcj1mdW5jdGlvbigpe2Zvcih2YXIgdCBpbiB0aGlzLl9hY3RpdmVUcmlnZ2VyKWlmKHRoaXMuX2FjdGl2ZVRyaWdnZXJbdF0pcmV0dXJuITA7cmV0dXJuITF9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LHQodGhpcy5lbGVtZW50KS5kYXRhKCksbiksbi5kZWxheSYmXCJudW1iZXJcIj09dHlwZW9mIG4uZGVsYXkmJihuLmRlbGF5PXtzaG93Om4uZGVsYXksaGlkZTpuLmRlbGF5fSksci50eXBlQ2hlY2tDb25maWcoZSxuLHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGUpLG59LGgucHJvdG90eXBlLl9nZXREZWxlZ2F0ZUNvbmZpZz1mdW5jdGlvbigpe3ZhciB0PXt9O2lmKHRoaXMuY29uZmlnKWZvcih2YXIgZSBpbiB0aGlzLmNvbmZpZyl0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRbZV0hPT10aGlzLmNvbmZpZ1tlXSYmKHRbZV09dGhpcy5jb25maWdbZV0pO3JldHVybiB0fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZTtpZigobnx8IS9kaXNwb3NlfGhpZGUvLnRlc3QoZSkpJiYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpKXtpZih2b2lkIDA9PT1uW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO25bZV0oKX19KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBhfX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksaH0oKTtyZXR1cm4gdC5mbltlXT1JLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1JLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsSS5falF1ZXJ5SW50ZXJmYWNlfSxJfShqUXVlcnkpKTsoZnVuY3Rpb24ocil7dmFyIGE9XCJwb3BvdmVyXCIsbD1cIjQuMC4wLWFscGhhLjZcIixoPVwiYnMucG9wb3ZlclwiLGM9XCIuXCIraCx1PXIuZm5bYV0sZD1yLmV4dGVuZCh7fSxzLkRlZmF1bHQse3BsYWNlbWVudDpcInJpZ2h0XCIsdHJpZ2dlcjpcImNsaWNrXCIsY29udGVudDpcIlwiLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2Pid9KSxmPXIuZXh0ZW5kKHt9LHMuRGVmYXVsdFR5cGUse2NvbnRlbnQ6XCIoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pXCJ9KSxfPXtGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LGc9e1RJVExFOlwiLnBvcG92ZXItdGl0bGVcIixDT05URU5UOlwiLnBvcG92ZXItY29udGVudFwifSxwPXtISURFOlwiaGlkZVwiK2MsSElEREVOOlwiaGlkZGVuXCIrYyxTSE9XOlwic2hvd1wiK2MsU0hPV046XCJzaG93blwiK2MsSU5TRVJURUQ6XCJpbnNlcnRlZFwiK2MsQ0xJQ0s6XCJjbGlja1wiK2MsRk9DVVNJTjpcImZvY3VzaW5cIitjLEZPQ1VTT1VUOlwiZm9jdXNvdXRcIitjLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrYyxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2N9LG09ZnVuY3Rpb24ocyl7ZnVuY3Rpb24gdSgpe3JldHVybiBuKHRoaXMsdSksdCh0aGlzLHMuYXBwbHkodGhpcyxhcmd1bWVudHMpKX1yZXR1cm4gZSh1LHMpLHUucHJvdG90eXBlLmlzV2l0aENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRUaXRsZSgpfHx0aGlzLl9nZXRDb250ZW50KCl9LHUucHJvdG90eXBlLmdldFRpcEVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aXA9dGhpcy50aXB8fHIodGhpcy5jb25maWcudGVtcGxhdGUpWzBdfSx1LnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIHQ9cih0aGlzLmdldFRpcEVsZW1lbnQoKSk7dGhpcy5zZXRFbGVtZW50Q29udGVudCh0LmZpbmQoZy5USVRMRSksdGhpcy5nZXRUaXRsZSgpKSx0aGlzLnNldEVsZW1lbnRDb250ZW50KHQuZmluZChnLkNPTlRFTlQpLHRoaXMuX2dldENvbnRlbnQoKSksdC5yZW1vdmVDbGFzcyhfLkZBREUrXCIgXCIrXy5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0sdS5wcm90b3R5cGUuX2dldENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29udGVudFwiKXx8KFwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLmNvbnRlbnQ/dGhpcy5jb25maWcuY29udGVudC5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcuY29udGVudCl9LHUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9cih0aGlzKS5kYXRhKGgpLG49XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOmkodCkpP3Q6bnVsbDtpZigoZXx8IS9kZXN0cm95fGhpZGUvLnRlc3QodCkpJiYoZXx8KGU9bmV3IHUodGhpcyxuKSxyKHRoaXMpLmRhdGEoaCxlKSksXCJzdHJpbmdcIj09dHlwZW9mIHQpKXtpZih2b2lkIDA9PT1lW3RdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJyt0KydcIicpO2VbdF0oKX19KX0sbyh1LG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBofX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGN9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksdX0ocyk7cmV0dXJuIHIuZm5bYV09bS5falF1ZXJ5SW50ZXJmYWNlLHIuZm5bYV0uQ29uc3RydWN0b3I9bSxyLmZuW2FdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5mblthXT11LG0uX2pRdWVyeUludGVyZmFjZX0sbX0pKGpRdWVyeSl9KCk7IiwiLypcclxuKiBTZXQgdmFsdWUgb24gYSBmaWVsZCBvbmZvY3VzIGV2ZW50IGlmIGZpZWxkIHZhbHVlIGlzIGVtcHR5XHJcbipcclxuKiBAcGFyYW0gT2JqZWN0IGVsZW1lbnQgVGhlIGZpZWxkXHJcbiogQHBhcmFtIHN0cmluZyB2YWx1ZSAgIFRoZSB2YWx1ZSBcclxuKi9cclxuZnVuY3Rpb24gc2V0Rm9jdXNWYWx1ZShlbGVtZW50LCB2YWx1ZSl7XHJcbiAgICBpZighJChlbGVtZW50KS52YWwoKSlcclxuICAgIHtcclxuICAgICAgICAkKGVsZW1lbnQpLnZhbCh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiogQ29sbGFwc2VzIGFjY29yZGlvbihzKSBcclxuKlxyXG4qIEBwYXJhbSBlbGVtZW50ICAgIGFjY29yZGlvbiAgIFRoZSBhY2NvcmRpb24gZWxlbWVudFxyXG4qIEBwYXJhbSBzdHJpbmcgICAgIGFjdGlvbiAgICAgIFRoZSBhY3Rpb25cclxuKi9cclxuZnVuY3Rpb24gY29sbGFwc2VBbGwoYWNjb3JkaW9uLCBhY3Rpb24pXHJcbntcclxuICAgICQoYWNjb3JkaW9uKS5jb2xsYXBzZShhY3Rpb24pO1xyXG59XHJcblxyXG4vLyBDaGVja3MgYWxsIHRoZSBjaGVja2JveGVzIGNoaWxkcmVuIHdobyBoYXZlIHRoZSAuY2hlY2tBbGwgZWxlbWVudCBpZFxyXG4kKCcuY2hlY2tBbGwnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gZ2V0IHRoZSBpZFxyXG4gICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xyXG5cclxuICAgIC8vIGNoZWNrIGFsbCB0aGUgY2hlY2tib3hlcyB3aG8gaGF2ZSB0aGUgcGFyZW50IGlkIGFzIGNsYXNzXHJcbiAgICAkKCcuJyArIGlkKS5wcm9wKCdjaGVja2VkJywgdGhpcy5jaGVja2VkKTtcclxufSkiLCIkKCdzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCQodGhpcykudmFsKCkgPT0gXCJtb2RhbC10cmlnZ2VyXCIpIHtcclxuICAgICAgICAkKCcjbXlNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcbn0pOyIsIiQoJy5IYW1idXJnZXInKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdPcGVuJyk7XHJcbiAgICAkKCcuU3ViLWhlYWRlcl9iYXInKS50b2dnbGVDbGFzcygnSGFtYnVyZ2VyLW9wZW4nKTtcclxuICAgIGNvbnNvbGUubG9nKCd0b2dnbGVkJylcclxufSk7IiwiJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHsgICAgXHJcbiAgICB2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgIGlmIChzY3JvbGwgPj0gNTApIHtcclxuICAgICAgICAkKFwiLlN1Yi1oZWFkZXJfYmFyXCIpLmFkZENsYXNzKFwiU3RpY2t5LWhlYWRlclwiKTtcclxuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikuYWRkQ2xhc3MoXCJPbmx5XCIpO1xyXG4gICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKFwiVy1TdGlja3ktbmF2LS1lblwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJChcIi5TdWItaGVhZGVyX2JhclwiKS5yZW1vdmVDbGFzcyhcIlN0aWNreS1oZWFkZXJcIik7XHJcbiAgICAgICAgJChcIi5IZWFkZXJfYmFyXCIpLnJlbW92ZUNsYXNzKFwiT25seVwiKTtcclxuICAgICAgICAkKFwiaHRtbFwiKS5yZW1vdmVDbGFzcyhcIlctU3RpY2t5LW5hdi0tZW5cIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnLkhlYWRlcl9iYXJfX2FsZXJ0JykuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICQoJy5IZWFkZXJfYmFyX19hbGVydC0tbm90aWZpY2F0aW9uJykuaGlkZSgpO1xyXG59KSIsIi8qXHJcbiogQWRkcyBhIG1hcmtlciBvbiB0aGUgbWFwXHJcbipcclxuKiBAcGFyYW0gTWFwXHRtYXBcdFx0XHRcdFRoZSBtYXAgd2hlcmUgdG8gYWRkIHRoZSBtYXJrZXJcclxuKiBAcGFyYW0gZmxvYXQgIGxhdCAgICAgXHRcdFRoZSBwbGFjZSBsYXRpdHVkZSBcclxuKiBAcGFyYW0gZmxvYXQgIGxvbmcgICAgXHRcdFRoZSBwbGFjZSBsb25naXR1ZGVcclxuKiBAcGFyYW0gc3RyaW5nIGNvbnRlbnRTdHJpbmdcdFRoZSB3aW5kb3cgaW5mbyBjb250ZW50XHJcbiogQHBhcmFtIHN0cmluZyB0eXBlICAgIFx0XHRUaGUgcGluIHR5cGUuIEF2YWlsYWJsZSBwaW5zOiBbcmVkLGFtYmVyLGdyZWVuXVxyXG4qIEBwYXJhbSBzdHJpbmcgbGFiZWwgICBcdFx0VGhlIHBpbiBsYWJlbC4gQXZhaWxhYmxlIGxhYmVsOiBbY3ljbG9uZSxjb25mbGljdCxlYXJ0aHF1YWtlLHRzdW5hbWksc3Rvcm0sdm9sY2Fubyx0b3JuYWRvLGluc2VjdC1pbmZlc3RhdGlvbixkYW5nZXJvdXMtYXJlYV1cclxuKiBAcmV0dXJuIHtOdW1iZXJ9IHN1bVxyXG4qL1xyXG5mdW5jdGlvbiBhZGRNYXJrZXIobWFwLCBsYXQsIGxvbmcsIGNvbnRlbnRTdHJpbmcsIHR5cGUgLCBsYWJlbCA9IG51bGwpXHJcbntcclxuXHR2YXIgbWFya2VyID0gbmV3IE1hcmtlcih7XHJcblx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxvbmcpLFxyXG5cdFx0bWFwOiBtYXAsXHJcblx0XHRpY29uOiAnaW1nL21hcmtlcnMvJyArIHR5cGUgKyAnLnN2ZycsXHJcblx0XHRtYXBfaWNvbl9sYWJlbDogKGxhYmVsICE9PSBudWxsKSA/ICc8aSBjbGFzcz1cIm1hcC1pY29uIEljb24tLScgKyBsYWJlbCArICcgSWNvbi0tc21cIj48L2k+JyA6ICcnXHJcblx0fSk7XHJcbiBcdFxyXG5cdHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50U3RyaW5nLFxyXG5cdFx0XHRtYXhXaWR0aDogNDgwXHJcblx0fSk7XHJcblxyXG5cdG1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XHJcblx0fSk7XHJcbn0iLCIkKCcuSXRlbV9fc2VsZWN0YWJsZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ1NlbGVjdGVkJyk7XHJcbn0pOyIsIiQoXCIuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAvL1Jlc2V0IGFsbCBhY3RpdmUgY2xhc3Nlc1xyXG4gICAgaWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoIFwiQWN0aXZlXCIgKSApIHtcclxuICAgICAgICAkKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19yZXNwb25zZSwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlVXAoKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgJChcIi5SaWJib25fX2hlYWRlcl9fd3JhcCwgLlJpYmJvbl9fcmVzcG9uc2UsIC5SaWJib25fX2hlYWRlcl9fY2hldnJvblwiKS5yZW1vdmVDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVVwKCk7XHJcblxyXG4gICAgICAgIC8vQWRkIEFjdGl2ZSB0byBSaWJib24gSGVhZGVyIFdyYXBcclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdBY3RpdmUnKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuXHJcbiQoXCIuYnRuLWNvbnRpbnVlXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgLy9SZXNldCBhbGwgYWN0aXZlIGNsYXNzZXNcclxuICAgICAgICAkKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19yZXNwb25zZSwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlVXAoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgQWN0aXZlIHRvIG5leHQgcmliYm9uXHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KCkubmV4dChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZURvd24oKTtcclxufSk7XHJcblxyXG4vLyBJbnZlcnNlcyBhcnJvdyBvbiBhY2NvcmRpb24gZXhwYW5zaW9uXHJcbiQoJy5jb2xsYXBzZScpLm9uKCdzaG93bi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoXCIuZmEtY2FyZXQtZG93blwiKS5yZW1vdmVDbGFzcyhcImZhLWNhcmV0LWRvd25cIikuYWRkQ2xhc3MoXCJmYS1jYXJldC11cFwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLkhpZGUtYWxsJykuc2hvdygpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuU2hvdy1hbGwnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkub24oJ2hpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoXCIuZmEtY2FyZXQtdXBcIikucmVtb3ZlQ2xhc3MoXCJmYS1jYXJldC11cFwiKS5hZGRDbGFzcyhcImZhLWNhcmV0LWRvd25cIik7XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoJy5IaWRlLWFsbCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLlNob3ctYWxsJykuc2hvdygpO1xyXG4gICAgICAgIH1cclxufSk7Il19
