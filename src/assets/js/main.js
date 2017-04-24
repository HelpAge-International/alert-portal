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
    $(this).parent().parent().next(".Ribbon__response").addClass("Active");
    $(this).parent().parent().next().find(".Ribbon__header__wrap, .Ribbon__header__chevron").addClass("Active");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1hZG1pbi5qcyIsImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImZvcm1zLmpzIiwiaW5pdGlhbF9fZHJvcGRvd24tbW9kYWwtdHJpZ2dlci5qcyIsImluaXRpYWxfX2hhbWJ1cmdlci5qcyIsImluaXRpYWxfX3N0aWNreS1uYXYuanMiLCJtYXAuanMiLCJyZXNwb25zZS1wbGFuX19tdWx0aS1zZWxlY3QuanMiLCJyZXNwb25zZS1wbGFuX19yZXZlYWwtcmliYm9uLmpzIl0sIm5hbWVzIjpbImNvdW50cnlfcmVtb3ZlZCIsImNvdW50cmllcyIsIiQiLCJsZW5ndGgiLCJoaWRlIiwic2hvdyIsImdwYUFjdGlvbkNoYW5nZWQiLCJlbGVtZW50IiwiYWRkQWN0aW9uQnV0dG9uIiwiY2hlY2tlZCIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiZmluZCIsImkiLCJlYWNoIiwiYWRkQ2xhc3MiLCJhZGREZXBhcnRtZW50TW9kYWwiLCJzZWxlY3QiLCJtb2RhbF9pZCIsImhhc0NsYXNzIiwibW9kYWwiLCJyZWFkVVJMIiwiaW5wdXQiLCJmaWxlcyIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiY3NzIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzRGF0YVVSTCIsInByZXZpZXdMb2dvIiwibG9nb0ltYWdlIiwidHJpZ2dlclByZXZpZXdMb2dvIiwicHJldmVudERlZmF1bHQiLCJ0cmlnZ2VyIiwicmVtb3ZlTG9nb1ByZXZpZXciLCJqUXVlcnkiLCJFcnJvciIsInQiLCJmbiIsImpxdWVyeSIsInNwbGl0IiwiUmVmZXJlbmNlRXJyb3IiLCJfdHlwZW9mIiwiVHlwZUVycm9yIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwibiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwibyIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwiciIsInRvU3RyaW5nIiwiY2FsbCIsIm1hdGNoIiwidG9Mb3dlckNhc2UiLCJub2RlVHlwZSIsImJpbmRUeXBlIiwiYSIsImVuZCIsImRlbGVnYXRlVHlwZSIsImhhbmRsZSIsImlzIiwidGhpcyIsImhhbmRsZU9iaiIsImhhbmRsZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndpbmRvdyIsIlFVbml0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaCIsInN0eWxlIiwib25lIiwiYyIsIlRSQU5TSVRJT05fRU5EIiwic2V0VGltZW91dCIsInRyaWdnZXJUcmFuc2l0aW9uRW5kIiwicyIsImVtdWxhdGVUcmFuc2l0aW9uRW5kIiwic3VwcG9ydHNUcmFuc2l0aW9uRW5kIiwiZXZlbnQiLCJzcGVjaWFsIiwibCIsIldlYmtpdFRyYW5zaXRpb24iLCJNb3pUcmFuc2l0aW9uIiwiT1RyYW5zaXRpb24iLCJ0cmFuc2l0aW9uIiwiZ2V0VUlEIiwiTWF0aCIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCIsImdldEF0dHJpYnV0ZSIsInRlc3QiLCJyZWZsb3ciLCJvZmZzZXRIZWlnaHQiLCJCb29sZWFuIiwidHlwZUNoZWNrQ29uZmlnIiwiaGFzT3duUHJvcGVydHkiLCJSZWdFeHAiLCJ0b1VwcGVyQ2FzZSIsInUiLCJESVNNSVNTIiwiZCIsIkNMT1NFIiwiQ0xPU0VEIiwiQ0xJQ0tfREFUQV9BUEkiLCJmIiwiQUxFUlQiLCJGQURFIiwiU0hPVyIsIl8iLCJfZWxlbWVudCIsImNsb3NlIiwiX2dldFJvb3RFbGVtZW50IiwiX3RyaWdnZXJDbG9zZUV2ZW50IiwiaXNEZWZhdWx0UHJldmVudGVkIiwiX3JlbW92ZUVsZW1lbnQiLCJkaXNwb3NlIiwicmVtb3ZlRGF0YSIsImNsb3Nlc3QiLCJFdmVudCIsIl9kZXN0cm95RWxlbWVudCIsImRldGFjaCIsInJlbW92ZSIsIl9qUXVlcnlJbnRlcmZhY2UiLCJkYXRhIiwiX2hhbmRsZURpc21pc3MiLCJnZXQiLCJvbiIsIkNvbnN0cnVjdG9yIiwibm9Db25mbGljdCIsIkFDVElWRSIsIkJVVFRPTiIsIkZPQ1VTIiwiREFUQV9UT0dHTEVfQ0FSUk9UIiwiREFUQV9UT0dHTEUiLCJJTlBVVCIsIkZPQ1VTX0JMVVJfREFUQV9BUEkiLCJ0b2dnbGUiLCJ0eXBlIiwiZm9jdXMiLCJzZXRBdHRyaWJ1dGUiLCJ0b2dnbGVDbGFzcyIsImludGVydmFsIiwia2V5Ym9hcmQiLCJzbGlkZSIsInBhdXNlIiwid3JhcCIsImciLCJwIiwiTkVYVCIsIlBSRVYiLCJMRUZUIiwiUklHSFQiLCJtIiwiU0xJREUiLCJTTElEIiwiS0VZRE9XTiIsIk1PVVNFRU5URVIiLCJNT1VTRUxFQVZFIiwiTE9BRF9EQVRBX0FQSSIsIkUiLCJDQVJPVVNFTCIsIklURU0iLCJ2IiwiQUNUSVZFX0lURU0iLCJORVhUX1BSRVYiLCJJTkRJQ0FUT1JTIiwiREFUQV9TTElERSIsIkRBVEFfUklERSIsIlQiLCJfaXRlbXMiLCJfaW50ZXJ2YWwiLCJfYWN0aXZlRWxlbWVudCIsIl9pc1BhdXNlZCIsIl9pc1NsaWRpbmciLCJfY29uZmlnIiwiX2dldENvbmZpZyIsIl9pbmRpY2F0b3JzRWxlbWVudCIsIl9hZGRFdmVudExpc3RlbmVycyIsIm5leHQiLCJfc2xpZGUiLCJuZXh0V2hlblZpc2libGUiLCJoaWRkZW4iLCJwcmV2IiwiUFJFVklPVVMiLCJjeWNsZSIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInZpc2liaWxpdHlTdGF0ZSIsImJpbmQiLCJ0byIsIl9nZXRJdGVtSW5kZXgiLCJvZmYiLCJleHRlbmQiLCJfa2V5ZG93biIsImRvY3VtZW50RWxlbWVudCIsInRhZ05hbWUiLCJ3aGljaCIsIm1ha2VBcnJheSIsImluZGV4T2YiLCJfZ2V0SXRlbUJ5RGlyZWN0aW9uIiwiX3RyaWdnZXJTbGlkZUV2ZW50IiwicmVsYXRlZFRhcmdldCIsImRpcmVjdGlvbiIsIl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50IiwiY2hpbGRyZW4iLCJfZGF0YUFwaUNsaWNrSGFuZGxlciIsIlNIT1dOIiwiSElERSIsIkhJRERFTiIsIkNPTExBUFNFIiwiQ09MTEFQU0lORyIsIkNPTExBUFNFRCIsIldJRFRIIiwiSEVJR0hUIiwiQUNUSVZFUyIsIl9pc1RyYW5zaXRpb25pbmciLCJfdHJpZ2dlckFycmF5IiwiaWQiLCJfcGFyZW50IiwiX2dldFBhcmVudCIsIl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MiLCJfZ2V0RGltZW5zaW9uIiwiYXR0ciIsInNldFRyYW5zaXRpb25pbmciLCJzbGljZSIsIl9nZXRUYXJnZXRGcm9tRWxlbWVudCIsIkNMSUNLIiwiRk9DVVNJTl9EQVRBX0FQSSIsIktFWURPV05fREFUQV9BUEkiLCJCQUNLRFJPUCIsIkRJU0FCTEVEIiwiRk9STV9DSElMRCIsIlJPTEVfTUVOVSIsIlJPTEVfTElTVEJPWCIsIk5BVkJBUl9OQVYiLCJWSVNJQkxFX0lURU1TIiwiZGlzYWJsZWQiLCJfZ2V0UGFyZW50RnJvbUVsZW1lbnQiLCJfY2xlYXJNZW51cyIsImNsYXNzTmFtZSIsImluc2VydEJlZm9yZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImNvbnRhaW5zIiwiX2RhdGFBcGlLZXlkb3duSGFuZGxlciIsInN0b3BQcm9wYWdhdGlvbiIsImJhY2tkcm9wIiwiRk9DVVNJTiIsIlJFU0laRSIsIkNMSUNLX0RJU01JU1MiLCJLRVlET1dOX0RJU01JU1MiLCJNT1VTRVVQX0RJU01JU1MiLCJNT1VTRURPV05fRElTTUlTUyIsIlNDUk9MTEJBUl9NRUFTVVJFUiIsIk9QRU4iLCJESUFMT0ciLCJEQVRBX0RJU01JU1MiLCJGSVhFRF9DT05URU5UIiwiX2RpYWxvZyIsIl9iYWNrZHJvcCIsIl9pc1Nob3duIiwiX2lzQm9keU92ZXJmbG93aW5nIiwiX2lnbm9yZUJhY2tkcm9wQ2xpY2siLCJfb3JpZ2luYWxCb2R5UGFkZGluZyIsIl9zY3JvbGxiYXJXaWR0aCIsIl9jaGVja1Njcm9sbGJhciIsIl9zZXRTY3JvbGxiYXIiLCJib2R5IiwiX3NldEVzY2FwZUV2ZW50IiwiX3NldFJlc2l6ZUV2ZW50IiwiX3Nob3dCYWNrZHJvcCIsIl9zaG93RWxlbWVudCIsIl9oaWRlTW9kYWwiLCJOb2RlIiwiRUxFTUVOVF9OT0RFIiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5IiwicmVtb3ZlQXR0cmlidXRlIiwic2Nyb2xsVG9wIiwiX2VuZm9yY2VGb2N1cyIsImhhcyIsIl9oYW5kbGVVcGRhdGUiLCJfcmVzZXRBZGp1c3RtZW50cyIsIl9yZXNldFNjcm9sbGJhciIsIl9yZW1vdmVCYWNrZHJvcCIsImFwcGVuZFRvIiwiY3VycmVudFRhcmdldCIsIl9hZGp1c3REaWFsb2ciLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsImNsaWVudFdpZHRoIiwiaW5uZXJXaWR0aCIsIl9nZXRTY3JvbGxiYXJXaWR0aCIsInBhcnNlSW50Iiwib2Zmc2V0V2lkdGgiLCJEZWZhdWx0Iiwib2Zmc2V0IiwibWV0aG9kIiwiQUNUSVZBVEUiLCJTQ1JPTEwiLCJEUk9QRE9XTl9JVEVNIiwiRFJPUERPV05fTUVOVSIsIk5BVl9MSU5LIiwiTkFWIiwiREFUQV9TUFkiLCJMSVNUX0lURU0iLCJMSSIsIkxJX0RST1BET1dOIiwiTkFWX0xJTktTIiwiRFJPUERPV04iLCJEUk9QRE9XTl9JVEVNUyIsIkRST1BET1dOX1RPR0dMRSIsIk9GRlNFVCIsIlBPU0lUSU9OIiwiX3Njcm9sbEVsZW1lbnQiLCJfc2VsZWN0b3IiLCJfb2Zmc2V0cyIsIl90YXJnZXRzIiwiX2FjdGl2ZVRhcmdldCIsIl9zY3JvbGxIZWlnaHQiLCJfcHJvY2VzcyIsInJlZnJlc2giLCJfZ2V0U2Nyb2xsVG9wIiwiX2dldFNjcm9sbEhlaWdodCIsIm1hcCIsInRvcCIsImZpbHRlciIsInNvcnQiLCJmb3JFYWNoIiwicHVzaCIsInBhZ2VZT2Zmc2V0IiwibWF4IiwiX2dldE9mZnNldEhlaWdodCIsImlubmVySGVpZ2h0IiwiX2FjdGl2YXRlIiwiX2NsZWFyIiwiam9pbiIsInBhcmVudHMiLCJBIiwiTElTVCIsIkZBREVfQ0hJTEQiLCJBQ1RJVkVfQ0hJTEQiLCJEUk9QRE9XTl9BQ1RJVkVfQ0hJTEQiLCJfdHJhbnNpdGlvbkNvbXBsZXRlIiwiVGV0aGVyIiwiYW5pbWF0aW9uIiwidGVtcGxhdGUiLCJ0aXRsZSIsImRlbGF5IiwiaHRtbCIsInNlbGVjdG9yIiwicGxhY2VtZW50IiwiY29uc3RyYWludHMiLCJjb250YWluZXIiLCJUT1AiLCJCT1RUT00iLCJPVVQiLCJJTlNFUlRFRCIsIkZPQ1VTT1VUIiwiVE9PTFRJUCIsIlRPT0xUSVBfSU5ORVIiLCJlbmFibGVkIiwiSE9WRVIiLCJNQU5VQUwiLCJJIiwiX2lzRW5hYmxlZCIsIl90aW1lb3V0IiwiX2hvdmVyU3RhdGUiLCJfYWN0aXZlVHJpZ2dlciIsIl90ZXRoZXIiLCJjb25maWciLCJ0aXAiLCJfc2V0TGlzdGVuZXJzIiwiZW5hYmxlIiwiZGlzYWJsZSIsInRvZ2dsZUVuYWJsZWQiLCJEQVRBX0tFWSIsIl9nZXREZWxlZ2F0ZUNvbmZpZyIsImNsaWNrIiwiX2lzV2l0aEFjdGl2ZVRyaWdnZXIiLCJfZW50ZXIiLCJfbGVhdmUiLCJnZXRUaXBFbGVtZW50IiwiY2xlYXJUaW1lb3V0IiwiY2xlYW51cFRldGhlciIsIkVWRU5UX0tFWSIsImlzV2l0aENvbnRlbnQiLCJvd25lckRvY3VtZW50IiwiTkFNRSIsInNldENvbnRlbnQiLCJfZ2V0QXR0YWNobWVudCIsImF0dGFjaG1lbnQiLCJjbGFzc2VzIiwiY2xhc3NQcmVmaXgiLCJhZGRUYXJnZXRDbGFzc2VzIiwicG9zaXRpb24iLCJfVFJBTlNJVElPTl9EVVJBVElPTiIsImdldFRpdGxlIiwic2V0RWxlbWVudENvbnRlbnQiLCJlbXB0eSIsImFwcGVuZCIsInRleHQiLCJkZXN0cm95IiwiX2ZpeFRpdGxlIiwiRGVmYXVsdFR5cGUiLCJjb250ZW50IiwiVElUTEUiLCJDT05URU5UIiwiX2dldENvbnRlbnQiLCJzZXRGb2N1c1ZhbHVlIiwidmFsIiwiY29sbGFwc2VBbGwiLCJhY2NvcmRpb24iLCJhY3Rpb24iLCJjb2xsYXBzZSIsInByb3AiLCJlZGl0SW5saW5lRWRpdGFibGUiLCJjaGFuZ2UiLCJjb25zb2xlIiwibG9nIiwic2Nyb2xsIiwiYWRkTWFya2VyIiwibGF0IiwibG9uZyIsImNvbnRlbnRTdHJpbmciLCJsYWJlbCIsInVuZGVmaW5lZCIsIm1hcmtlciIsIk1hcmtlciIsImdvb2dsZSIsIm1hcHMiLCJMYXRMbmciLCJpY29uIiwibWFwX2ljb25fbGFiZWwiLCJpbmZvd2luZG93IiwiSW5mb1dpbmRvdyIsIm1heFdpZHRoIiwiYWRkTGlzdGVuZXIiLCJvcGVuIiwibXVsdGlfc2VsZWN0X3JhZGlvU2VsZWN0ZWQiLCJzbGlkZVVwIiwic2xpZGVUb2dnbGUiLCJzbGlkZURvd24iXSwibWFwcGluZ3MiOiI7O0FBQ0EsU0FBU0E7SUFFTCxJQUFJQyxZQUFZQyxFQUFFO0lBRWxCLElBQUdELFVBQVVFLFVBQVUsR0FDdkI7UUFFSUQsRUFBRSxpQkFBaUJFO1dBQ2xCO1FBQ0RGLEVBQUUsaUJBQWlCRzs7OztBQUszQixTQUFTQyxpQkFBa0JDO0lBQ3ZCLElBQUlDLGtCQUFrQk4sRUFBRTtJQUN4QixJQUFJSyxRQUFRRSxTQUFTO1FBRWpCRCxnQkFBZ0JFLFlBQVk7UUFHNUJSLEVBQUVLLFNBQVNJLFNBQVNBLFNBQVNDLEtBQUssMEJBQTBCUDtXQUN6RDtRQUVISCxFQUFFSyxTQUFTSSxTQUFTQSxTQUFTQyxLQUFLLDBCQUEwQlI7UUFHNUQsSUFBSVMsSUFBSTtRQUNSWCxFQUFFLGtDQUFrQ1ksS0FBSztZQUNyQ0Q7O1FBRUosSUFBSUEsSUFBSSxHQUFHO1lBQ1BMLGdCQUFnQk8sU0FBUzs7Ozs7QUFXckMsU0FBU0MsbUJBQW1CQyxRQUFRQztJQUNoQyxJQUFHaEIsRUFBRWUsUUFBUUwsS0FBSyxhQUFhTyxTQUFTLG1CQUN4QztRQUNJakIsRUFBRWdCLFVBQVVFLE1BQU07Ozs7OztBQy9DMUIsU0FBU0MsUUFBUUM7SUFDZixJQUFJQSxN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O1FBQ3JEMWMsRUFBRXlFLE1BQU1oRSxTQUFTQSxTQUFTa0osWUFBWTs7OztBQU05QzNKLEVBQUUsaUJBQWlCMlksTUFBTTtJQUVqQjNZLEVBQUUsc0VBQXNFUSxZQUFZO0lBQ3BGUixFQUFFLHNCQUFzQnljO0lBR3hCemMsRUFBRXlFLE1BQU1oRSxTQUFTQSxTQUFTd0wsT0FBT0EsS0FBSyxzQkFBc0IwUTtJQUM1RDNjLEVBQUV5RSxNQUFNaEUsU0FBU0EsU0FBU3dMLEtBQUsscUJBQXFCcEwsU0FBUztJQUM3RGIsRUFBRXlFLE1BQU1oRSxTQUFTQSxTQUFTd0wsT0FBT3ZMLEtBQUssbURBQW1ERyxTQUFTOzs7QUFJMUdiLEVBQUUsYUFBYTZJLEdBQUcscUJBQXFCLFNBQVNwSDtJQUN4QyxLQUFJekIsRUFBRXlCLEVBQUVFLFFBQVFWLFNBQVMsNEJBQTJCO1FBQ2hEakIsRUFBRXlFLE1BQU00SCxPQUFPM0wsS0FBSyxrQkFBa0JGLFlBQVksaUJBQWlCSyxTQUFTO1FBQzVFYixFQUFFeUUsTUFBTTRILE9BQU8zTCxLQUFLLGFBQWFQO1FBQ2pDSCxFQUFFeUUsTUFBTTRILE9BQU8zTCxLQUFLLGFBQWFSOztHQUV0QzJJLEdBQUcsc0JBQXNCLFNBQVNwSDtJQUNqQyxLQUFJekIsRUFBRXlCLEVBQUVFLFFBQVFWLFNBQVMsNEJBQTJCO1FBQ2hEakIsRUFBRXlFLE1BQU00SCxPQUFPM0wsS0FBSyxnQkFBZ0JGLFlBQVksZUFBZUssU0FBUztRQUN4RWIsRUFBRXlFLE1BQU00SCxPQUFPM0wsS0FBSyxhQUFhUjtRQUNqQ0YsRUFBRXlFLE1BQU00SCxPQUFPM0wsS0FBSyxhQUFhUDs7Ozs7O0NUekM3QyxTQUFBSCxHQUFBOEUsUUFBU2hGLFVBQUFBO0lBRUw7R0FLSUUsUUFBRThFLFFBQUFFIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBXaGVuIGEgcmVtb3ZlIGZpZWxkIGlzIGNsaWNrZWRcclxuZnVuY3Rpb24gY291bnRyeV9yZW1vdmVkKClcclxue1xyXG4gICAgdmFyIGNvdW50cmllcyA9ICQoJyNjb3VudHJpZXNfcGFyZW50IHNlbGVjdCcpO1xyXG5cclxuICAgIGlmKGNvdW50cmllcy5sZW5ndGggPD0gMSlcclxuICAgIHtcclxuICAgICAgICAvLyBoaWRlIHRoZSByZW1vdmUgbGlua3NcclxuICAgICAgICAkKCcucmVtb3ZlX2ZpZWxkJykuaGlkZSgpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJCgnLnJlbW92ZV9maWVsZCcpLnNob3coKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gR2VuZXJpYyBwcmVwYXJlZG5lc3MgYWN0aW9uIGl0ZW1cclxuZnVuY3Rpb24gZ3BhQWN0aW9uQ2hhbmdlZCggZWxlbWVudCApIHtcclxuICAgIHZhciBhZGRBY3Rpb25CdXR0b24gPSAkKFwiI2FkZC1hY3Rpb24tYnRuXCIpO1xyXG4gICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xyXG4gICAgICAgIC8vIEVuYWJsZSB0aGUgYWRkIGFjdGlvbiBidXR0b25cclxuICAgICAgICBhZGRBY3Rpb25CdXR0b24ucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTaG93IGRlcGFydG1lbnQgZHJvcGRvd25cclxuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuZ3BhX2FjdGlvbl9kZXBhcnRtZW50XCIpLnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSGlkZSBkZXBhcnRtZW50IGRyb3Bkb3duXHJcbiAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiLmdwYV9hY3Rpb25fZGVwYXJ0bWVudFwiKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIC8vIERpc2FibGUgdGhlIGFkZCBhY3Rpb24gYnV0dG9uIGlmIHRoZXJlIGFyZSBubyBjaGVja2VkIGFjdGlvbnNcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgJChcImlucHV0W25hbWU9Z3BhX2FjdGlvbl06Y2hlY2tlZFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGkgPCAxKSB7XHJcbiAgICAgICAgICAgIGFkZEFjdGlvbkJ1dHRvbi5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbi8qXHJcbiogVmVyaWZ5IGlmIHRoZSBBZGQgZGVwYXJ0bWVudCBvcHRpb24gaXMgc2VsZWN0ZWQgYW5kIG9wZW4gdGhlIG1vZGFsIHdpbmRvd1xyXG4qXHJcbiogQHBhcmFtIE9iamVjdCBzZWxlY3QgICAgICBUaGUgc2VsZWN0IE9iamVjdFxyXG4qIEBwYXJhbSBzdHJpbmcgbW9kYWxfaWQgICAgVGhlIG1vZGFsIGlkIHRvIG9wZW5cclxuKi9cclxuZnVuY3Rpb24gYWRkRGVwYXJ0bWVudE1vZGFsKHNlbGVjdCwgbW9kYWxfaWQpe1xyXG4gICAgaWYoJChzZWxlY3QpLmZpbmQoXCI6c2VsZWN0ZWRcIikuaGFzQ2xhc3MoJ2FkZC1kZXBhcnRtZW50JykpXHJcbiAgICB7XHJcbiAgICAgICAgJChtb2RhbF9pZCkubW9kYWwoJ3Nob3cnKTtcclxuICAgIH1cclxufSIsImZ1bmN0aW9uIHJlYWRVUkwoaW5wdXQpIHtcclxuICBpZiAoaW5wdXQuZmlsZXMgJiYgaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIFxyXG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICQoJy5BZ2VuY3ktZGV0YWlsc19fbG9nb19fcHJldmlldycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGUudGFyZ2V0LnJlc3VsdCArICcpJyk7XHJcbiAgICAgICAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5hZGRDbGFzcygnU2VsZWN0ZWQnKVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbnB1dC5maWxlc1swXSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcmV2aWV3TG9nbyhsb2dvSW1hZ2Upe1xyXG4gICAgcmVhZFVSTChsb2dvSW1hZ2UpO1xyXG4gICAgJChcIiNzZWxlY3QtbG9nb1wiKS5oaWRlKCk7XHJcbiAgICAkKFwiI3JlcGxhY2UtbG9nb1wiKS5zaG93KCk7XHJcbiAgICAkKFwiI3JlbW92ZS1sb2dvXCIpLnNob3coKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdHJpZ2dlclByZXZpZXdMb2dvKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAkKFwiI2ltZ0lucFwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVMb2dvUHJldmlldyhlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQoXCIjcmVwbGFjZS1sb2dvXCIpLmhpZGUoKTtcclxuICAgICQoXCIjcmVtb3ZlLWxvZ29cIikuaGlkZSgpO1xyXG4gICAgJChcIiNzZWxlY3QtbG9nb1wiKS5zaG93KCk7XHJcbiAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xyXG4gICAgJCgnLkFnZW5jeS1kZXRhaWxzX19sb2dvX19wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ1NlbGVjdGVkJyk7XHJcbn0iLCIvKiFcclxuICogQm9vdHN0cmFwIHY0LjAuMC1hbHBoYS42IChodHRwczovL2dldGJvb3RzdHJhcC5jb20pXHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTcgVGhlIEJvb3RzdHJhcCBBdXRob3JzIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvZ3JhcGhzL2NvbnRyaWJ1dG9ycylcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICovXHJcbmlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBqUXVlcnkpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkuIGpRdWVyeSBtdXN0IGJlIGluY2x1ZGVkIGJlZm9yZSBCb290c3RyYXAncyBKYXZhU2NyaXB0LlwiKTsrZnVuY3Rpb24odCl7dmFyIGU9dC5mbi5qcXVlcnkuc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiLlwiKTtpZihlWzBdPDImJmVbMV08OXx8MT09ZVswXSYmOT09ZVsxXSYmZVsyXTwxfHxlWzBdPj00KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgYXQgbGVhc3QgalF1ZXJ5IHYxLjkuMSBidXQgbGVzcyB0aGFuIHY0LjAuMFwiKX0oalF1ZXJ5KSwrZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFlfHxcIm9iamVjdFwiIT10eXBlb2YgZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT90OmV9ZnVuY3Rpb24gZSh0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBlKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LGUpOnQuX19wcm90b19fPWUpfWZ1bmN0aW9uIG4odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LG89ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKSxyPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7cmV0dXJue30udG9TdHJpbmcuY2FsbCh0KS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIG4odCl7cmV0dXJuKHRbMF18fHQpLm5vZGVUeXBlfWZ1bmN0aW9uIGkoKXtyZXR1cm57YmluZFR5cGU6YS5lbmQsZGVsZWdhdGVUeXBlOmEuZW5kLGhhbmRsZTpmdW5jdGlvbihlKXtpZih0KGUudGFyZ2V0KS5pcyh0aGlzKSlyZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fX1mdW5jdGlvbiBvKCl7aWYod2luZG93LlFVbml0KXJldHVybiExO3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib290c3RyYXBcIik7Zm9yKHZhciBlIGluIGgpaWYodm9pZCAwIT09dC5zdHlsZVtlXSlyZXR1cm57ZW5kOmhbZV19O3JldHVybiExfWZ1bmN0aW9uIHIoZSl7dmFyIG49dGhpcyxpPSExO3JldHVybiB0KHRoaXMpLm9uZShjLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKCl7aT0hMH0pLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpfHxjLnRyaWdnZXJUcmFuc2l0aW9uRW5kKG4pfSxlKSx0aGlzfWZ1bmN0aW9uIHMoKXthPW8oKSx0LmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kPXIsYy5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHQuZXZlbnQuc3BlY2lhbFtjLlRSQU5TSVRJT05fRU5EXT1pKCkpfXZhciBhPSExLGw9MWU2LGg9e1dlYmtpdFRyYW5zaXRpb246XCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCIsTW96VHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIixPVHJhbnNpdGlvbjpcIm9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kXCIsdHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIn0sYz17VFJBTlNJVElPTl9FTkQ6XCJic1RyYW5zaXRpb25FbmRcIixnZXRVSUQ6ZnVuY3Rpb24odCl7ZG8gdCs9fn4oTWF0aC5yYW5kb20oKSpsKTt3aGlsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0KSk7cmV0dXJuIHR9LGdldFNlbGVjdG9yRnJvbUVsZW1lbnQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhcmdldFwiKTtyZXR1cm4gZXx8KGU9dC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfHxcIlwiLGU9L14jW2Etel0vaS50ZXN0KGUpP2U6bnVsbCksZX0scmVmbG93OmZ1bmN0aW9uKHQpe3JldHVybiB0Lm9mZnNldEhlaWdodH0sdHJpZ2dlclRyYW5zaXRpb25FbmQ6ZnVuY3Rpb24oZSl7dChlKS50cmlnZ2VyKGEuZW5kKX0sc3VwcG9ydHNUcmFuc2l0aW9uRW5kOmZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4oYSl9LHR5cGVDaGVja0NvbmZpZzpmdW5jdGlvbih0LGksbyl7Zm9yKHZhciByIGluIG8paWYoby5oYXNPd25Qcm9wZXJ0eShyKSl7dmFyIHM9b1tyXSxhPWlbcl0sbD1hJiZuKGEpP1wiZWxlbWVudFwiOmUoYSk7aWYoIW5ldyBSZWdFeHAocykudGVzdChsKSl0aHJvdyBuZXcgRXJyb3IodC50b1VwcGVyQ2FzZSgpK1wiOiBcIisoJ09wdGlvbiBcIicrcisnXCIgcHJvdmlkZWQgdHlwZSBcIicrbCsnXCIgJykrKCdidXQgZXhwZWN0ZWQgdHlwZSBcIicrcysnXCIuJykpfX19O3JldHVybiBzKCksY30oalF1ZXJ5KSxzPShmdW5jdGlvbih0KXt2YXIgZT1cImFsZXJ0XCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMuYWxlcnRcIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTE1MCx1PXtESVNNSVNTOidbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nfSxkPXtDTE9TRTpcImNsb3NlXCIrYSxDTE9TRUQ6XCJjbG9zZWRcIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGY9e0FMRVJUOlwiYWxlcnRcIixGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKHQpe3Q9dHx8dGhpcy5fZWxlbWVudDt2YXIgZT10aGlzLl9nZXRSb290RWxlbWVudCh0KSxuPXRoaXMuX3RyaWdnZXJDbG9zZUV2ZW50KGUpO24uaXNEZWZhdWx0UHJldmVudGVkKCl8fHRoaXMuX3JlbW92ZUVsZW1lbnQoZSl9LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxzKSx0aGlzLl9lbGVtZW50PW51bGx9LGUucHJvdG90eXBlLl9nZXRSb290RWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSksaT0hMTtyZXR1cm4gbiYmKGk9dChuKVswXSksaXx8KGk9dChlKS5jbG9zZXN0KFwiLlwiK2YuQUxFUlQpWzBdKSxpfSxlLnByb3RvdHlwZS5fdHJpZ2dlckNsb3NlRXZlbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dC5FdmVudChkLkNMT1NFKTtyZXR1cm4gdChlKS50cmlnZ2VyKG4pLG59LGUucHJvdG90eXBlLl9yZW1vdmVFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7cmV0dXJuIHQoZSkucmVtb3ZlQ2xhc3MoZi5TSE9XKSxyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KGUpLmhhc0NsYXNzKGYuRkFERSk/dm9pZCB0KGUpLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKHQpe3JldHVybiBuLl9kZXN0cm95RWxlbWVudChlLHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYyk6dm9pZCB0aGlzLl9kZXN0cm95RWxlbWVudChlKX0sZS5wcm90b3R5cGUuX2Rlc3Ryb3lFbGVtZW50PWZ1bmN0aW9uKGUpe3QoZSkuZGV0YWNoKCkudHJpZ2dlcihkLkNMT1NFRCkucmVtb3ZlKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJjbG9zZVwiPT09biYmb1tuXSh0aGlzKX0pfSxlLl9oYW5kbGVEaXNtaXNzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXtlJiZlLnByZXZlbnREZWZhdWx0KCksdC5jbG9zZSh0aGlzKX19LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihkLkNMSUNLX0RBVEFfQVBJLHUuRElTTUlTUyxfLl9oYW5kbGVEaXNtaXNzKG5ldyBfKSksdC5mbltlXT1fLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1fLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsXy5falF1ZXJ5SW50ZXJmYWNlfSxffShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiYnV0dG9uXCIsaT1cIjQuMC4wLWFscGhhLjZcIixyPVwiYnMuYnV0dG9uXCIscz1cIi5cIityLGE9XCIuZGF0YS1hcGlcIixsPXQuZm5bZV0saD17QUNUSVZFOlwiYWN0aXZlXCIsQlVUVE9OOlwiYnRuXCIsRk9DVVM6XCJmb2N1c1wifSxjPXtEQVRBX1RPR0dMRV9DQVJST1Q6J1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJyxJTlBVVDpcImlucHV0XCIsQUNUSVZFOlwiLmFjdGl2ZVwiLEJVVFRPTjpcIi5idG5cIn0sdT17Q0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK3MrYSxGT0NVU19CTFVSX0RBVEFfQVBJOlwiZm9jdXNcIitzK2ErXCIgXCIrKFwiYmx1clwiK3MrYSl9LGQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3ZhciBlPSEwLG49dCh0aGlzLl9lbGVtZW50KS5jbG9zZXN0KGMuREFUQV9UT0dHTEUpWzBdO2lmKG4pe3ZhciBpPXQodGhpcy5fZWxlbWVudCkuZmluZChjLklOUFVUKVswXTtpZihpKXtpZihcInJhZGlvXCI9PT1pLnR5cGUpaWYoaS5jaGVja2VkJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSllPSExO2Vsc2V7dmFyIG89dChuKS5maW5kKGMuQUNUSVZFKVswXTtvJiZ0KG8pLnJlbW92ZUNsYXNzKGguQUNUSVZFKX1lJiYoaS5jaGVja2VkPSF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGguQUNUSVZFKSx0KGkpLnRyaWdnZXIoXCJjaGFuZ2VcIikpLGkuZm9jdXMoKX19dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXByZXNzZWRcIiwhdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSkpLGUmJnQodGhpcy5fZWxlbWVudCkudG9nZ2xlQ2xhc3MoaC5BQ1RJVkUpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsciksdGhpcy5fZWxlbWVudD1udWxsfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShyKTtpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocixpKSksXCJ0b2dnbGVcIj09PW4mJmlbbl0oKX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxjLkRBVEFfVE9HR0xFX0NBUlJPVCxmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIG49ZS50YXJnZXQ7dChuKS5oYXNDbGFzcyhoLkJVVFRPTil8fChuPXQobikuY2xvc2VzdChjLkJVVFRPTikpLGQuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJ0b2dnbGVcIil9KS5vbih1LkZPQ1VTX0JMVVJfREFUQV9BUEksYy5EQVRBX1RPR0dMRV9DQVJST1QsZnVuY3Rpb24oZSl7dmFyIG49dChlLnRhcmdldCkuY2xvc2VzdChjLkJVVFRPTilbMF07dChuKS50b2dnbGVDbGFzcyhoLkZPQ1VTLC9eZm9jdXMoaW4pPyQvLnRlc3QoZS50eXBlKSl9KSx0LmZuW2VdPWQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPWQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09bCxkLl9qUXVlcnlJbnRlcmZhY2V9LGR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjYXJvdXNlbFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNhcm91c2VsXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD0zNyxmPTM5LF89e2ludGVydmFsOjVlMyxrZXlib2FyZDohMCxzbGlkZTohMSxwYXVzZTpcImhvdmVyXCIsd3JhcDohMH0sZz17aW50ZXJ2YWw6XCIobnVtYmVyfGJvb2xlYW4pXCIsa2V5Ym9hcmQ6XCJib29sZWFuXCIsc2xpZGU6XCIoYm9vbGVhbnxzdHJpbmcpXCIscGF1c2U6XCIoc3RyaW5nfGJvb2xlYW4pXCIsd3JhcDpcImJvb2xlYW5cIn0scD17TkVYVDpcIm5leHRcIixQUkVWOlwicHJldlwiLExFRlQ6XCJsZWZ0XCIsUklHSFQ6XCJyaWdodFwifSxtPXtTTElERTpcInNsaWRlXCIrbCxTTElEOlwic2xpZFwiK2wsS0VZRE9XTjpcImtleWRvd25cIitsLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrbCxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2gsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sRT17Q0FST1VTRUw6XCJjYXJvdXNlbFwiLEFDVElWRTpcImFjdGl2ZVwiLFNMSURFOlwic2xpZGVcIixSSUdIVDpcImNhcm91c2VsLWl0ZW0tcmlnaHRcIixMRUZUOlwiY2Fyb3VzZWwtaXRlbS1sZWZ0XCIsTkVYVDpcImNhcm91c2VsLWl0ZW0tbmV4dFwiLFBSRVY6XCJjYXJvdXNlbC1pdGVtLXByZXZcIixJVEVNOlwiY2Fyb3VzZWwtaXRlbVwifSx2PXtBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0lURU06XCIuYWN0aXZlLmNhcm91c2VsLWl0ZW1cIixJVEVNOlwiLmNhcm91c2VsLWl0ZW1cIixORVhUX1BSRVY6XCIuY2Fyb3VzZWwtaXRlbS1uZXh0LCAuY2Fyb3VzZWwtaXRlbS1wcmV2XCIsSU5ESUNBVE9SUzpcIi5jYXJvdXNlbC1pbmRpY2F0b3JzXCIsREFUQV9TTElERTpcIltkYXRhLXNsaWRlXSwgW2RhdGEtc2xpZGUtdG9dXCIsREFUQV9SSURFOidbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nfSxUPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaChlLGkpe24odGhpcyxoKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2ludGVydmFsPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2lzUGF1c2VkPSExLHRoaXMuX2lzU2xpZGluZz0hMSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX2VsZW1lbnQ9dChlKVswXSx0aGlzLl9pbmRpY2F0b3JzRWxlbWVudD10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5JTkRJQ0FUT1JTKVswXSx0aGlzLl9hZGRFdmVudExpc3RlbmVycygpfXJldHVybiBoLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7aWYodGhpcy5faXNTbGlkaW5nKXRocm93IG5ldyBFcnJvcihcIkNhcm91c2VsIGlzIHNsaWRpbmdcIik7dGhpcy5fc2xpZGUocC5ORVhUKX0saC5wcm90b3R5cGUubmV4dFdoZW5WaXNpYmxlPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuaGlkZGVufHx0aGlzLm5leHQoKX0saC5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe2lmKHRoaXMuX2lzU2xpZGluZyl0aHJvdyBuZXcgRXJyb3IoXCJDYXJvdXNlbCBpcyBzbGlkaW5nXCIpO3RoaXMuX3NsaWRlKHAuUFJFVklPVVMpfSxoLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihlKXtlfHwodGhpcy5faXNQYXVzZWQ9ITApLHQodGhpcy5fZWxlbWVudCkuZmluZCh2Lk5FWFRfUFJFVilbMF0mJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihyLnRyaWdnZXJUcmFuc2l0aW9uRW5kKHRoaXMuX2VsZW1lbnQpLHRoaXMuY3ljbGUoITApKSxjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsKSx0aGlzLl9pbnRlcnZhbD1udWxsfSxoLnByb3RvdHlwZS5jeWNsZT1mdW5jdGlvbih0KXt0fHwodGhpcy5faXNQYXVzZWQ9ITEpLHRoaXMuX2ludGVydmFsJiYoY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCksdGhpcy5faW50ZXJ2YWw9bnVsbCksdGhpcy5fY29uZmlnLmludGVydmFsJiYhdGhpcy5faXNQYXVzZWQmJih0aGlzLl9pbnRlcnZhbD1zZXRJbnRlcnZhbCgoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlP3RoaXMubmV4dFdoZW5WaXNpYmxlOnRoaXMubmV4dCkuYmluZCh0aGlzKSx0aGlzLl9jb25maWcuaW50ZXJ2YWwpKX0saC5wcm90b3R5cGUudG89ZnVuY3Rpb24oZSl7dmFyIG49dGhpczt0aGlzLl9hY3RpdmVFbGVtZW50PXQodGhpcy5fZWxlbWVudCkuZmluZCh2LkFDVElWRV9JVEVNKVswXTt2YXIgaT10aGlzLl9nZXRJdGVtSW5kZXgodGhpcy5fYWN0aXZlRWxlbWVudCk7aWYoIShlPnRoaXMuX2l0ZW1zLmxlbmd0aC0xfHxlPDApKXtpZih0aGlzLl9pc1NsaWRpbmcpcmV0dXJuIHZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUobS5TTElELGZ1bmN0aW9uKCl7cmV0dXJuIG4udG8oZSl9KTtpZihpPT09ZSlyZXR1cm4gdGhpcy5wYXVzZSgpLHZvaWQgdGhpcy5jeWNsZSgpO3ZhciBvPWU+aT9wLk5FWFQ6cC5QUkVWSU9VUzt0aGlzLl9zbGlkZShvLHRoaXMuX2l0ZW1zW2VdKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9mZihsKSx0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0aGlzLl9pdGVtcz1udWxsLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9pbnRlcnZhbD1udWxsLHRoaXMuX2lzUGF1c2VkPW51bGwsdGhpcy5faXNTbGlkaW5nPW51bGwsdGhpcy5fYWN0aXZlRWxlbWVudD1udWxsLHRoaXMuX2luZGljYXRvcnNFbGVtZW50PW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sXyxuKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZyksbn0saC5wcm90b3R5cGUuX2FkZEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9jb25maWcua2V5Ym9hcmQmJnQodGhpcy5fZWxlbWVudCkub24obS5LRVlET1dOLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9rZXlkb3duKHQpfSksXCJob3ZlclwiIT09dGhpcy5fY29uZmlnLnBhdXNlfHxcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50fHx0KHRoaXMuX2VsZW1lbnQpLm9uKG0uTU9VU0VFTlRFUixmdW5jdGlvbih0KXtyZXR1cm4gZS5wYXVzZSh0KX0pLm9uKG0uTU9VU0VMRUFWRSxmdW5jdGlvbih0KXtyZXR1cm4gZS5jeWNsZSh0KX0pfSxoLnByb3RvdHlwZS5fa2V5ZG93bj1mdW5jdGlvbih0KXtpZighL2lucHV0fHRleHRhcmVhL2kudGVzdCh0LnRhcmdldC50YWdOYW1lKSlzd2l0Y2godC53aGljaCl7Y2FzZSBkOnQucHJldmVudERlZmF1bHQoKSx0aGlzLnByZXYoKTticmVhaztjYXNlIGY6dC5wcmV2ZW50RGVmYXVsdCgpLHRoaXMubmV4dCgpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufX0saC5wcm90b3R5cGUuX2dldEl0ZW1JbmRleD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5faXRlbXM9dC5tYWtlQXJyYXkodChlKS5wYXJlbnQoKS5maW5kKHYuSVRFTSkpLHRoaXMuX2l0ZW1zLmluZGV4T2YoZSl9LGgucHJvdG90eXBlLl9nZXRJdGVtQnlEaXJlY3Rpb249ZnVuY3Rpb24odCxlKXt2YXIgbj10PT09cC5ORVhULGk9dD09PXAuUFJFVklPVVMsbz10aGlzLl9nZXRJdGVtSW5kZXgoZSkscj10aGlzLl9pdGVtcy5sZW5ndGgtMSxzPWkmJjA9PT1vfHxuJiZvPT09cjtpZihzJiYhdGhpcy5fY29uZmlnLndyYXApcmV0dXJuIGU7dmFyIGE9dD09PXAuUFJFVklPVVM/LTE6MSxsPShvK2EpJXRoaXMuX2l0ZW1zLmxlbmd0aDtyZXR1cm4gbD09PS0xP3RoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aC0xXTp0aGlzLl9pdGVtc1tsXX0saC5wcm90b3R5cGUuX3RyaWdnZXJTbGlkZUV2ZW50PWZ1bmN0aW9uKGUsbil7dmFyIGk9dC5FdmVudChtLlNMSURFLHtyZWxhdGVkVGFyZ2V0OmUsZGlyZWN0aW9uOm59KTtyZXR1cm4gdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLGl9LGgucHJvdG90eXBlLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50PWZ1bmN0aW9uKGUpe2lmKHRoaXMuX2luZGljYXRvcnNFbGVtZW50KXt0KHRoaXMuX2luZGljYXRvcnNFbGVtZW50KS5maW5kKHYuQUNUSVZFKS5yZW1vdmVDbGFzcyhFLkFDVElWRSk7dmFyIG49dGhpcy5faW5kaWNhdG9yc0VsZW1lbnQuY2hpbGRyZW5bdGhpcy5fZ2V0SXRlbUluZGV4KGUpXTtuJiZ0KG4pLmFkZENsYXNzKEUuQUNUSVZFKX19LGgucHJvdG90eXBlLl9zbGlkZT1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMsbz10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5BQ1RJVkVfSVRFTSlbMF0scz1ufHxvJiZ0aGlzLl9nZXRJdGVtQnlEaXJlY3Rpb24oZSxvKSxhPUJvb2xlYW4odGhpcy5faW50ZXJ2YWwpLGw9dm9pZCAwLGg9dm9pZCAwLGM9dm9pZCAwO2lmKGU9PT1wLk5FWFQ/KGw9RS5MRUZULGg9RS5ORVhULGM9cC5MRUZUKToobD1FLlJJR0hULGg9RS5QUkVWLGM9cC5SSUdIVCkscyYmdChzKS5oYXNDbGFzcyhFLkFDVElWRSkpcmV0dXJuIHZvaWQodGhpcy5faXNTbGlkaW5nPSExKTt2YXIgZD10aGlzLl90cmlnZ2VyU2xpZGVFdmVudChzLGMpO2lmKCFkLmlzRGVmYXVsdFByZXZlbnRlZCgpJiZvJiZzKXt0aGlzLl9pc1NsaWRpbmc9ITAsYSYmdGhpcy5wYXVzZSgpLHRoaXMuX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQocyk7dmFyIGY9dC5FdmVudChtLlNMSUQse3JlbGF0ZWRUYXJnZXQ6cyxkaXJlY3Rpb246Y30pO3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoRS5TTElERSk/KHQocykuYWRkQ2xhc3MoaCksci5yZWZsb3cocyksdChvKS5hZGRDbGFzcyhsKSx0KHMpLmFkZENsYXNzKGwpLHQobykub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24oKXt0KHMpLnJlbW92ZUNsYXNzKGwrXCIgXCIraCkuYWRkQ2xhc3MoRS5BQ1RJVkUpLHQobykucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUrXCIgXCIraCtcIiBcIitsKSxpLl9pc1NsaWRpbmc9ITEsc2V0VGltZW91dChmdW5jdGlvbigpe3JldHVybiB0KGkuX2VsZW1lbnQpLnRyaWdnZXIoZil9LDApfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSkpOih0KG8pLnJlbW92ZUNsYXNzKEUuQUNUSVZFKSx0KHMpLmFkZENsYXNzKEUuQUNUSVZFKSx0aGlzLl9pc1NsaWRpbmc9ITEsdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGYpKSxhJiZ0aGlzLmN5Y2xlKCl9fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPXQuZXh0ZW5kKHt9LF8sdCh0aGlzKS5kYXRhKCkpO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmdC5leHRlbmQobyxlKTt2YXIgcj1cInN0cmluZ1wiPT10eXBlb2YgZT9lOm8uc2xpZGU7aWYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJudW1iZXJcIj09dHlwZW9mIGUpbi50byhlKTtlbHNlIGlmKFwic3RyaW5nXCI9PXR5cGVvZiByKXtpZih2b2lkIDA9PT1uW3JdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytyKydcIicpO25bcl0oKX1lbHNlIG8uaW50ZXJ2YWwmJihuLnBhdXNlKCksbi5jeWNsZSgpKX0pfSxoLl9kYXRhQXBpQ2xpY2tIYW5kbGVyPWZ1bmN0aW9uKGUpe3ZhciBuPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKTtpZihuKXt2YXIgaT10KG4pWzBdO2lmKGkmJnQoaSkuaGFzQ2xhc3MoRS5DQVJPVVNFTCkpe3ZhciBvPXQuZXh0ZW5kKHt9LHQoaSkuZGF0YSgpLHQodGhpcykuZGF0YSgpKSxzPXRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b1wiKTtzJiYoby5pbnRlcnZhbD0hMSksaC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChpKSxvKSxzJiZ0KGkpLmRhdGEoYSkudG8ocyksZS5wcmV2ZW50RGVmYXVsdCgpfX19LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24obS5DTElDS19EQVRBX0FQSSx2LkRBVEFfU0xJREUsVC5fZGF0YUFwaUNsaWNrSGFuZGxlciksdCh3aW5kb3cpLm9uKG0uTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe3Qodi5EQVRBX1JJREUpLmVhY2goZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMpO1QuX2pRdWVyeUludGVyZmFjZS5jYWxsKGUsZS5kYXRhKCkpfSl9KSx0LmZuW2VdPVQuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPVQsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxULl9qUXVlcnlJbnRlcmZhY2V9LFR9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJjb2xsYXBzZVwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLmNvbGxhcHNlXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT02MDAsZD17dG9nZ2xlOiEwLHBhcmVudDpcIlwifSxmPXt0b2dnbGU6XCJib29sZWFuXCIscGFyZW50Olwic3RyaW5nXCJ9LF89e1NIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxnPXtTSE9XOlwic2hvd1wiLENPTExBUFNFOlwiY29sbGFwc2VcIixDT0xMQVBTSU5HOlwiY29sbGFwc2luZ1wiLENPTExBUFNFRDpcImNvbGxhcHNlZFwifSxwPXtXSURUSDpcIndpZHRoXCIsSEVJR0hUOlwiaGVpZ2h0XCJ9LG09e0FDVElWRVM6XCIuY2FyZCA+IC5zaG93LCAuY2FyZCA+IC5jb2xsYXBzaW5nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJ30sRT1mdW5jdGlvbigpe2Z1bmN0aW9uIGwoZSxpKXtuKHRoaXMsbCksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX2VsZW1lbnQ9ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3RyaWdnZXJBcnJheT10Lm1ha2VBcnJheSh0KCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycrZS5pZCsnXCJdLCcrKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnK2UuaWQrJ1wiXScpKSksdGhpcy5fcGFyZW50PXRoaXMuX2NvbmZpZy5wYXJlbnQ/dGhpcy5fZ2V0UGFyZW50KCk6bnVsbCx0aGlzLl9jb25maWcucGFyZW50fHx0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy5fZWxlbWVudCx0aGlzLl90cmlnZ2VyQXJyYXkpLHRoaXMuX2NvbmZpZy50b2dnbGUmJnRoaXMudG9nZ2xlKCl9cmV0dXJuIGwucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3QodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKT90aGlzLmhpZGUoKTp0aGlzLnNob3coKX0sbC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIkNvbGxhcHNlIGlzIHRyYW5zaXRpb25pbmdcIik7aWYoIXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuX3BhcmVudCYmKG49dC5tYWtlQXJyYXkodCh0aGlzLl9wYXJlbnQpLmZpbmQobS5BQ1RJVkVTKSksbi5sZW5ndGh8fChuPW51bGwpKSwhKG4mJihpPXQobikuZGF0YShhKSxpJiZpLl9pc1RyYW5zaXRpb25pbmcpKSl7dmFyIG89dC5FdmVudChfLlNIT1cpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihvKSwhby5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7biYmKGwuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksXCJoaWRlXCIpLGl8fHQobikuZGF0YShhLG51bGwpKTt2YXIgcz10aGlzLl9nZXREaW1lbnNpb24oKTt0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0UpLmFkZENsYXNzKGcuQ09MTEFQU0lORyksdGhpcy5fZWxlbWVudC5zdHlsZVtzXT0wLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIGg9ZnVuY3Rpb24oKXt0KGUuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0lORykuYWRkQ2xhc3MoZy5DT0xMQVBTRSkuYWRkQ2xhc3MoZy5TSE9XKSxlLl9lbGVtZW50LnN0eWxlW3NdPVwiXCIsZS5zZXRUcmFuc2l0aW9uaW5nKCExKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIoXy5TSE9XTil9O2lmKCFyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpKXJldHVybiB2b2lkIGgoKTt2YXIgYz1zWzBdLnRvVXBwZXJDYXNlKCkrcy5zbGljZSgxKSxkPVwic2Nyb2xsXCIrYzt0KHRoaXMuX2VsZW1lbnQpLm9uZShyLlRSQU5TSVRJT05fRU5ELGgpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpLHRoaXMuX2VsZW1lbnQuc3R5bGVbc109dGhpcy5fZWxlbWVudFtkXStcInB4XCJ9fX19LGwucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJDb2xsYXBzZSBpcyB0cmFuc2l0aW9uaW5nXCIpO2lmKHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZy5TSE9XKSl7dmFyIG49dC5FdmVudChfLkhJREUpO2lmKHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihuKSwhbi5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7dmFyIGk9dGhpcy5fZ2V0RGltZW5zaW9uKCksbz1pPT09cC5XSURUSD9cIm9mZnNldFdpZHRoXCI6XCJvZmZzZXRIZWlnaHRcIjt0aGlzLl9lbGVtZW50LnN0eWxlW2ldPXRoaXMuX2VsZW1lbnRbb10rXCJweFwiLHIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MoZy5DT0xMQVBTSU5HKS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFKS5yZW1vdmVDbGFzcyhnLlNIT1cpLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoJiZ0KHRoaXMuX3RyaWdnZXJBcnJheSkuYWRkQ2xhc3MoZy5DT0xMQVBTRUQpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuc2V0VHJhbnNpdGlvbmluZyghMCk7dmFyIHM9ZnVuY3Rpb24oKXtlLnNldFRyYW5zaXRpb25pbmcoITEpLHQoZS5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTSU5HKS5hZGRDbGFzcyhnLkNPTExBUFNFKS50cmlnZ2VyKF8uSElEREVOKX07cmV0dXJuIHRoaXMuX2VsZW1lbnQuc3R5bGVbaV09XCJcIixyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpP3ZvaWQgdCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTp2b2lkIHMoKX19fSxsLnByb3RvdHlwZS5zZXRUcmFuc2l0aW9uaW5nPWZ1bmN0aW9uKHQpe3RoaXMuX2lzVHJhbnNpdGlvbmluZz10fSxsLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fcGFyZW50PW51bGwsdGhpcy5fZWxlbWVudD1udWxsLHRoaXMuX3RyaWdnZXJBcnJheT1udWxsLHRoaXMuX2lzVHJhbnNpdGlvbmluZz1udWxsfSxsLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LGQsbiksbi50b2dnbGU9Qm9vbGVhbihuLnRvZ2dsZSksci50eXBlQ2hlY2tDb25maWcoZSxuLGYpLG59LGwucHJvdG90eXBlLl9nZXREaW1lbnNpb249ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKHAuV0lEVEgpO3JldHVybiBlP3AuV0lEVEg6cC5IRUlHSFR9LGwucHJvdG90eXBlLl9nZXRQYXJlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dCh0aGlzLl9jb25maWcucGFyZW50KVswXSxpPSdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicrdGhpcy5fY29uZmlnLnBhcmVudCsnXCJdJztyZXR1cm4gdChuKS5maW5kKGkpLmVhY2goZnVuY3Rpb24odCxuKXtlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MobC5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQobiksW25dKX0pLG59LGwucHJvdG90eXBlLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3M9ZnVuY3Rpb24oZSxuKXtpZihlKXt2YXIgaT10KGUpLmhhc0NsYXNzKGcuU0hPVyk7ZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsaSksbi5sZW5ndGgmJnQobikudG9nZ2xlQ2xhc3MoZy5DT0xMQVBTRUQsIWkpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsaSl9fSxsLl9nZXRUYXJnZXRGcm9tRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIG4/dChuKVswXTpudWxsfSxsLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcyksbz1uLmRhdGEoYSkscj10LmV4dGVuZCh7fSxkLG4uZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYoIW8mJnIudG9nZ2xlJiYvc2hvd3xoaWRlLy50ZXN0KGUpJiYoci50b2dnbGU9ITEpLG98fChvPW5ldyBsKHRoaXMsciksbi5kYXRhKGEsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1vW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO29bZV0oKX19KX0sbyhsLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX1dKSxsfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihfLkNMSUNLX0RBVEFfQVBJLG0uREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBuPUUuX2dldFRhcmdldEZyb21FbGVtZW50KHRoaXMpLGk9dChuKS5kYXRhKGEpLG89aT9cInRvZ2dsZVwiOnQodGhpcykuZGF0YSgpO0UuX2pRdWVyeUludGVyZmFjZS5jYWxsKHQobiksbyl9KSx0LmZuW2VdPUUuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPUUsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxFLl9qUXVlcnlJbnRlcmZhY2V9LEV9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJkcm9wZG93blwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLmRyb3Bkb3duXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0yNyx1PTM4LGQ9NDAsZj0zLF89e0hJREU6XCJoaWRlXCIrYSxISURERU46XCJoaWRkZW5cIithLFNIT1c6XCJzaG93XCIrYSxTSE9XTjpcInNob3duXCIrYSxDTElDSzpcImNsaWNrXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsLEZPQ1VTSU5fREFUQV9BUEk6XCJmb2N1c2luXCIrYStsLEtFWURPV05fREFUQV9BUEk6XCJrZXlkb3duXCIrYStsfSxnPXtCQUNLRFJPUDpcImRyb3Bkb3duLWJhY2tkcm9wXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLFNIT1c6XCJzaG93XCJ9LHA9e0JBQ0tEUk9QOlwiLmRyb3Bkb3duLWJhY2tkcm9wXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxGT1JNX0NISUxEOlwiLmRyb3Bkb3duIGZvcm1cIixST0xFX01FTlU6J1tyb2xlPVwibWVudVwiXScsUk9MRV9MSVNUQk9YOidbcm9sZT1cImxpc3Rib3hcIl0nLE5BVkJBUl9OQVY6XCIubmF2YmFyLW5hdlwiLFZJU0lCTEVfSVRFTVM6J1tyb2xlPVwibWVudVwiXSBsaTpub3QoLmRpc2FibGVkKSBhLCBbcm9sZT1cImxpc3Rib3hcIl0gbGk6bm90KC5kaXNhYmxlZCkgYSd9LG09ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXQsdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKX1yZXR1cm4gZS5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7aWYodGhpcy5kaXNhYmxlZHx8dCh0aGlzKS5oYXNDbGFzcyhnLkRJU0FCTEVEKSlyZXR1cm4hMTt2YXIgbj1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxpPXQobikuaGFzQ2xhc3MoZy5TSE9XKTtpZihlLl9jbGVhck1lbnVzKCksaSlyZXR1cm4hMTtpZihcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50JiYhdChuKS5jbG9zZXN0KHAuTkFWQkFSX05BVikubGVuZ3RoKXt2YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO28uY2xhc3NOYW1lPWcuQkFDS0RST1AsdChvKS5pbnNlcnRCZWZvcmUodGhpcyksdChvKS5vbihcImNsaWNrXCIsZS5fY2xlYXJNZW51cyl9dmFyIHI9e3JlbGF0ZWRUYXJnZXQ6dGhpc30scz10LkV2ZW50KF8uU0hPVyxyKTtyZXR1cm4gdChuKS50cmlnZ2VyKHMpLCFzLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYodGhpcy5mb2N1cygpLHRoaXMuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0KG4pLnRvZ2dsZUNsYXNzKGcuU0hPVyksdChuKS50cmlnZ2VyKHQuRXZlbnQoXy5TSE9XTixyKSksITEpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQscyksdCh0aGlzLl9lbGVtZW50KS5vZmYoYSksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLm9uKF8uQ0xJQ0ssdGhpcy50b2dnbGUpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcykuZGF0YShzKTtpZihpfHwoaT1uZXcgZSh0aGlzKSx0KHRoaXMpLmRhdGEocyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PWlbbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7aVtuXS5jYWxsKHRoaXMpfX0pfSxlLl9jbGVhck1lbnVzPWZ1bmN0aW9uKG4pe2lmKCFufHxuLndoaWNoIT09Zil7dmFyIGk9dChwLkJBQ0tEUk9QKVswXTtpJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSk7Zm9yKHZhciBvPXQubWFrZUFycmF5KHQocC5EQVRBX1RPR0dMRSkpLHI9MDtyPG8ubGVuZ3RoO3IrKyl7dmFyIHM9ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQob1tyXSksYT17cmVsYXRlZFRhcmdldDpvW3JdfTtpZih0KHMpLmhhc0NsYXNzKGcuU0hPVykmJiEobiYmKFwiY2xpY2tcIj09PW4udHlwZSYmL2lucHV0fHRleHRhcmVhL2kudGVzdChuLnRhcmdldC50YWdOYW1lKXx8XCJmb2N1c2luXCI9PT1uLnR5cGUpJiZ0LmNvbnRhaW5zKHMsbi50YXJnZXQpKSl7dmFyIGw9dC5FdmVudChfLkhJREUsYSk7dChzKS50cmlnZ2VyKGwpLGwuaXNEZWZhdWx0UHJldmVudGVkKCl8fChvW3JdLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIixcImZhbHNlXCIpLHQocykucmVtb3ZlQ2xhc3MoZy5TSE9XKS50cmlnZ2VyKHQuRXZlbnQoXy5ISURERU4sYSkpKX19fX0sZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dm9pZCAwLGk9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBpJiYobj10KGkpWzBdKSxufHxlLnBhcmVudE5vZGV9LGUuX2RhdGFBcGlLZXlkb3duSGFuZGxlcj1mdW5jdGlvbihuKXtpZigvKDM4fDQwfDI3fDMyKS8udGVzdChuLndoaWNoKSYmIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3Qobi50YXJnZXQudGFnTmFtZSkmJihuLnByZXZlbnREZWZhdWx0KCksbi5zdG9wUHJvcGFnYXRpb24oKSwhdGhpcy5kaXNhYmxlZCYmIXQodGhpcykuaGFzQ2xhc3MoZy5ESVNBQkxFRCkpKXt2YXIgaT1lLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKSxvPXQoaSkuaGFzQ2xhc3MoZy5TSE9XKTtpZighbyYmbi53aGljaCE9PWN8fG8mJm4ud2hpY2g9PT1jKXtpZihuLndoaWNoPT09Yyl7dmFyIHI9dChpKS5maW5kKHAuREFUQV9UT0dHTEUpWzBdO3QocikudHJpZ2dlcihcImZvY3VzXCIpfXJldHVybiB2b2lkIHQodGhpcykudHJpZ2dlcihcImNsaWNrXCIpfXZhciBzPXQoaSkuZmluZChwLlZJU0lCTEVfSVRFTVMpLmdldCgpO2lmKHMubGVuZ3RoKXt2YXIgYT1zLmluZGV4T2Yobi50YXJnZXQpO24ud2hpY2g9PT11JiZhPjAmJmEtLSxuLndoaWNoPT09ZCYmYTxzLmxlbmd0aC0xJiZhKyssYTwwJiYoYT0wKSxzW2FdLmZvY3VzKCl9fX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9NRU5VLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5LRVlET1dOX0RBVEFfQVBJLHAuUk9MRV9MSVNUQk9YLG0uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oXy5DTElDS19EQVRBX0FQSStcIiBcIitfLkZPQ1VTSU5fREFUQV9BUEksbS5fY2xlYXJNZW51cykub24oXy5DTElDS19EQVRBX0FQSSxwLkRBVEFfVE9HR0xFLG0ucHJvdG90eXBlLnRvZ2dsZSkub24oXy5DTElDS19EQVRBX0FQSSxwLkZPUk1fQ0hJTEQsZnVuY3Rpb24odCl7dC5zdG9wUHJvcGFnYXRpb24oKX0pLHQuZm5bZV09bS5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9bSx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLG0uX2pRdWVyeUludGVyZmFjZX0sbX0oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cIm1vZGFsXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMubW9kYWxcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PTMwMCxkPTE1MCxmPTI3LF89e2JhY2tkcm9wOiEwLGtleWJvYXJkOiEwLGZvY3VzOiEwLHNob3c6ITB9LGc9e2JhY2tkcm9wOlwiKGJvb2xlYW58c3RyaW5nKVwiLGtleWJvYXJkOlwiYm9vbGVhblwiLGZvY3VzOlwiYm9vbGVhblwiLHNob3c6XCJib29sZWFuXCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsUkVTSVpFOlwicmVzaXplXCIrbCxDTElDS19ESVNNSVNTOlwiY2xpY2suZGlzbWlzc1wiK2wsS0VZRE9XTl9ESVNNSVNTOlwia2V5ZG93bi5kaXNtaXNzXCIrbCxNT1VTRVVQX0RJU01JU1M6XCJtb3VzZXVwLmRpc21pc3NcIitsLE1PVVNFRE9XTl9ESVNNSVNTOlwibW91c2Vkb3duLmRpc21pc3NcIitsLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LG09e1NDUk9MTEJBUl9NRUFTVVJFUjpcIm1vZGFsLXNjcm9sbGJhci1tZWFzdXJlXCIsQkFDS0RST1A6XCJtb2RhbC1iYWNrZHJvcFwiLE9QRU46XCJtb2RhbC1vcGVuXCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtESUFMT0c6XCIubW9kYWwtZGlhbG9nXCIsREFUQV9UT0dHTEU6J1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJyxEQVRBX0RJU01JU1M6J1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsRklYRURfQ09OVEVOVDpcIi5maXhlZC10b3AsIC5maXhlZC1ib3R0b20sIC5pcy1maXhlZCwgLnN0aWNreS10b3BcIn0sdj1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXtuKHRoaXMsaCksdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fZGlhbG9nPXQoZSkuZmluZChFLkRJQUxPRylbMF0sdGhpcy5fYmFja2Ryb3A9bnVsbCx0aGlzLl9pc1Nob3duPSExLHRoaXMuX2lzQm9keU92ZXJmbG93aW5nPSExLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEsdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9MCx0aGlzLl9zY3JvbGxiYXJXaWR0aD0wfXJldHVybiBoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2lzU2hvd24/dGhpcy5oaWRlKCk6dGhpcy5zaG93KHQpfSxoLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpJiYodGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwKTt2YXIgaT10LkV2ZW50KHAuU0hPVyx7cmVsYXRlZFRhcmdldDplfSk7dCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGkpLHRoaXMuX2lzU2hvd258fGkuaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0aGlzLl9pc1Nob3duPSEwLHRoaXMuX2NoZWNrU2Nyb2xsYmFyKCksdGhpcy5fc2V0U2Nyb2xsYmFyKCksdChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhtLk9QRU4pLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxFLkRBVEFfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5oaWRlKHQpfSksdCh0aGlzLl9kaWFsb2cpLm9uKHAuTU9VU0VET1dOX0RJU01JU1MsZnVuY3Rpb24oKXt0KG4uX2VsZW1lbnQpLm9uZShwLk1PVVNFVVBfRElTTUlTUyxmdW5jdGlvbihlKXt0KGUudGFyZ2V0KS5pcyhuLl9lbGVtZW50KSYmKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITApfSl9KSx0aGlzLl9zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtyZXR1cm4gbi5fc2hvd0VsZW1lbnQoZSl9KSl9LGgucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcztpZihlJiZlLnByZXZlbnREZWZhdWx0KCksdGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIk1vZGFsIGlzIHRyYW5zaXRpb25pbmdcIik7dmFyIGk9ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpO2kmJih0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITApO3ZhciBvPXQuRXZlbnQocC5ISURFKTt0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobyksdGhpcy5faXNTaG93biYmIW8uaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLl9pc1Nob3duPSExLHRoaXMuX3NldEVzY2FwZUV2ZW50KCksdGhpcy5fc2V0UmVzaXplRXZlbnQoKSx0KGRvY3VtZW50KS5vZmYocC5GT0NVU0lOKSx0KHRoaXMuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKG0uU0hPVyksdCh0aGlzLl9lbGVtZW50KS5vZmYocC5DTElDS19ESVNNSVNTKSx0KHRoaXMuX2RpYWxvZykub2ZmKHAuTU9VU0VET1dOX0RJU01JU1MpLGk/dCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbih0KXtyZXR1cm4gbi5faGlkZU1vZGFsKHQpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6dGhpcy5faGlkZU1vZGFsKCkpfSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdCh3aW5kb3csZG9jdW1lbnQsdGhpcy5fZWxlbWVudCx0aGlzLl9iYWNrZHJvcCkub2ZmKGwpLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9kaWFsb2c9bnVsbCx0aGlzLl9iYWNrZHJvcD1udWxsLHRoaXMuX2lzU2hvd249bnVsbCx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1udWxsLHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2s9bnVsbCx0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPW51bGwsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxfLG4pLHIudHlwZUNoZWNrQ29uZmlnKGUsbixnKSxufSxoLnByb3RvdHlwZS5fc2hvd0VsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKTt0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUmJnRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFfHxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnQpLHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheT1cImJsb2NrXCIsdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSx0aGlzLl9lbGVtZW50LnNjcm9sbFRvcD0wLGkmJnIucmVmbG93KHRoaXMuX2VsZW1lbnQpLHQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MobS5TSE9XKSx0aGlzLl9jb25maWcuZm9jdXMmJnRoaXMuX2VuZm9yY2VGb2N1cygpO3ZhciBvPXQuRXZlbnQocC5TSE9XTix7cmVsYXRlZFRhcmdldDplfSkscz1mdW5jdGlvbigpe24uX2NvbmZpZy5mb2N1cyYmbi5fZWxlbWVudC5mb2N1cygpLG4uX2lzVHJhbnNpdGlvbmluZz0hMSx0KG4uX2VsZW1lbnQpLnRyaWdnZXIobyl9O2k/dCh0aGlzLl9kaWFsb2cpLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnMoKX0saC5wcm90b3R5cGUuX2VuZm9yY2VGb2N1cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dChkb2N1bWVudCkub2ZmKHAuRk9DVVNJTikub24ocC5GT0NVU0lOLGZ1bmN0aW9uKG4pe2RvY3VtZW50PT09bi50YXJnZXR8fGUuX2VsZW1lbnQ9PT1uLnRhcmdldHx8dChlLl9lbGVtZW50KS5oYXMobi50YXJnZXQpLmxlbmd0aHx8ZS5fZWxlbWVudC5mb2N1cygpfSl9LGgucHJvdG90eXBlLl9zZXRFc2NhcGVFdmVudD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5faXNTaG93biYmdGhpcy5fY29uZmlnLmtleWJvYXJkP3QodGhpcy5fZWxlbWVudCkub24ocC5LRVlET1dOX0RJU01JU1MsZnVuY3Rpb24odCl7dC53aGljaD09PWYmJmUuaGlkZSgpfSk6dGhpcy5faXNTaG93bnx8dCh0aGlzLl9lbGVtZW50KS5vZmYocC5LRVlET1dOX0RJU01JU1MpfSxoLnByb3RvdHlwZS5fc2V0UmVzaXplRXZlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2lzU2hvd24/dCh3aW5kb3cpLm9uKHAuUkVTSVpFLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9oYW5kbGVVcGRhdGUodCl9KTp0KHdpbmRvdykub2ZmKHAuUkVTSVpFKX0saC5wcm90b3R5cGUuX2hpZGVNb2RhbD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksdGhpcy5faXNUcmFuc2l0aW9uaW5nPSExLHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbigpe3QoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MobS5PUEVOKSxlLl9yZXNldEFkanVzdG1lbnRzKCksZS5fcmVzZXRTY3JvbGxiYXIoKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIocC5ISURERU4pfSl9LGgucHJvdG90eXBlLl9yZW1vdmVCYWNrZHJvcD1mdW5jdGlvbigpe3RoaXMuX2JhY2tkcm9wJiYodCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlKCksdGhpcy5fYmFja2Ryb3A9bnVsbCl9LGgucHJvdG90eXBlLl9zaG93QmFja2Ryb3A9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKT9tLkZBREU6XCJcIjtpZih0aGlzLl9pc1Nob3duJiZ0aGlzLl9jb25maWcuYmFja2Ryb3Ape3ZhciBvPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJmk7aWYodGhpcy5fYmFja2Ryb3A9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLl9iYWNrZHJvcC5jbGFzc05hbWU9bS5CQUNLRFJPUCxpJiZ0KHRoaXMuX2JhY2tkcm9wKS5hZGRDbGFzcyhpKSx0KHRoaXMuX2JhY2tkcm9wKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KSx0KHRoaXMuX2VsZW1lbnQpLm9uKHAuQ0xJQ0tfRElTTUlTUyxmdW5jdGlvbih0KXtyZXR1cm4gbi5faWdub3JlQmFja2Ryb3BDbGljaz92b2lkKG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s9ITEpOnZvaWQodC50YXJnZXQ9PT10LmN1cnJlbnRUYXJnZXQmJihcInN0YXRpY1wiPT09bi5fY29uZmlnLmJhY2tkcm9wP24uX2VsZW1lbnQuZm9jdXMoKTpuLmhpZGUoKSkpfSksbyYmci5yZWZsb3codGhpcy5fYmFja2Ryb3ApLHQodGhpcy5fYmFja2Ryb3ApLmFkZENsYXNzKG0uU0hPVyksIWUpcmV0dXJuO2lmKCFvKXJldHVybiB2b2lkIGUoKTt0KHRoaXMuX2JhY2tkcm9wKS5vbmUoci5UUkFOU0lUSU9OX0VORCxlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkKX1lbHNlIGlmKCF0aGlzLl9pc1Nob3duJiZ0aGlzLl9iYWNrZHJvcCl7dCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlQ2xhc3MobS5TSE9XKTt2YXIgcz1mdW5jdGlvbigpe24uX3JlbW92ZUJhY2tkcm9wKCksZSYmZSgpfTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk/dCh0aGlzLl9iYWNrZHJvcCkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoZCk6cygpfWVsc2UgZSYmZSgpfSxoLnByb3RvdHlwZS5faGFuZGxlVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5fYWRqdXN0RGlhbG9nKCl9LGgucHJvdG90eXBlLl9hZGp1c3REaWFsb2c9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodD5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyF0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmdCYmKHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9dGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKSx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmIXQmJih0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD10aGlzLl9zY3JvbGxiYXJXaWR0aCtcInB4XCIpfSxoLnByb3RvdHlwZS5fcmVzZXRBZGp1c3RtZW50cz1mdW5jdGlvbigpe3RoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQ9XCJcIix0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodD1cIlwifSxoLnByb3RvdHlwZS5fY2hlY2tTY3JvbGxiYXI9ZnVuY3Rpb24oKXt0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz1kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoPHdpbmRvdy5pbm5lcldpZHRoLHRoaXMuX3Njcm9sbGJhcldpZHRoPXRoaXMuX2dldFNjcm9sbGJhcldpZHRoKCl9LGgucHJvdG90eXBlLl9zZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgZT1wYXJzZUludCh0KEUuRklYRURfQ09OVEVOVCkuY3NzKFwicGFkZGluZy1yaWdodFwiKXx8MCwxMCk7dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz1kb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodHx8XCJcIix0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyYmKGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0PWUrdGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKX0saC5wcm90b3R5cGUuX3Jlc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQ9dGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZ30saC5wcm90b3R5cGUuX2dldFNjcm9sbGJhcldpZHRoPWZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0LmNsYXNzTmFtZT1tLlNDUk9MTEJBUl9NRUFTVVJFUixkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQpO3ZhciBlPXQub2Zmc2V0V2lkdGgtdC5jbGllbnRXaWR0aDtyZXR1cm4gZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0KSxlfSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSxuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG89dCh0aGlzKS5kYXRhKGEpLHI9dC5leHRlbmQoe30saC5EZWZhdWx0LHQodGhpcykuZGF0YSgpLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZSk7aWYob3x8KG89bmV3IGgodGhpcyxyKSx0KHRoaXMpLmRhdGEoYSxvKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKHZvaWQgMD09PW9bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7b1tlXShuKX1lbHNlIHIuc2hvdyYmby5zaG93KG4pfSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX319XSksaH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24ocC5DTElDS19EQVRBX0FQSSxFLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT12b2lkIDAsbz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7byYmKGk9dChvKVswXSk7dmFyIHM9dChpKS5kYXRhKGEpP1widG9nZ2xlXCI6dC5leHRlbmQoe30sdChpKS5kYXRhKCksdCh0aGlzKS5kYXRhKCkpO1wiQVwiIT09dGhpcy50YWdOYW1lJiZcIkFSRUFcIiE9PXRoaXMudGFnTmFtZXx8ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBsPXQoaSkub25lKHAuU0hPVyxmdW5jdGlvbihlKXtlLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxsLm9uZShwLkhJRERFTixmdW5jdGlvbigpe3QobikuaXMoXCI6dmlzaWJsZVwiKSYmbi5mb2N1cygpfSl9KTt2Ll9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KGkpLHMsdGhpcyl9KSx0LmZuW2VdPXYuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPXYsdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09Yyx2Ll9qUXVlcnlJbnRlcmZhY2V9LHZ9KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJzY3JvbGxzcHlcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5zY3JvbGxzcHlcIixsPVwiLlwiK2EsaD1cIi5kYXRhLWFwaVwiLGM9dC5mbltlXSx1PXtvZmZzZXQ6MTAsbWV0aG9kOlwiYXV0b1wiLHRhcmdldDpcIlwifSxkPXtvZmZzZXQ6XCJudW1iZXJcIixtZXRob2Q6XCJzdHJpbmdcIix0YXJnZXQ6XCIoc3RyaW5nfGVsZW1lbnQpXCJ9LGY9e0FDVElWQVRFOlwiYWN0aXZhdGVcIitsLFNDUk9MTDpcInNjcm9sbFwiK2wsTE9BRF9EQVRBX0FQSTpcImxvYWRcIitsK2h9LF89e0RST1BET1dOX0lURU06XCJkcm9wZG93bi1pdGVtXCIsRFJPUERPV05fTUVOVTpcImRyb3Bkb3duLW1lbnVcIixOQVZfTElOSzpcIm5hdi1saW5rXCIsTkFWOlwibmF2XCIsQUNUSVZFOlwiYWN0aXZlXCJ9LGc9e0RBVEFfU1BZOidbZGF0YS1zcHk9XCJzY3JvbGxcIl0nLEFDVElWRTpcIi5hY3RpdmVcIixMSVNUX0lURU06XCIubGlzdC1pdGVtXCIsTEk6XCJsaVwiLExJX0RST1BET1dOOlwibGkuZHJvcGRvd25cIixOQVZfTElOS1M6XCIubmF2LWxpbmtcIixEUk9QRE9XTjpcIi5kcm9wZG93blwiLERST1BET1dOX0lURU1TOlwiLmRyb3Bkb3duLWl0ZW1cIixEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCJ9LHA9e09GRlNFVDpcIm9mZnNldFwiLFBPU0lUSU9OOlwicG9zaXRpb25cIn0sbT1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXt2YXIgbz10aGlzO24odGhpcyxoKSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fc2Nyb2xsRWxlbWVudD1cIkJPRFlcIj09PWUudGFnTmFtZT93aW5kb3c6ZSx0aGlzLl9jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGkpLHRoaXMuX3NlbGVjdG9yPXRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5OQVZfTElOS1MrXCIsXCIrKHRoaXMuX2NvbmZpZy50YXJnZXQrXCIgXCIrZy5EUk9QRE9XTl9JVEVNUyksdGhpcy5fb2Zmc2V0cz1bXSx0aGlzLl90YXJnZXRzPVtdLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD0wLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub24oZi5TQ1JPTEwsZnVuY3Rpb24odCl7cmV0dXJuIG8uX3Byb2Nlc3ModCl9KSx0aGlzLnJlZnJlc2goKSx0aGlzLl9wcm9jZXNzKCl9cmV0dXJuIGgucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5fc2Nyb2xsRWxlbWVudCE9PXRoaXMuX3Njcm9sbEVsZW1lbnQud2luZG93P3AuUE9TSVRJT046cC5PRkZTRVQsaT1cImF1dG9cIj09PXRoaXMuX2NvbmZpZy5tZXRob2Q/bjp0aGlzLl9jb25maWcubWV0aG9kLG89aT09PXAuUE9TSVRJT04/dGhpcy5fZ2V0U2Nyb2xsVG9wKCk6MDt0aGlzLl9vZmZzZXRzPVtdLHRoaXMuX3RhcmdldHM9W10sdGhpcy5fc2Nyb2xsSGVpZ2h0PXRoaXMuX2dldFNjcm9sbEhlaWdodCgpO3ZhciBzPXQubWFrZUFycmF5KHQodGhpcy5fc2VsZWN0b3IpKTtzLm1hcChmdW5jdGlvbihlKXt2YXIgbj12b2lkIDAscz1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZSk7cmV0dXJuIHMmJihuPXQocylbMF0pLG4mJihuLm9mZnNldFdpZHRofHxuLm9mZnNldEhlaWdodCk/W3QobilbaV0oKS50b3ArbyxzXTpudWxsfSkuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiB0fSkuc29ydChmdW5jdGlvbih0LGUpe3JldHVybiB0WzBdLWVbMF19KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UuX29mZnNldHMucHVzaCh0WzBdKSxlLl90YXJnZXRzLnB1c2godFsxXSl9KX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkub2ZmKGwpLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl9zY3JvbGxFbGVtZW50PW51bGwsdGhpcy5fY29uZmlnPW51bGwsdGhpcy5fc2VsZWN0b3I9bnVsbCx0aGlzLl9vZmZzZXRzPW51bGwsdGhpcy5fdGFyZ2V0cz1udWxsLHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHRoaXMuX3Njcm9sbEhlaWdodD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe2lmKG49dC5leHRlbmQoe30sdSxuKSxcInN0cmluZ1wiIT10eXBlb2Ygbi50YXJnZXQpe3ZhciBpPXQobi50YXJnZXQpLmF0dHIoXCJpZFwiKTtpfHwoaT1yLmdldFVJRChlKSx0KG4udGFyZ2V0KS5hdHRyKFwiaWRcIixpKSksbi50YXJnZXQ9XCIjXCIraX1yZXR1cm4gci50eXBlQ2hlY2tDb25maWcoZSxuLGQpLG59LGgucHJvdG90eXBlLl9nZXRTY3JvbGxUb3A9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudD09PXdpbmRvdz90aGlzLl9zY3JvbGxFbGVtZW50LnBhZ2VZT2Zmc2V0OnRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsVG9wfSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsSGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsSGVpZ2h0fHxNYXRoLm1heChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KX0saC5wcm90b3R5cGUuX2dldE9mZnNldEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50PT09d2luZG93P3dpbmRvdy5pbm5lckhlaWdodDp0aGlzLl9zY3JvbGxFbGVtZW50Lm9mZnNldEhlaWdodH0saC5wcm90b3R5cGUuX3Byb2Nlc3M9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9nZXRTY3JvbGxUb3AoKSt0aGlzLl9jb25maWcub2Zmc2V0LGU9dGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KCksbj10aGlzLl9jb25maWcub2Zmc2V0K2UtdGhpcy5fZ2V0T2Zmc2V0SGVpZ2h0KCk7aWYodGhpcy5fc2Nyb2xsSGVpZ2h0IT09ZSYmdGhpcy5yZWZyZXNoKCksdD49bil7dmFyIGk9dGhpcy5fdGFyZ2V0c1t0aGlzLl90YXJnZXRzLmxlbmd0aC0xXTtyZXR1cm4gdm9pZCh0aGlzLl9hY3RpdmVUYXJnZXQhPT1pJiZ0aGlzLl9hY3RpdmF0ZShpKSl9aWYodGhpcy5fYWN0aXZlVGFyZ2V0JiZ0PHRoaXMuX29mZnNldHNbMF0mJnRoaXMuX29mZnNldHNbMF0+MClyZXR1cm4gdGhpcy5fYWN0aXZlVGFyZ2V0PW51bGwsdm9pZCB0aGlzLl9jbGVhcigpO2Zvcih2YXIgbz10aGlzLl9vZmZzZXRzLmxlbmd0aDtvLS07KXt2YXIgcj10aGlzLl9hY3RpdmVUYXJnZXQhPT10aGlzLl90YXJnZXRzW29dJiZ0Pj10aGlzLl9vZmZzZXRzW29dJiYodm9pZCAwPT09dGhpcy5fb2Zmc2V0c1tvKzFdfHx0PHRoaXMuX29mZnNldHNbbysxXSk7ciYmdGhpcy5fYWN0aXZhdGUodGhpcy5fdGFyZ2V0c1tvXSl9fSxoLnByb3RvdHlwZS5fYWN0aXZhdGU9ZnVuY3Rpb24oZSl7dGhpcy5fYWN0aXZlVGFyZ2V0PWUsdGhpcy5fY2xlYXIoKTt2YXIgbj10aGlzLl9zZWxlY3Rvci5zcGxpdChcIixcIik7bj1uLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdCsnW2RhdGEtdGFyZ2V0PVwiJytlKydcIl0sJysodCsnW2hyZWY9XCInK2UrJ1wiXScpfSk7dmFyIGk9dChuLmpvaW4oXCIsXCIpKTtpLmhhc0NsYXNzKF8uRFJPUERPV05fSVRFTSk/KGkuY2xvc2VzdChnLkRST1BET1dOKS5maW5kKGcuRFJPUERPV05fVE9HR0xFKS5hZGRDbGFzcyhfLkFDVElWRSksaS5hZGRDbGFzcyhfLkFDVElWRSkpOmkucGFyZW50cyhnLkxJKS5maW5kKFwiPiBcIitnLk5BVl9MSU5LUykuYWRkQ2xhc3MoXy5BQ1RJVkUpLHQodGhpcy5fc2Nyb2xsRWxlbWVudCkudHJpZ2dlcihmLkFDVElWQVRFLHtyZWxhdGVkVGFyZ2V0OmV9KX0saC5wcm90b3R5cGUuX2NsZWFyPWZ1bmN0aW9uKCl7dCh0aGlzLl9zZWxlY3RvcikuZmlsdGVyKGcuQUNUSVZFKS5yZW1vdmVDbGFzcyhfLkFDVElWRSl9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlO1xyXG5pZihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09bltlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtuW2VdKCl9fSl9LG8oaCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdX19XSksaH0oKTtyZXR1cm4gdCh3aW5kb3cpLm9uKGYuTE9BRF9EQVRBX0FQSSxmdW5jdGlvbigpe2Zvcih2YXIgZT10Lm1ha2VBcnJheSh0KGcuREFUQV9TUFkpKSxuPWUubGVuZ3RoO24tLTspe3ZhciBpPXQoZVtuXSk7bS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoaSxpLmRhdGEoKSl9fSksdC5mbltlXT1tLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1tLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwidGFiXCIsaT1cIjQuMC4wLWFscGhhLjZcIixzPVwiYnMudGFiXCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0xNTAsdT17SElERTpcImhpZGVcIithLEhJRERFTjpcImhpZGRlblwiK2EsU0hPVzpcInNob3dcIithLFNIT1dOOlwic2hvd25cIithLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIithK2x9LGQ9e0RST1BET1dOX01FTlU6XCJkcm9wZG93bi1tZW51XCIsQUNUSVZFOlwiYWN0aXZlXCIsRElTQUJMRUQ6XCJkaXNhYmxlZFwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sZj17QTpcImFcIixMSTpcImxpXCIsRFJPUERPV046XCIuZHJvcGRvd25cIixMSVNUOlwidWw6bm90KC5kcm9wZG93bi1tZW51KSwgb2w6bm90KC5kcm9wZG93bi1tZW51KSwgbmF2Om5vdCguZHJvcGRvd24tbWVudSlcIixGQURFX0NISUxEOlwiPiAubmF2LWl0ZW0gLmZhZGUsID4gLmZhZGVcIixBQ1RJVkU6XCIuYWN0aXZlXCIsQUNUSVZFX0NISUxEOlwiPiAubmF2LWl0ZW0gPiAuYWN0aXZlLCA+IC5hY3RpdmVcIixEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwidGFiXCJdLCBbZGF0YS10b2dnbGU9XCJwaWxsXCJdJyxEUk9QRE9XTl9UT0dHTEU6XCIuZHJvcGRvd24tdG9nZ2xlXCIsRFJPUERPV05fQUNUSVZFX0NISUxEOlwiPiAuZHJvcGRvd24tbWVudSAuYWN0aXZlXCJ9LF89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe24odGhpcyxlKSx0aGlzLl9lbGVtZW50PXR9cmV0dXJuIGUucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKCEodGhpcy5fZWxlbWVudC5wYXJlbnROb2RlJiZ0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhkLkFDVElWRSl8fHQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoZC5ESVNBQkxFRCkpKXt2YXIgbj12b2lkIDAsaT12b2lkIDAsbz10KHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoZi5MSVNUKVswXSxzPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtvJiYoaT10Lm1ha2VBcnJheSh0KG8pLmZpbmQoZi5BQ1RJVkUpKSxpPWlbaS5sZW5ndGgtMV0pO3ZhciBhPXQuRXZlbnQodS5ISURFLHtyZWxhdGVkVGFyZ2V0OnRoaXMuX2VsZW1lbnR9KSxsPXQuRXZlbnQodS5TSE9XLHtyZWxhdGVkVGFyZ2V0Oml9KTtpZihpJiZ0KGkpLnRyaWdnZXIoYSksdCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGwpLCFsLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYhYS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7cyYmKG49dChzKVswXSksdGhpcy5fYWN0aXZhdGUodGhpcy5fZWxlbWVudCxvKTt2YXIgaD1mdW5jdGlvbigpe3ZhciBuPXQuRXZlbnQodS5ISURERU4se3JlbGF0ZWRUYXJnZXQ6ZS5fZWxlbWVudH0pLG89dC5FdmVudCh1LlNIT1dOLHtyZWxhdGVkVGFyZ2V0Oml9KTt0KGkpLnRyaWdnZXIobiksdChlLl9lbGVtZW50KS50cmlnZ2VyKG8pfTtuP3RoaXMuX2FjdGl2YXRlKG4sbi5wYXJlbnROb2RlLGgpOmgoKX19fSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50LHMpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2FjdGl2YXRlPWZ1bmN0aW9uKGUsbixpKXt2YXIgbz10aGlzLHM9dChuKS5maW5kKGYuQUNUSVZFX0NISUxEKVswXSxhPWkmJnIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJihzJiZ0KHMpLmhhc0NsYXNzKGQuRkFERSl8fEJvb2xlYW4odChuKS5maW5kKGYuRkFERV9DSElMRClbMF0pKSxsPWZ1bmN0aW9uKCl7cmV0dXJuIG8uX3RyYW5zaXRpb25Db21wbGV0ZShlLHMsYSxpKX07cyYmYT90KHMpLm9uZShyLlRSQU5TSVRJT05fRU5ELGwpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpOmwoKSxzJiZ0KHMpLnJlbW92ZUNsYXNzKGQuU0hPVyl9LGUucHJvdG90eXBlLl90cmFuc2l0aW9uQ29tcGxldGU9ZnVuY3Rpb24oZSxuLGksbyl7aWYobil7dChuKS5yZW1vdmVDbGFzcyhkLkFDVElWRSk7dmFyIHM9dChuLnBhcmVudE5vZGUpLmZpbmQoZi5EUk9QRE9XTl9BQ1RJVkVfQ0hJTEQpWzBdO3MmJnQocykucmVtb3ZlQ2xhc3MoZC5BQ1RJVkUpLG4uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCExKX1pZih0KGUpLmFkZENsYXNzKGQuQUNUSVZFKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksaT8oci5yZWZsb3coZSksdChlKS5hZGRDbGFzcyhkLlNIT1cpKTp0KGUpLnJlbW92ZUNsYXNzKGQuRkFERSksZS5wYXJlbnROb2RlJiZ0KGUucGFyZW50Tm9kZSkuaGFzQ2xhc3MoZC5EUk9QRE9XTl9NRU5VKSl7dmFyIGE9dChlKS5jbG9zZXN0KGYuRFJPUERPV04pWzBdO2EmJnQoYSkuZmluZChmLkRST1BET1dOX1RPR0dMRSkuYWRkQ2xhc3MoZC5BQ1RJVkUpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKX1vJiZvKCl9LGUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dCh0aGlzKSxvPWkuZGF0YShzKTtpZihvfHwobz1uZXcgZSh0aGlzKSxpLmRhdGEocyxvKSksXCJzdHJpbmdcIj09dHlwZW9mIG4pe2lmKHZvaWQgMD09PW9bbl0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK24rJ1wiJyk7b1tuXSgpfX0pfSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24odS5DTElDS19EQVRBX0FQSSxmLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKSxfLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KHRoaXMpLFwic2hvd1wiKX0pLHQuZm5bZV09Xy5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9Xyx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLF8uX2pRdWVyeUludGVyZmFjZX0sX30oalF1ZXJ5KSxmdW5jdGlvbih0KXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgVGV0aGVyKXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCB0b29sdGlwcyByZXF1aXJlIFRldGhlciAoaHR0cDovL3RldGhlci5pby8pXCIpO3ZhciBlPVwidG9vbHRpcFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLnRvb2x0aXBcIixsPVwiLlwiK2EsaD10LmZuW2VdLGM9MTUwLHU9XCJicy10ZXRoZXJcIixkPXthbmltYXRpb246ITAsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsdHJpZ2dlcjpcImhvdmVyIGZvY3VzXCIsdGl0bGU6XCJcIixkZWxheTowLGh0bWw6ITEsc2VsZWN0b3I6ITEscGxhY2VtZW50OlwidG9wXCIsb2Zmc2V0OlwiMCAwXCIsY29uc3RyYWludHM6W10sY29udGFpbmVyOiExfSxmPXthbmltYXRpb246XCJib29sZWFuXCIsdGVtcGxhdGU6XCJzdHJpbmdcIix0aXRsZTpcIihzdHJpbmd8ZWxlbWVudHxmdW5jdGlvbilcIix0cmlnZ2VyOlwic3RyaW5nXCIsZGVsYXk6XCIobnVtYmVyfG9iamVjdClcIixodG1sOlwiYm9vbGVhblwiLHNlbGVjdG9yOlwiKHN0cmluZ3xib29sZWFuKVwiLHBsYWNlbWVudDpcIihzdHJpbmd8ZnVuY3Rpb24pXCIsb2Zmc2V0Olwic3RyaW5nXCIsY29uc3RyYWludHM6XCJhcnJheVwiLGNvbnRhaW5lcjpcIihzdHJpbmd8ZWxlbWVudHxib29sZWFuKVwifSxfPXtUT1A6XCJib3R0b20gY2VudGVyXCIsUklHSFQ6XCJtaWRkbGUgbGVmdFwiLEJPVFRPTTpcInRvcCBjZW50ZXJcIixMRUZUOlwibWlkZGxlIHJpZ2h0XCJ9LGc9e1NIT1c6XCJzaG93XCIsT1VUOlwib3V0XCJ9LHA9e0hJREU6XCJoaWRlXCIrbCxISURERU46XCJoaWRkZW5cIitsLFNIT1c6XCJzaG93XCIrbCxTSE9XTjpcInNob3duXCIrbCxJTlNFUlRFRDpcImluc2VydGVkXCIrbCxDTElDSzpcImNsaWNrXCIrbCxGT0NVU0lOOlwiZm9jdXNpblwiK2wsRk9DVVNPVVQ6XCJmb2N1c291dFwiK2wsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitsLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrbH0sbT17RkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxFPXtUT09MVElQOlwiLnRvb2x0aXBcIixUT09MVElQX0lOTkVSOlwiLnRvb2x0aXAtaW5uZXJcIn0sdj17ZWxlbWVudDohMSxlbmFibGVkOiExfSxUPXtIT1ZFUjpcImhvdmVyXCIsRk9DVVM6XCJmb2N1c1wiLENMSUNLOlwiY2xpY2tcIixNQU5VQUw6XCJtYW51YWxcIn0sST1mdW5jdGlvbigpe2Z1bmN0aW9uIGgodCxlKXtuKHRoaXMsaCksdGhpcy5faXNFbmFibGVkPSEwLHRoaXMuX3RpbWVvdXQ9MCx0aGlzLl9ob3ZlclN0YXRlPVwiXCIsdGhpcy5fYWN0aXZlVHJpZ2dlcj17fSx0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITEsdGhpcy5fdGV0aGVyPW51bGwsdGhpcy5lbGVtZW50PXQsdGhpcy5jb25maWc9dGhpcy5fZ2V0Q29uZmlnKGUpLHRoaXMudGlwPW51bGwsdGhpcy5fc2V0TGlzdGVuZXJzKCl9cmV0dXJuIGgucHJvdG90eXBlLmVuYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMH0saC5wcm90b3R5cGUuZGlzYWJsZT1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hMX0saC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZD1mdW5jdGlvbigpe3RoaXMuX2lzRW5hYmxlZD0hdGhpcy5faXNFbmFibGVkfSxoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIG49dGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSxpPXQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKG4pO2l8fChpPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShuLGkpKSxpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrPSFpLl9hY3RpdmVUcmlnZ2VyLmNsaWNrLGkuX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKT9pLl9lbnRlcihudWxsLGkpOmkuX2xlYXZlKG51bGwsaSl9ZWxzZXtpZih0KHRoaXMuZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpKXJldHVybiB2b2lkIHRoaXMuX2xlYXZlKG51bGwsdGhpcyk7dGhpcy5fZW50ZXIobnVsbCx0aGlzKX19LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCksdGhpcy5jbGVhbnVwVGV0aGVyKCksdC5yZW1vdmVEYXRhKHRoaXMuZWxlbWVudCx0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZKSx0KHRoaXMuZWxlbWVudCkub2ZmKHRoaXMuY29uc3RydWN0b3IuRVZFTlRfS0VZKSx0KHRoaXMuZWxlbWVudCkuY2xvc2VzdChcIi5tb2RhbFwiKS5vZmYoXCJoaWRlLmJzLm1vZGFsXCIpLHRoaXMudGlwJiZ0KHRoaXMudGlwKS5yZW1vdmUoKSx0aGlzLl9pc0VuYWJsZWQ9bnVsbCx0aGlzLl90aW1lb3V0PW51bGwsdGhpcy5faG92ZXJTdGF0ZT1udWxsLHRoaXMuX2FjdGl2ZVRyaWdnZXI9bnVsbCx0aGlzLl90ZXRoZXI9bnVsbCx0aGlzLmVsZW1lbnQ9bnVsbCx0aGlzLmNvbmZpZz1udWxsLHRoaXMudGlwPW51bGx9LGgucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKFwibm9uZVwiPT09dCh0aGlzLmVsZW1lbnQpLmNzcyhcImRpc3BsYXlcIikpdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIHVzZSBzaG93IG9uIHZpc2libGUgZWxlbWVudHNcIik7dmFyIG49dC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1cpO2lmKHRoaXMuaXNXaXRoQ29udGVudCgpJiZ0aGlzLl9pc0VuYWJsZWQpe2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJUb29sdGlwIGlzIHRyYW5zaXRpb25pbmdcIik7dCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIobik7dmFyIGk9dC5jb250YWlucyh0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsdGhpcy5lbGVtZW50KTtpZihuLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwhaSlyZXR1cm47dmFyIG89dGhpcy5nZXRUaXBFbGVtZW50KCkscz1yLmdldFVJRCh0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO28uc2V0QXR0cmlidXRlKFwiaWRcIixzKSx0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLHMpLHRoaXMuc2V0Q29udGVudCgpLHRoaXMuY29uZmlnLmFuaW1hdGlvbiYmdChvKS5hZGRDbGFzcyhtLkZBREUpO3ZhciBhPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLnBsYWNlbWVudD90aGlzLmNvbmZpZy5wbGFjZW1lbnQuY2FsbCh0aGlzLG8sdGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy5wbGFjZW1lbnQsbD10aGlzLl9nZXRBdHRhY2htZW50KGEpLGM9dGhpcy5jb25maWcuY29udGFpbmVyPT09ITE/ZG9jdW1lbnQuYm9keTp0KHRoaXMuY29uZmlnLmNvbnRhaW5lcik7dChvKS5kYXRhKHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVksdGhpcykuYXBwZW5kVG8oYyksdCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5JTlNFUlRFRCksdGhpcy5fdGV0aGVyPW5ldyBUZXRoZXIoe2F0dGFjaG1lbnQ6bCxlbGVtZW50Om8sdGFyZ2V0OnRoaXMuZWxlbWVudCxjbGFzc2VzOnYsY2xhc3NQcmVmaXg6dSxvZmZzZXQ6dGhpcy5jb25maWcub2Zmc2V0LGNvbnN0cmFpbnRzOnRoaXMuY29uZmlnLmNvbnN0cmFpbnRzLGFkZFRhcmdldENsYXNzZXM6ITF9KSxyLnJlZmxvdyhvKSx0aGlzLl90ZXRoZXIucG9zaXRpb24oKSx0KG8pLmFkZENsYXNzKG0uU0hPVyk7dmFyIGQ9ZnVuY3Rpb24oKXt2YXIgbj1lLl9ob3ZlclN0YXRlO2UuX2hvdmVyU3RhdGU9bnVsbCxlLl9pc1RyYW5zaXRpb25pbmc9ITEsdChlLmVsZW1lbnQpLnRyaWdnZXIoZS5jb25zdHJ1Y3Rvci5FdmVudC5TSE9XTiksbj09PWcuT1VUJiZlLl9sZWF2ZShudWxsLGUpfTtpZihyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMudGlwKS5oYXNDbGFzcyhtLkZBREUpKXJldHVybiB0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITAsdm9pZCB0KHRoaXMudGlwKS5vbmUoci5UUkFOU0lUSU9OX0VORCxkKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChoLl9UUkFOU0lUSU9OX0RVUkFUSU9OKTtkKCl9fSxoLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT10aGlzLmdldFRpcEVsZW1lbnQoKSxvPXQuRXZlbnQodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5ISURFKTtpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiVG9vbHRpcCBpcyB0cmFuc2l0aW9uaW5nXCIpO3ZhciBzPWZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZSE9PWcuU0hPVyYmaS5wYXJlbnROb2RlJiZpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSksbi5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiksdChuLmVsZW1lbnQpLnRyaWdnZXIobi5jb25zdHJ1Y3Rvci5FdmVudC5ISURERU4pLG4uX2lzVHJhbnNpdGlvbmluZz0hMSxuLmNsZWFudXBUZXRoZXIoKSxlJiZlKCl9O3QodGhpcy5lbGVtZW50KS50cmlnZ2VyKG8pLG8uaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0KGkpLnJlbW92ZUNsYXNzKG0uU0hPVyksdGhpcy5fYWN0aXZlVHJpZ2dlcltULkNMSUNLXT0hMSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuRk9DVVNdPSExLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5IT1ZFUl09ITEsci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLnRpcCkuaGFzQ2xhc3MobS5GQURFKT8odGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwLHQoaSkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoYykpOnMoKSx0aGlzLl9ob3ZlclN0YXRlPVwiXCIpfSxoLnByb3RvdHlwZS5pc1dpdGhDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIEJvb2xlYW4odGhpcy5nZXRUaXRsZSgpKX0saC5wcm90b3R5cGUuZ2V0VGlwRWxlbWVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpcD10aGlzLnRpcHx8dCh0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF19LGgucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMuZ2V0VGlwRWxlbWVudCgpKTt0aGlzLnNldEVsZW1lbnRDb250ZW50KGUuZmluZChFLlRPT0xUSVBfSU5ORVIpLHRoaXMuZ2V0VGl0bGUoKSksZS5yZW1vdmVDbGFzcyhtLkZBREUrXCIgXCIrbS5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0saC5wcm90b3R5cGUuc2V0RWxlbWVudENvbnRlbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgbz10aGlzLmNvbmZpZy5odG1sO1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIG4/XCJ1bmRlZmluZWRcIjppKG4pKSYmKG4ubm9kZVR5cGV8fG4uanF1ZXJ5KT9vP3QobikucGFyZW50KCkuaXMoZSl8fGUuZW1wdHkoKS5hcHBlbmQobik6ZS50ZXh0KHQobikudGV4dCgpKTplW28/XCJodG1sXCI6XCJ0ZXh0XCJdKG4pfSxoLnByb3RvdHlwZS5nZXRUaXRsZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpO3JldHVybiB0fHwodD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLmNvbmZpZy50aXRsZT90aGlzLmNvbmZpZy50aXRsZS5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcudGl0bGUpLHR9LGgucHJvdG90eXBlLmNsZWFudXBUZXRoZXI9ZnVuY3Rpb24oKXt0aGlzLl90ZXRoZXImJnRoaXMuX3RldGhlci5kZXN0cm95KCl9LGgucHJvdG90eXBlLl9nZXRBdHRhY2htZW50PWZ1bmN0aW9uKHQpe3JldHVybiBfW3QudG9VcHBlckNhc2UoKV19LGgucHJvdG90eXBlLl9zZXRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49dGhpcy5jb25maWcudHJpZ2dlci5zcGxpdChcIiBcIik7bi5mb3JFYWNoKGZ1bmN0aW9uKG4pe2lmKFwiY2xpY2tcIj09PW4pdChlLmVsZW1lbnQpLm9uKGUuY29uc3RydWN0b3IuRXZlbnQuQ0xJQ0ssZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUudG9nZ2xlKHQpfSk7ZWxzZSBpZihuIT09VC5NQU5VQUwpe3ZhciBpPW49PT1ULkhPVkVSP2UuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VFTlRFUjplLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTSU4sbz1uPT09VC5IT1ZFUj9lLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFTEVBVkU6ZS5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU09VVDt0KGUuZWxlbWVudCkub24oaSxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS5fZW50ZXIodCl9KS5vbihvLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9sZWF2ZSh0KX0pfXQoZS5lbGVtZW50KS5jbG9zZXN0KFwiLm1vZGFsXCIpLm9uKFwiaGlkZS5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGUuaGlkZSgpfSl9KSx0aGlzLmNvbmZpZy5zZWxlY3Rvcj90aGlzLmNvbmZpZz10LmV4dGVuZCh7fSx0aGlzLmNvbmZpZyx7dHJpZ2dlcjpcIm1hbnVhbFwiLHNlbGVjdG9yOlwiXCJ9KTp0aGlzLl9maXhUaXRsZSgpfSxoLnByb3RvdHlwZS5fZml4VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD1pKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKTsodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInRpdGxlXCIpfHxcInN0cmluZ1wiIT09dCkmJih0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiLHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKXx8XCJcIiksdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsXCJcIikpfSxoLnByb3RvdHlwZS5fZW50ZXI9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO3JldHVybiBuPW58fHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGkpLG58fChuPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCx0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKSx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpLG4pKSxlJiYobi5fYWN0aXZlVHJpZ2dlcltcImZvY3VzaW5cIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSEwKSx0KG4uZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhtLlNIT1cpfHxuLl9ob3ZlclN0YXRlPT09Zy5TSE9XP3ZvaWQobi5faG92ZXJTdGF0ZT1nLlNIT1cpOihjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLlNIT1csbi5jb25maWcuZGVsYXkmJm4uY29uZmlnLmRlbGF5LnNob3c/dm9pZChuLl90aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlPT09Zy5TSE9XJiZuLnNob3coKX0sbi5jb25maWcuZGVsYXkuc2hvdykpOnZvaWQgbi5zaG93KCkpfSxoLnByb3RvdHlwZS5fbGVhdmU9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO2lmKG49bnx8dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSksbnx8KG49bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGksbikpLGUmJihuLl9hY3RpdmVUcmlnZ2VyW1wiZm9jdXNvdXRcIj09PWUudHlwZT9ULkZPQ1VTOlQuSE9WRVJdPSExKSwhbi5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKXJldHVybiBjbGVhclRpbWVvdXQobi5fdGltZW91dCksbi5faG92ZXJTdGF0ZT1nLk9VVCxuLmNvbmZpZy5kZWxheSYmbi5jb25maWcuZGVsYXkuaGlkZT92b2lkKG4uX3RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe24uX2hvdmVyU3RhdGU9PT1nLk9VVCYmbi5oaWRlKCl9LG4uY29uZmlnLmRlbGF5LmhpZGUpKTp2b2lkIG4uaGlkZSgpfSxoLnByb3RvdHlwZS5faXNXaXRoQWN0aXZlVHJpZ2dlcj1mdW5jdGlvbigpe2Zvcih2YXIgdCBpbiB0aGlzLl9hY3RpdmVUcmlnZ2VyKWlmKHRoaXMuX2FjdGl2ZVRyaWdnZXJbdF0pcmV0dXJuITA7cmV0dXJuITF9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LHQodGhpcy5lbGVtZW50KS5kYXRhKCksbiksbi5kZWxheSYmXCJudW1iZXJcIj09dHlwZW9mIG4uZGVsYXkmJihuLmRlbGF5PXtzaG93Om4uZGVsYXksaGlkZTpuLmRlbGF5fSksci50eXBlQ2hlY2tDb25maWcoZSxuLHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGUpLG59LGgucHJvdG90eXBlLl9nZXREZWxlZ2F0ZUNvbmZpZz1mdW5jdGlvbigpe3ZhciB0PXt9O2lmKHRoaXMuY29uZmlnKWZvcih2YXIgZSBpbiB0aGlzLmNvbmZpZyl0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRbZV0hPT10aGlzLmNvbmZpZ1tlXSYmKHRbZV09dGhpcy5jb25maWdbZV0pO3JldHVybiB0fSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZTtpZigobnx8IS9kaXNwb3NlfGhpZGUvLnRlc3QoZSkpJiYobnx8KG49bmV3IGgodGhpcyxvKSx0KHRoaXMpLmRhdGEoYSxuKSksXCJzdHJpbmdcIj09dHlwZW9mIGUpKXtpZih2b2lkIDA9PT1uW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO25bZV0oKX19KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBhfX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksaH0oKTtyZXR1cm4gdC5mbltlXT1JLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1JLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsSS5falF1ZXJ5SW50ZXJmYWNlfSxJfShqUXVlcnkpKTsoZnVuY3Rpb24ocil7dmFyIGE9XCJwb3BvdmVyXCIsbD1cIjQuMC4wLWFscGhhLjZcIixoPVwiYnMucG9wb3ZlclwiLGM9XCIuXCIraCx1PXIuZm5bYV0sZD1yLmV4dGVuZCh7fSxzLkRlZmF1bHQse3BsYWNlbWVudDpcInJpZ2h0XCIsdHJpZ2dlcjpcImNsaWNrXCIsY29udGVudDpcIlwiLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2Pid9KSxmPXIuZXh0ZW5kKHt9LHMuRGVmYXVsdFR5cGUse2NvbnRlbnQ6XCIoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pXCJ9KSxfPXtGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LGc9e1RJVExFOlwiLnBvcG92ZXItdGl0bGVcIixDT05URU5UOlwiLnBvcG92ZXItY29udGVudFwifSxwPXtISURFOlwiaGlkZVwiK2MsSElEREVOOlwiaGlkZGVuXCIrYyxTSE9XOlwic2hvd1wiK2MsU0hPV046XCJzaG93blwiK2MsSU5TRVJURUQ6XCJpbnNlcnRlZFwiK2MsQ0xJQ0s6XCJjbGlja1wiK2MsRk9DVVNJTjpcImZvY3VzaW5cIitjLEZPQ1VTT1VUOlwiZm9jdXNvdXRcIitjLE1PVVNFRU5URVI6XCJtb3VzZWVudGVyXCIrYyxNT1VTRUxFQVZFOlwibW91c2VsZWF2ZVwiK2N9LG09ZnVuY3Rpb24ocyl7ZnVuY3Rpb24gdSgpe3JldHVybiBuKHRoaXMsdSksdCh0aGlzLHMuYXBwbHkodGhpcyxhcmd1bWVudHMpKX1yZXR1cm4gZSh1LHMpLHUucHJvdG90eXBlLmlzV2l0aENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRUaXRsZSgpfHx0aGlzLl9nZXRDb250ZW50KCl9LHUucHJvdG90eXBlLmdldFRpcEVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aXA9dGhpcy50aXB8fHIodGhpcy5jb25maWcudGVtcGxhdGUpWzBdfSx1LnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIHQ9cih0aGlzLmdldFRpcEVsZW1lbnQoKSk7dGhpcy5zZXRFbGVtZW50Q29udGVudCh0LmZpbmQoZy5USVRMRSksdGhpcy5nZXRUaXRsZSgpKSx0aGlzLnNldEVsZW1lbnRDb250ZW50KHQuZmluZChnLkNPTlRFTlQpLHRoaXMuX2dldENvbnRlbnQoKSksdC5yZW1vdmVDbGFzcyhfLkZBREUrXCIgXCIrXy5TSE9XKSx0aGlzLmNsZWFudXBUZXRoZXIoKX0sdS5wcm90b3R5cGUuX2dldENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29udGVudFwiKXx8KFwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLmNvbnRlbnQ/dGhpcy5jb25maWcuY29udGVudC5jYWxsKHRoaXMuZWxlbWVudCk6dGhpcy5jb25maWcuY29udGVudCl9LHUuX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9cih0aGlzKS5kYXRhKGgpLG49XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOmkodCkpP3Q6bnVsbDtpZigoZXx8IS9kZXN0cm95fGhpZGUvLnRlc3QodCkpJiYoZXx8KGU9bmV3IHUodGhpcyxuKSxyKHRoaXMpLmRhdGEoaCxlKSksXCJzdHJpbmdcIj09dHlwZW9mIHQpKXtpZih2b2lkIDA9PT1lW3RdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJyt0KydcIicpO2VbdF0oKX19KX0sbyh1LG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGx9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBkfX0se2tleTpcIk5BTUVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYX19LHtrZXk6XCJEQVRBX0tFWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBofX0se2tleTpcIkV2ZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHB9fSx7a2V5OlwiRVZFTlRfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGN9fSx7a2V5OlwiRGVmYXVsdFR5cGVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZn19XSksdX0ocyk7cmV0dXJuIHIuZm5bYV09bS5falF1ZXJ5SW50ZXJmYWNlLHIuZm5bYV0uQ29uc3RydWN0b3I9bSxyLmZuW2FdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5mblthXT11LG0uX2pRdWVyeUludGVyZmFjZX0sbX0pKGpRdWVyeSl9KCk7IiwiLypcclxuKiBTZXQgdmFsdWUgb24gYSBmaWVsZCBvbmZvY3VzIGV2ZW50IGlmIGZpZWxkIHZhbHVlIGlzIGVtcHR5XHJcbipcclxuKiBAcGFyYW0gT2JqZWN0IGVsZW1lbnQgVGhlIGZpZWxkXHJcbiogQHBhcmFtIHN0cmluZyB2YWx1ZSAgIFRoZSB2YWx1ZSBcclxuKi9cclxuZnVuY3Rpb24gc2V0Rm9jdXNWYWx1ZShlbGVtZW50LCB2YWx1ZSl7XHJcbiAgICBpZighJChlbGVtZW50KS52YWwoKSlcclxuICAgIHtcclxuICAgICAgICAkKGVsZW1lbnQpLnZhbCh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiogQ29sbGFwc2VzIGFjY29yZGlvbihzKSBcclxuKlxyXG4qIEBwYXJhbSBlbGVtZW50ICAgIGFjY29yZGlvbiAgIFRoZSBhY2NvcmRpb24gZWxlbWVudFxyXG4qIEBwYXJhbSBzdHJpbmcgICAgIGFjdGlvbiAgICAgIFRoZSBhY3Rpb25cclxuKi9cclxuZnVuY3Rpb24gY29sbGFwc2VBbGwoYWNjb3JkaW9uLCBhY3Rpb24pXHJcbntcclxuICAgICQoYWNjb3JkaW9uKS5jb2xsYXBzZShhY3Rpb24pO1xyXG59XHJcblxyXG4vLyBDaGVja3MgYWxsIHRoZSBjaGVja2JveGVzIGNoaWxkcmVuIHdobyBoYXZlIHRoZSAuY2hlY2tBbGwgZWxlbWVudCBpZFxyXG4kKCcuY2hlY2tBbGwnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gZ2V0IHRoZSBpZFxyXG4gICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xyXG5cclxuICAgIC8vIGNoZWNrIGFsbCB0aGUgY2hlY2tib3hlcyB3aG8gaGF2ZSB0aGUgcGFyZW50IGlkIGFzIGNsYXNzXHJcbiAgICAkKCcuJyArIGlkKS5wcm9wKCdjaGVja2VkJywgdGhpcy5jaGVja2VkKTtcclxufSlcclxuXHJcbi8qXHJcbiogICBFbmFibGVzL2Rpc2FibGVzIGlubGluZSBlZGl0aW5nXHJcbiovXHJcbmZ1bmN0aW9uIGVkaXRJbmxpbmVFZGl0YWJsZSgpe1xyXG4gICAgLy8gaGlkZS9zaG93IHRoZSBhZGQgYW5kIGVkaXQgYnV0dG9ucyBhbmQgc2hvdy9oaWRlIGVkaXQgYWN0aW9uIGJ1dHRvbnNcclxuICAgICQoJy5JbmxpbmUtZWRpdGFibGUtLWVuYWJsZScpLnRvZ2dsZSgpO1xyXG4gICAgJCgnLkFkZC1uZXctaW5saW5lLWVkaXRhYmxlJykudG9nZ2xlKCk7XHJcbiAgICAkKCcuRWRpdC1pbmxpbmUtYWN0aW9uJykudG9nZ2xlKCk7XHJcblxyXG4gICAgLy8gc2hvdy9oaWRlIHRoZSBlZGl0YWJsZSBpbnB1dHNcclxuICAgICQoJy5FZGl0YWJsZS1jaGVjay10ZXh0IGlucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmdW5jdGlvbihpLCB2KSB7IHJldHVybiAhdjsgfSk7O1xyXG59IiwiJCgnc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICgkKHRoaXMpLnZhbCgpID09IFwibW9kYWwtdHJpZ2dlclwiKSB7XHJcbiAgICAgICAgJCgnI215TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgfVxyXG59KTsiLCIkKCcuSGFtYnVyZ2VyJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnT3BlbicpO1xyXG4gICAgJCgnLlN1Yi1oZWFkZXJfYmFyJykudG9nZ2xlQ2xhc3MoJ0hhbWJ1cmdlci1vcGVuJyk7XHJcbiAgICBjb25zb2xlLmxvZygndG9nZ2xlZCcpXHJcbn0pOyIsIiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7ICAgIFxyXG4gICAgdmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICBpZiAoc2Nyb2xsID49IDUwKSB7XHJcbiAgICAgICAgJChcIi5TdWItaGVhZGVyX2JhclwiKS5hZGRDbGFzcyhcIlN0aWNreS1oZWFkZXJcIik7XHJcbiAgICAgICAgJChcIi5IZWFkZXJfYmFyXCIpLmFkZENsYXNzKFwiT25seVwiKTtcclxuICAgICAgICAkKFwiaHRtbFwiKS5hZGRDbGFzcyhcIlctU3RpY2t5LW5hdi0tZW5cIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoXCIuU3ViLWhlYWRlcl9iYXJcIikucmVtb3ZlQ2xhc3MoXCJTdGlja3ktaGVhZGVyXCIpO1xyXG4gICAgICAgICQoXCIuSGVhZGVyX2JhclwiKS5yZW1vdmVDbGFzcyhcIk9ubHlcIik7XHJcbiAgICAgICAgJChcImh0bWxcIikucmVtb3ZlQ2xhc3MoXCJXLVN0aWNreS1uYXYtLWVuXCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJy5IZWFkZXJfYmFyX19hbGVydCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAkKCcuSGVhZGVyX2Jhcl9fYWxlcnQtLW5vdGlmaWNhdGlvbicpLmhpZGUoKTtcclxufSkiLCIvKlxyXG4qIEFkZHMgYSBtYXJrZXIgb24gdGhlIG1hcFxyXG4qXHJcbiogQHBhcmFtIE1hcFx0bWFwXHRcdFx0XHRUaGUgbWFwIHdoZXJlIHRvIGFkZCB0aGUgbWFya2VyXHJcbiogQHBhcmFtIGZsb2F0ICBsYXQgICAgIFx0XHRUaGUgcGxhY2UgbGF0aXR1ZGUgXHJcbiogQHBhcmFtIGZsb2F0ICBsb25nICAgIFx0XHRUaGUgcGxhY2UgbG9uZ2l0dWRlXHJcbiogQHBhcmFtIHN0cmluZyBjb250ZW50U3RyaW5nXHRUaGUgd2luZG93IGluZm8gY29udGVudFxyXG4qIEBwYXJhbSBzdHJpbmcgdHlwZSAgICBcdFx0VGhlIHBpbiB0eXBlLiBBdmFpbGFibGUgcGluczogW3JlZCxhbWJlcixncmVlbl1cclxuKiBAcGFyYW0gc3RyaW5nIGxhYmVsICAgXHRcdFRoZSBwaW4gbGFiZWwuIEF2YWlsYWJsZSBsYWJlbDogW2N5Y2xvbmUsY29uZmxpY3QsZWFydGhxdWFrZSx0c3VuYW1pLHN0b3JtLHZvbGNhbm8sdG9ybmFkbyxpbnNlY3QtaW5mZXN0YXRpb24sZGFuZ2Vyb3VzLWFyZWFdXHJcbiogQHJldHVybiB7TnVtYmVyfSBzdW1cclxuKi9cclxuZnVuY3Rpb24gYWRkTWFya2VyKG1hcCwgbGF0LCBsb25nLCBjb250ZW50U3RyaW5nLCB0eXBlICwgbGFiZWwgPSBudWxsKVxyXG57XHJcblx0dmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoe1xyXG5cdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsb25nKSxcclxuXHRcdG1hcDogbWFwLFxyXG5cdFx0aWNvbjogJ2ltZy9tYXJrZXJzLycgKyB0eXBlICsgJy5zdmcnLFxyXG5cdFx0bWFwX2ljb25fbGFiZWw6IChsYWJlbCAhPT0gbnVsbCkgPyAnPGkgY2xhc3M9XCJtYXAtaWNvbiBJY29uLS0nICsgbGFiZWwgKyAnIEljb24tLXNtXCI+PC9pPicgOiAnJ1xyXG5cdH0pO1xyXG4gXHRcclxuXHR2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcclxuICAgICAgICAgICAgY29udGVudDogY29udGVudFN0cmluZyxcclxuXHRcdFx0bWF4V2lkdGg6IDQ4MFxyXG5cdH0pO1xyXG5cclxuXHRtYXJrZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xyXG5cdH0pO1xyXG59IiwiLyoqXHJcbiAqIEFkZHMgdGhlIHNlbGVjdGVkIGNsYXNzIHRvIHRoZSBjbGlja2VkIHJhZGlvIGJ1dHRvblxyXG4gKiBcclxuICogQHBhcmFtIEVsZW1lbnQgaW5wdXQgXHJcbiAqL1xyXG5mdW5jdGlvbiBtdWx0aV9zZWxlY3RfcmFkaW9TZWxlY3RlZChpbnB1dCl7XHJcbiAgICAkKGlucHV0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuU2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnU2VsZWN0ZWQnKTtcclxuICAgICQoaW5wdXQpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdTZWxlY3RlZCcpO1xyXG59IiwiJChcIi5SaWJib25fX2hlYWRlcl9fY2hldnJvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIC8vUmVzZXQgYWxsIGFjdGl2ZSBjbGFzc2VzXHJcbiAgICBpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggXCJBY3RpdmVcIiApICkge1xyXG4gICAgICAgICQoXCIuUmliYm9uX19oZWFkZXJfX3dyYXAsIC5SaWJib25fX3Jlc3BvbnNlLCAuUmliYm9uX19oZWFkZXJfX2NoZXZyb25cIikucmVtb3ZlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICAkKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19yZXNwb25zZSwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlVXAoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgQWN0aXZlIHRvIFJpYmJvbiBIZWFkZXIgV3JhcFxyXG4gICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkubmV4dChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ0FjdGl2ZScpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5cclxuJChcIi5idG4tY29udGludWVcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9SZXNldCBhbGwgYWN0aXZlIGNsYXNzZXNcclxuICAgICAgICAkKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19yZXNwb25zZSwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcclxuICAgICAgICAkKFwiLlJlc3BvbnNlX19jb250ZW50XCIpLnNsaWRlVXAoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgQWN0aXZlIHRvIG5leHQgcmliYm9uXHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KCkubmV4dChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZURvd24oKTtcclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoXCIuUmliYm9uX19yZXNwb25zZVwiKS5hZGRDbGFzcygnQWN0aXZlJyk7XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KCkuZmluZChcIi5SaWJib25fX2hlYWRlcl9fd3JhcCwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLmFkZENsYXNzKCdBY3RpdmUnKTtcclxufSk7XHJcblxyXG4vLyBJbnZlcnNlcyBhcnJvdyBvbiBhY2NvcmRpb24gZXhwYW5zaW9uXHJcbiQoJy5jb2xsYXBzZScpLm9uKCdzaG93bi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoXCIuZmEtY2FyZXQtZG93blwiKS5yZW1vdmVDbGFzcyhcImZhLWNhcmV0LWRvd25cIikuYWRkQ2xhc3MoXCJmYS1jYXJldC11cFwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLkhpZGUtYWxsJykuc2hvdygpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuU2hvdy1hbGwnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkub24oJ2hpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoXCIuZmEtY2FyZXQtdXBcIikucmVtb3ZlQ2xhc3MoXCJmYS1jYXJldC11cFwiKS5hZGRDbGFzcyhcImZhLWNhcmV0LWRvd25cIik7XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLmZpbmQoJy5IaWRlLWFsbCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLlNob3ctYWxsJykuc2hvdygpO1xyXG4gICAgICAgIH1cclxufSk7XHJcblxyXG4iXX0=
