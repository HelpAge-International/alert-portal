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
        // $("#add_department").on("hidden.bs.modal", function(e) {
        //     // $(select).find("option").first().prop("selected", true);
        // });
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

function nextCalendarScreen(element) {
    var currentScreen = $(element).parent().parent().children(".Calendar__Screen");
    currentScreen.removeClass("Active");
    var nextScreen = $(currentScreen).next(".Calendar__Screen");
    nextScreen.addClass("Active");
}

function previousCalendarScreen(element) {
    var currentScreen = $(element).parent().parent().children(".Calendar__Screen");
    currentScreen.removeClass("Active");
    var prevScreen = $(currentScreen).prev(".Calendar__Screen");
    prevScreen.addClass("Active");
}

"use strict";

$(".Color__swatch").click(function() {
    $(".Color__swatch").removeClass("Active");
    $(this).addClass("Active");
});

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

function setSelectedIcon(element) {
    $(element).parent().children().removeClass("Selected");
    $(element).addClass("Selected");
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

$(".Radio__button--js .btn").click(function() {
    $(this).parent().children(".btn").removeClass("btn-primary Active").addClass("btn-outline-primary");
    $(this).removeClass("btn-outline-primary").addClass("btn-primary Active");
});

var exportSelectedDocument = $("input[type=checkbox]").change(function() {
    if ($("input[type=checkbox]").is(":checked")) {
        $("#exportDocumentBtn").parent().children(".btn").removeClass("btn-primary faded").addClass("btn-primary Active");
    } else {
        $("#exportDocumentBtn").parent().children(".btn").removeClass("btn-primary").addClass("btn-primary faded");
    }
});

"use strict";

function multi_select_radioSelected(input) {
    $(input).parent().parent().find(".Selected").removeClass("Selected");
    $(input).parent().toggleClass("Selected");
}

"use strict";

function ribbonClick(element) {
  if ($(element).hasClass("Active")) {
    $(element).parent().removeClass("Active");
    $(element).toggleClass("Active");
    $(element).parent().parent().next(".Response__content").slideToggle();
    $(element).parent().parent().toggleClass("Active");
  } else {
    $(element).parent().addClass("Active");
    $(element).toggleClass("Active");
    $(element).parent().parent().next(".Response__content").slideToggle();
    $(element).parent().parent().toggleClass("Active");
  }
}

function ribbonClickCloseOthers(element) {
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

function continueToNextRibbonCreateEditResPlans(element) {
  $(".Ribbon__header__wrap, .Ribbon__response, .Ribbon__header__chevron").removeClass("Active");
  $(".Response__content").slideUp();
  $(element).parent().parent().parent().next().find(".Response__content").slideDown();
  $(element).parent().parent().parent().next().find(".Ribbon__response").addClass("Active");
  $(element).parent().parent().parent().next().find(".Ribbon__header__wrap, .Ribbon__header__chevron").addClass("Active");
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

"use strict";

$(document).click(function(e) {
  var target = e.target;

  if (!$(target).is('.Info__icon') && !$(target).parents().is('.Info__icon')) {
    $('.Info__bubble').fadeOut();
  }
});

$(".Info__icon").click(function() {
  $(this).children(".Info__bubble").fadeToggle();
});

$(".Extend__span").click(function() {
  $(this).toggleClass('Active');
  $(this).prev(".Extended__content").slideToggle()
  $(".Info__bubble").toggleClass('Active');
});

"use strict";

(function($, window, document, undefined) {
    "use strict";
})(jQuery, window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFnZW5jeS1hZG1pbi5qcyIsImFnZW5jeS1sb2dvLmpzIiwiYm9vdHN0cmFwLm1pbi5qcyIsImNhbGVuZGFyLmpzIiwiY29sb3ItcGFsZXR0ZS1waWNrLmpzIiwiZm9ybXMuanMiLCJpbml0aWFsX19kcm9wZG93bi1tb2RhbC10cmlnZ2VyLmpzIiwiaW5pdGlhbF9faGFtYnVyZ2VyLmpzIiwiaW5pdGlhbF9fc3RpY2t5LW5hdi5qcyIsIm1hcC5qcyIsInJhZGlvX19idXR0b25fX2hpZ2hsaWdodC5qcyIsInJlc3BvbnNlLXBsYW5fX211bHRpLXNlbGVjdC5qcyIsInJlc3BvbnNlLXBsYW5fX3JldmVhbC1yaWJib24uanMiLCJ0b29sdGlwX19leHRlbmQuanMiXSwibmFtZXMiOlsiY291bnRyeV9yZW1vdmVkIiwiY291bnRyaWVzIiwiJCIsImxlbmd0aCIsImhpZGUiLCJzaG93IiwiZ3BhQWN0aW9uQ2hhbmdlZCIsImVsZW1lbnQiLCJhZGRBY3Rpb25CdXR0b24iLCJjaGVja2VkIiwicmVtb3ZlQ2xhc3MiLCJwYXJlbnQiLCJmaW5kIiwiaSIsImVhY2giLCJhZGRDbGFzcyIsImFkZERlcGFydG1lbnRNb2RhbCIsInNlbGVjdCIsIm1vZGFsX2lkIiwiaGFzQ2xhc3MiLCJtb2RhbCIsIm9uIiwiZSIsImZpcnN0IiwicHJvcCIsInJlYWRVUkwiLCJpbnB1dCIsImZpbGVzIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImNzcyIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc0RhdGFVUkwiLCJwcmV2aWV3TG9nbyIsImxvZ29JbWFnZSIsInRyaWdnZXJQcmV2aWV3TG9nbyIsInByZXZlbnREZWZhdWx0IiwidHJpZ2dlciIsInJlbW92ZUxvZ29QcmV2aWV3IiwialF1ZXJ5IiwiRXJyb3IiLCJ0IiwiZm4iLCJqcXVlcnkiLCJzcGxpdCIsIlJlZmVyZW5jZUVycm9yIiwiX3R5cGVvZiIsIlR5cGVFcnJvciIsInByb3RvdHlwZSIsIk9iamVjdCIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwidmFsdWUiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsIm4iLCJTeW1ib2wiLCJpdGVyYXRvciIsIm8iLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInIiLCJ0b1N0cmluZyIsImNhbGwiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwibm9kZVR5cGUiLCJiaW5kVHlwZSIsImEiLCJlbmQiLCJkZWxlZ2F0ZVR5cGUiLCJoYW5kbGUiLCJpcyIsInRoaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aW5kb3ciLCJRVW5pdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImgiLCJzdHlsZSIsIm9uZSIsImMiLCJUUkFOU0lUSU9OX0VORCIsInNldFRpbWVvdXQiLCJ0cmlnZ2VyVHJhbnNpdGlvbkVuZCIsInMiLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsInN1cHBvcnRzVHJhbnNpdGlvbkVuZCIsImV2ZW50Iiwic3BlY2lhbCIsImwiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIk9UcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsImdldFVJRCIsIk1hdGgiLCJyYW5kb20iLCJnZXRFbGVtZW50QnlJZCIsImdldFNlbGVjdG9yRnJvbUVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJ0ZXN0IiwicmVmbG93Iiwib2Zmc2V0SGVpZ2h0IiwiQm9vbGVhbiIsInR5cGVDaGVja0NvbmZpZyIsImhhc093blByb3BlcnR5IiwiUmVnRXhwIiwidG9VcHBlckNhc2UiLCJ1IiwiRElTTUlTUyIsImQiLCJDTE9TRSIsIkNMT1NFRCIsIkNMSUNLX0RBVEFfQVBJIiwiZiIsIkFMRVJUIiwiRkFERSIsIlNIT1ciLCJfIiwiX2VsZW1lbnQiLCJjbG9zZSIsIl9nZXRSb290RWxlbWVudCIsIl90cmlnZ2VyQ2xvc2VFdmVudCIsImlzRGVmYXVsdFByZXZlbnRlZCIsIl9yZW1vdmVFbGVtZW50IiwiZGlzcG9zZSIsInJlbW92ZURhdGEiLCJjbG9zZXN0IiwiRXZlbnQiLCJfZGVzdHJveUVsZW1lbnQiLCJkZXRhY2giLCJyZW1vdmUiLCJfalF1ZXJ5SW50ZXJmYWNlIiwiZGF0YSIsIl9oYW5kbGVEaXNtaXNzIiwiZ2V0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQUNUSVZFIiwiQlVUVE9OIiwiRk9DVVMiLCJEQVRBX1RPR0dMRV9DQVJST1QiLCJEQVRBX1RPR0dMRSIsIklOUFVUIiwiRk9DVVNfQkxVUl9EQVRBX0FQSSIsInRvZ2dsZSIsInR5cGUiLCJmb2N1cyIsInNldEF0dHJpYnV0ZSIsInRvZ2dsZUNsYXNzIiwiaW50ZXJ2YWwiLCJrZXlib2FyZCIsInNsaWRlIiwicGF1c2UiLCJ3cmFwIiwiZyIsInAiLCJORVhUIiwiUFJFViIsIkxFRlQiLCJSSUdIVCIsIm0iLCJTTElERSIsIlNMSUQiLCJLRVlET1dOIiwiTU9VU0VFTlRFUiIsIk1PVVNFTEVBVkUiLCJMT0FEX0RBVEFfQVBJIiwiRSIsIkNBUk9VU0VMIiwiSVRFTSIsInYiLCJBQ1RJVkVfSVRFTSIsIk5FWFRfUFJFViIsIklORElDQVRPUlMiLCJEQVRBX1NMSURFIiwiREFUQV9SSURFIiwiVCIsIl9pdGVtcyIsIl9pbnRlcnZhbCIsIl9hY3RpdmVFbGVtZW50IiwiX2lzUGF1c2VkIiwiX2lzU2xpZGluZyIsIl9jb25maWciLCJfZ2V0Q29uZmlnIiwiX2luZGljYXRvcnNFbGVtZW50IiwiX2FkZEV2ZW50TGlzdGVuZXJzIiwibmV4dCIsIl9zbGlkZSIsIm5leHRXaGVuVmlzaWJsZSIsImhpZGRlbiIsInByZXYiLCJQUkVWSU9VUyIsImN5Y2xlIiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwidmlzaWJpbGl0eVN0YXRlIiwiYmluZCIsInRvIiwiX2dldEl0ZW1JbmRleCIsIm9mZiIsImV4dGVuZCIsIl9rZXlkb3duIiwiZG9jdW1lbnRFbGVtZW50IiwidGFnTmFtZSIsIndoaWNoIiwibWFrZUFycmF5IiwiaW5kZXhPZiIsIl9nZXRJdGVtQnlEaXJlY3Rpb24iLCJfdHJpZ2dlclNsaWRlRXZlbnQiLCJyZWxhdGVkVGFyZ2V0IiwiZGlyZWN0aW9uIiwiX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQiLCJjaGlsZHJlbiIsIl9kYXRhQXBpQ2xpY2tIYW5kbGVyIiwiU0hPV04iLCJISURFIiwiSElEREVOIiwiQ09MTEFQU0UiLCJDT0xMQVBTSU5HIiwiQ09MTEFQU0VEIiwiV0lEVEgiLCJIRUlHSFQiLCJBQ1RJVkVTIiwiX2lzVHJhbnNpdGlvbmluZyIsIl90cmlnZ2VyQXJyYXkiLCJpZCIsIl9wYXJlbnQiLCJfZ2V0UGFyZW50IiwiX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsIl9nZXREaW1lbnNpb24iLCJhdHRyIiwic2V0VHJhbnNpdGlvbmluZyIsInNsaWNlIiwiX2dldFRhcmdldEZyb21FbGVtZW50IiwiQ0xJQ0siLCJGT0NVU0lOX0RBVEFfQVBJIiwiS0VZRE9XTl9EQVRBX0FQSSIsIkJBQ0tEUk9QIiwiRElTQUJMRUQiLCJGT1JNX0NISUxEIiwiUk9MRV9NRU5VIiwiUk9MRV9MSVNUQk9YIiwiTkFWQkFSX05BViIsIlZJU0lCTEVfSVRFTVMiLCJkaXNhYmxlZCIsIl9nZXRQYXJlbnRGcm9tRWxlbWVudCIsIl9jbGVhck1lbnVzIiwiY2xhc3NOYW1lIiwiaW5zZXJ0QmVmb3JlIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwiY29udGFpbnMiLCJfZGF0YUFwaUtleWRvd25IYW5kbGVyIiwic3RvcFByb3BhZ2F0aW9uIiwiYmFja2Ryb3AiLCJGT0NVU0lOIiwiUkVTSVpFIiwiQ0xJQ0tfRElTTUlTUyIsIktFWURPV05fRElTTUlTUyIsIk1PVVNFVVBfRElTTUlTUyIsIk1PVVNFRE9XTl9ESVNNSVNTIiwiU0NST0xMQkFSX01FQVNVUkVSIiwiT1BFTiIsIkRJQUxPRyIsIkRBVEFfRElTTUlTUyIsIkZJWEVEX0NPTlRFTlQiLCJfZGlhbG9nIiwiX2JhY2tkcm9wIiwiX2lzU2hvd24iLCJfaXNCb2R5T3ZlcmZsb3dpbmciLCJfaWdub3JlQmFja2Ryb3BDbGljayIsIl9vcmlnaW5hbEJvZHlQYWRkaW5nIiwiX3Njcm9sbGJhcldpZHRoIiwiX2NoZWNrU2Nyb2xsYmFyIiwiX3NldFNjcm9sbGJhciIsImJvZHkiLCJfc2V0RXNjYXBlRXZlbnQiLCJfc2V0UmVzaXplRXZlbnQiLCJfc2hvd0JhY2tkcm9wIiwiX3Nob3dFbGVtZW50IiwiX2hpZGVNb2RhbCIsIk5vZGUiLCJFTEVNRU5UX05PREUiLCJhcHBlbmRDaGlsZCIsImRpc3BsYXkiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzY3JvbGxUb3AiLCJfZW5mb3JjZUZvY3VzIiwiaGFzIiwiX2hhbmRsZVVwZGF0ZSIsIl9yZXNldEFkanVzdG1lbnRzIiwiX3Jlc2V0U2Nyb2xsYmFyIiwiX3JlbW92ZUJhY2tkcm9wIiwiYXBwZW5kVG8iLCJjdXJyZW50VGFyZ2V0IiwiX2FkanVzdERpYWxvZyIsInNjcm9sbEhlaWdodCIsImNsaWVudEhlaWdodCIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0IiwiY2xpZW50V2lkdGgiLCJpbm5lcldpZHRoIiwiX2dldFNjcm9sbGJhcldpZHRoIiwicGFyc2VJbnQiLCJvZmZzZXRXaWR0aCIsIkRlZmF1bHQiLCJvZmZzZXQiLCJtZXRob2QiLCJBQ1RJVkFURSIsIlNDUk9MTCIsIkRST1BET1dOX0lURU0iLCJEUk9QRE9XTl9NRU5VIiwiTkFWX0xJTksiLCJOQVYiLCJEQVRBX1NQWSIsIkxJU1RfSVRFTSIsIkxJIiwiTElfRFJPUERPV04iLCJOQVZfTElOS1MiLCJEUk9QRE9XTiIsIkRST1BET1dOX0lURU1TIiwiRFJPUERPV05fVE9HR0xFIiwiT0ZGU0VUIiwiUE9TSVRJT04iLCJfc2Nyb2xsRWxlbWVudCIsIl9zZWxlY3RvciIsIl9vZmZzZXRzIiwiX3RhcmdldHMiLCJfYWN0aXZlVGFyZ2V0IiwiX3Njcm9sbEhlaWdodCIsIl9wcm9jZXNzIiwicmVmcmVzaCIsIl9nZXRTY3JvbGxUb3AiLCJfZ2V0U2Nyb2xsSGVpZ2h0IiwibWFwIiwidG9wIiwiZmlsdGVyIiwic29ydCIsImZvckVhY2giLCJwdXNoIiwicGFnZVlPZmZzZXQiLCJtYXgiLCJfZ2V0T2Zmc2V0SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJfYWN0aXZhdGUiLCJfY2xlYXIiLCJqb2luIiwicGFyZW50cyIsIkEiLCJMSVNUIiwiRkFERV9DSElMRCIsIkFDVElWRV9DSElMRCIsIkRST1BET1dOX0FDVElWRV9DSElMRCIsIl90cmFuc2l0aW9uQ29tcGxldGUiLCJUZXRoZXIiLCJhbmltYXRpb24iLCJ0ZW1wbGF0ZSIsInRpdGxlIiwiZGVsYXkiLCJodG1sIiwic2VsZWN0b3IiLCJwbGFjZW1lbnQiLCJjb25zdHJhaW50cyIsImNvbnRhaW5lciIsIlRPUCIsIkJPVFRPTSIsIk9VVCIsIklOU0VSVEVEIiwiRk9DVVNPVVQiLCJUT09MVElQIiwiVE9PTFRJUF9JTk5FUiIsImVuYWJsZWQiLCJIT1ZFUiIsIk1BTlVBTCIsIkkiLCJfaXNFbmFibGVkIiwiX3RpbWVvdXQiLCJfaG92ZXJTdGF0ZSIsIl9hY3RpdmVUcmlnZ2VyIiwiX3RldGhlciIsImNvbmZpZyIsInRpcCIsIl9zZXRMaXN0ZW5lcnMiLCJlbmFibGUiLCJkaXNhYmxlIiwidG9nZ2xlRW5hYmxlZCIsIkRBVEFfS0VZIiwiX2dldERlbGVnYXRlQ29uZmlnIiwiY2xpY2siLCJfaXNXaXRoQWN0aXZlVHJpZ2dlciIsIl9lbnRlciIsIl9sZWF2ZSIsImdldFRpcEVsZW1lbnQiLCJjbGVhclRpbWVvdXQiLCJjbGVhbnVwVGV0aGVyIiwiRVZFTlRfS0VZIiwiaXNXaXRoQ29udGVudCIsIm93bmVyRG9jdW1lbnQiLCJOQU1FIiwic2V0Q29udGVudCIsIl9nZXRBdHRhY2htZW50IiwiYXR0YWNobWVudCIsImNsYXNzZXMiLCJjbGFzc1ByZWZpeCIsImFkZFRhcmdldENsYXNzZXMiLCJwb3NpdGlvbiIsIl9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiZ2V0VGl0bGUiLCJzZXRFbGVtZW50Q29udGVudCIsImVtcHR5IiwiYXBwZW5kIiwidGV4dCIsImRlc3Ryb3kiLCJfZml4VGl0bGUiLCJEZWZhdWx0VHlwZSIsImNvbnRlbnQiLCJUSVRMRSIsIkNPTlRFTlQiLCJfZ2V0Q29udGVudCIsIm5leHRDYWxlbmRhclNjcmVlbiIsImN1cnJlbnRTY3JlZW4iLCJuZXh0U2NyZWVuIiwicHJldmlvdXNDYWxlbmRhclNjcmVlbiIsInByZXZTY3JlZW4iLCJzZXRGb2N1c1ZhbHVlIiwidmFsIiwiY29sbGFwc2VBbGwiLCJhY2NvcmRpb24iLCJhY3Rpb24iLCJjb2xsYXBzZSIsImVkaXRJbmxpbmVFZGl0YWJsZSIsInNldFNlbGVjdGVkSWNvbiIsImNoYW5nZSIsImNvbnNvbGUiLCJsb2ciLCJzY3JvbGwiLCJhZGRNYXJrZXIiLCJsYXQiLCJsb25nIiwiY29udGVudFN0cmluZyIsImxhYmVsIiwidW5kZWZpbmVkIiwibWFya2VyIiwiTWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIkxhdExuZyIsImljb24iLCJtYXBfaWNvbl9sYWJlbCIsImluZm93aW5kb3ciLCJJbmZvV2luZG93IiwibWF4V2lkdGgiLCJhZGRMaXN0ZW5lciIsIm9wZW4iLCJleHBvcnRTZWxlY3RlZERvY3VtZW50IiwibXVsdGlfc2VsZWN0X3JhZGlvU2VsZWN0ZWQiLCJyaWJib25DbGljayIsInNsaWRlVXAiLCJzbGlkZVRvZ2dsZSIsImNvbnRpbnVlVG9OZXh0UmliYm9uIiwic2xpZGVEb3duIiwiZmFkZU91dCIsImZhZGVJbiJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxTQUFTQTtJQUVMLElBQUlDLFlBQVlDLEVBQUU7SUFFbEIsSUFBR0QsVUFBVUUsVUFBVSxHQUN2QjtRQUVJRCxFQUFFLGlCQUFpQkU7V0FDbEI7UUFDREYsRUFBRSxpQkFBaUJHOzs7O0FBSzNCLFNBQVNDLGlCQUFrQkM7SUFDdkIsSUFBSUMsa0JBQWtCTixFQUFFO0lBQ3hCLElBQUlLLFFBQVFFLFNBQVM7UUFFakJELGdCQUFnQkUsWUFBWTtRQUc1QlIsRUFBRUssU0FBU0ksU0FBU0EsU0FBU0MsS0FBSywwQkFBMEJQO1dBQ3pEO1FBRUhILEVBQUVLLFNBQVNJLFNBQVNBLFNBQVNDLEtBQUssMEJBQTBCUjtRQUc1RCxJQUFJUyxJQUFJO1FBQ1JYLEVBQUUsa0NBQWtDWSxLQUFLO1lBQ3JDRDs7UUFFSixJQUFJQSxJQUFJLEdBQUc7WUFDUEwsZ0JBQWdCTyxTQUFTOzs7OztBQVdyQyxTQUFTQyxtQkFBbUJDLFFBQVFDO0lBQ2hDLElBQUdoQixFQUFFZSxRQUFRTCxLQUFLLGFBQWFPLFNBQVMsbUJBQ3hDO1FBQ0lqQixFQUFFZ0IsVUFBVUUsTUFBTTtRQUVqQmxCLEVBQUUsbUJBQW1CbUIsR0FBRyxtQkFBbUIsU0FBVUM7WUFDbERwQixFQUFFZSxRQUFRTCxLQUFLLFVBQVVXLFFBQVFDLEtBQUssWUFBWTs7Ozs7OztBQ2xEOUQsU0FBU0MsUUFBUUM7SUFDZixJQUFJQSxNQUFNQyxTQUFTRCxNQUFNQyxNQUFNLElBQUk7UUFDL0IsSUFBSUMsU0FBUyxJQUFJQztRQUVqQkQsT0FBT0UsU0FBUyxTQUFVUjtZQUN0QnBCLEVBQUUsa0NBQWtDNkIsSUFBSSxvQkFBb0IsU0FBU1QsRUFBRVUsT0FBT0MsU0FBUztZQUN2Ri9CLEVBQUUsa0NBQWtDYSxTQUFTOztRQUdqRGEsT0FBT00sY0FBY1IsTUFBTUMsTUFBTTs7OztBQUl2QyxTQUFTUSxZQUFZQztJQUNqQlgsUUFBUVc7SUFDUmxDLEVBQUUsZ0JBQWdCRTtJQUNsQkYsRUFBRSxpQkFBaUJHO0lBQ25CSCxFQUFFLGdCQUFnQkc7OztBQUd0QixTQUFTZ0MsbUJBQW1CZjtJQUN4QkEsRUFBRWdCO0lBQ0hwQyxFQUFFLFdBQVdxQyxRQUFROzs7QUFHeEIsU0FBU0Msa0JBQWtCbEI7SUFDdkJBLEVBQUVnQjtJQUNGcEMsRUFBRSxpQkFBaUJFO0lBQ25CRixFQUFFLGdCQUFnQkU7SUFDbEJGLEVBQUUsZ0JBQWdCRztJQUNsQkgsRUFBRSxrQ0FBa0M2QixJQUFJLG9CQUFvQjtJQUM1RDdCLEVBQUUsa0NBQWtDUSxZQUFZOzs7Ozs7Ozs7OztBQzFCcEQsSUFBRyxzQkFBb0IrQixRQUFPLE1BQU0sSUFBSUMsTUFBTTs7Q0FBbUcsU0FBU0M7SUFBRyxJQUFJckIsSUFBRXFCLEVBQUVDLEdBQUdDLE9BQU9DLE1BQU0sS0FBSyxHQUFHQSxNQUFNO0lBQUssSUFBR3hCLEVBQUUsS0FBRyxLQUFHQSxFQUFFLEtBQUcsS0FBRyxLQUFHQSxFQUFFLE1BQUksS0FBR0EsRUFBRSxNQUFJQSxFQUFFLEtBQUcsS0FBR0EsRUFBRSxNQUFJLEdBQUUsTUFBTSxJQUFJb0IsTUFBTTtFQUFnRkQsVUFBUztJQUFXLFNBQVNFLEVBQUVBLEdBQUVyQjtRQUFHLEtBQUlxQixHQUFFLE1BQU0sSUFBSUksZUFBZTtRQUE2RCxRQUFPekIsS0FBRyxvQkFBaUJBLE1BQWpCLGNBQUEsY0FBQTBCLFFBQWlCMUIsT0FBRyxxQkFBbUJBLElBQUVxQixJQUFFckI7O0lBQUUsU0FBU0EsRUFBRXFCLEdBQUVyQjtRQUFHLElBQUcscUJBQW1CQSxLQUFHLFNBQU9BLEdBQUUsTUFBTSxJQUFJMkIsVUFBVSxxRUFBa0UzQixNQUFsRSxjQUFBLGNBQUEwQixRQUFrRTFCO1FBQUdxQixFQUFFTyxZQUFVQyxPQUFPQyxPQUFPOUIsS0FBR0EsRUFBRTRCO1lBQVdHO2dCQUFhQyxPQUFNWDtnQkFBRVksYUFBWTtnQkFBRUMsV0FBVTtnQkFBRUMsZUFBYzs7WUFBS25DLE1BQUk2QixPQUFPTyxpQkFBZVAsT0FBT08sZUFBZWYsR0FBRXJCLEtBQUdxQixFQUFFZ0IsWUFBVXJDOztJQUFHLFNBQVNzQyxFQUFFakIsR0FBRXJCO1FBQUcsTUFBS3FCLGFBQWFyQixJQUFHLE1BQU0sSUFBSTJCLFVBQVU7O0lBQXFDLElBQUlwQyxJQUFFLHFCQUFtQmdELFVBQVEsWUFBQWIsUUFBaUJhLE9BQU9DLFlBQVMsU0FBU25CO1FBQUcsY0FBY0EsTUFBZCxjQUFBLGNBQUFLLFFBQWNMO1FBQUcsU0FBU0E7UUFBRyxPQUFPQSxLQUFHLHFCQUFtQmtCLFVBQVFsQixFQUFFVSxnQkFBY1EsVUFBUWxCLE1BQUlrQixPQUFPWCxZQUFVLGtCQUFnQlAsTUFBM0YsY0FBQSxjQUFBSyxRQUEyRkw7T0FBR29CLElBQUU7UUFBVyxTQUFTcEIsRUFBRUEsR0FBRXJCO1lBQUcsS0FBSSxJQUFJc0MsSUFBRSxHQUFFQSxJQUFFdEMsRUFBRW5CLFFBQU95RCxLQUFJO2dCQUFDLElBQUkvQyxJQUFFUyxFQUFFc0M7Z0JBQUcvQyxFQUFFMEMsYUFBVzFDLEVBQUUwQyxlQUFhLEdBQUUxQyxFQUFFNEMsZ0JBQWMsR0FBRSxXQUFVNUMsTUFBSUEsRUFBRTJDLFlBQVU7Z0JBQUdMLE9BQU9hLGVBQWVyQixHQUFFOUIsRUFBRW9ELEtBQUlwRDs7O1FBQUksT0FBTyxTQUFTUyxHQUFFc0MsR0FBRS9DO1lBQUcsT0FBTytDLEtBQUdqQixFQUFFckIsRUFBRTRCLFdBQVVVLElBQUcvQyxLQUFHOEIsRUFBRXJCLEdBQUVULElBQUdTOztTQUFNNEMsSUFBRSxTQUFTdkI7UUFBRyxTQUFTckIsRUFBRXFCO1lBQUcsVUFBU3dCLFNBQVNDLEtBQUt6QixHQUFHMEIsTUFBTSxpQkFBaUIsR0FBR0M7O1FBQWMsU0FBU1YsRUFBRWpCO1lBQUcsUUFBT0EsRUFBRSxNQUFJQSxHQUFHNEI7O1FBQVMsU0FBUzFEO1lBQUk7Z0JBQU8yRCxVQUFTQyxFQUFFQztnQkFBSUMsY0FBYUYsRUFBRUM7Z0JBQUlFLFFBQU8sU0FBQUEsT0FBU3REO29CQUFHLElBQUdxQixFQUFFckIsRUFBRVUsUUFBUTZDLEdBQUdDLE9BQU0sT0FBT3hELEVBQUV5RCxVQUFVQyxRQUFRQyxNQUFNSCxNQUFLSTs7OztRQUFhLFNBQVNuQjtZQUFJLElBQUdvQixPQUFPQyxPQUFNLFFBQU87WUFBRSxJQUFJekMsSUFBRTBDLFNBQVNDLGNBQWM7WUFBYSxLQUFJLElBQUloRSxLQUFLaUUsR0FBYjtnQkFBZSxTQUFRLE1BQUk1QyxFQUFFNkMsTUFBTWxFLElBQUc7b0JBQU9vRCxLQUFJYSxFQUFFakU7OztZQUFJLFFBQU87O1FBQUUsU0FBUzRDLEVBQUU1QztZQUFHLElBQUlzQyxJQUFFa0IsTUFBS2pFLEtBQUc7WUFBRSxPQUFPOEIsRUFBRW1DLE1BQU1XLElBQUlDLEVBQUVDLGdCQUFlO2dCQUFXOUUsS0FBRztnQkFBSStFLFdBQVc7Z0JBQVcvRSxLQUFHNkUsRUFBRUcscUJBQXFCakM7ZUFBSXRDLElBQUd3RDs7UUFBSyxTQUFTZ0I7WUFBSXJCLElBQUVWLEtBQUlwQixFQUFFQyxHQUFHbUQsdUJBQXFCN0IsR0FBRXdCLEVBQUVNLDRCQUEwQnJELEVBQUVzRCxNQUFNQyxRQUFRUixFQUFFQyxrQkFBZ0I5RTs7UUFBSyxJQUFJNEQsS0FBRyxHQUFFMEIsSUFBRSxLQUFJWjtZQUFHYSxrQkFBaUI7WUFBc0JDLGVBQWM7WUFBZ0JDLGFBQVk7WUFBZ0NDLFlBQVc7V0FBaUJiO1lBQUdDLGdCQUFlO1lBQWtCYSxRQUFPLFNBQUFBLE9BQVM3RDtnQkFBRyxHQUFBO29CQUFHQSxRQUFNOEQsS0FBS0MsV0FBU1A7eUJBQVNkLFNBQVNzQixlQUFlaEU7Z0JBQUksT0FBT0E7O1lBQUdpRSx3QkFBdUIsU0FBQUEsdUJBQVNqRTtnQkFBRyxJQUFJckIsSUFBRXFCLEVBQUVrRSxhQUFhO2dCQUFlLE9BQU92RixNQUFJQSxJQUFFcUIsRUFBRWtFLGFBQWEsV0FBUyxJQUFHdkYsSUFBRSxXQUFXd0YsS0FBS3hGLEtBQUdBLElBQUU7Z0JBQU1BOztZQUFHeUYsUUFBTyxTQUFBQSxPQUFTcEU7Z0JBQUcsT0FBT0EsRUFBRXFFOztZQUFjbkIsc0JBQXFCLFNBQUFBLHFCQUFTdkU7Z0JBQUdxQixFQUFFckIsR0FBR2lCLFFBQVFrQyxFQUFFQzs7WUFBTXNCLHVCQUFzQixTQUFBQTtnQkFBVyxPQUFPaUIsUUFBUXhDOztZQUFJeUMsaUJBQWdCLFNBQUFBLGdCQUFTdkUsR0FBRTlCLEdBQUVrRDtnQkFBRyxLQUFJLElBQUlHLEtBQUtILEdBQWI7b0JBQWUsSUFBR0EsRUFBRW9ELGVBQWVqRCxJQUFHO3dCQUFDLElBQUk0QixJQUFFL0IsRUFBRUcsSUFBR08sSUFBRTVELEVBQUVxRCxJQUFHaUMsSUFBRTFCLEtBQUdiLEVBQUVhLEtBQUcsWUFBVW5ELEVBQUVtRDt3QkFBRyxLQUFJLElBQUkyQyxPQUFPdEIsR0FBR2dCLEtBQUtYLElBQUcsTUFBTSxJQUFJekQsTUFBTUMsRUFBRTBFLGdCQUFjLFFBQU0sYUFBV25ELElBQUUsc0JBQW9CaUMsSUFBRSxTQUFPLHdCQUFzQkwsSUFBRTs7Ozs7UUFBVSxPQUFPQSxLQUFJSjtNQUFHakQsU0FBUXFELEtBQUcsU0FBU25EO1FBQUcsSUFBSXJCLElBQUUsU0FBUVQsSUFBRSxpQkFBZ0JpRixJQUFFLFlBQVdyQixJQUFFLE1BQUlxQixHQUFFSyxJQUFFLGFBQVlaLElBQUU1QyxFQUFFQyxHQUFHdEIsSUFBR29FLElBQUUsS0FBSTRCO1lBQUdDLFNBQVE7V0FBMEJDO1lBQUdDLE9BQU0sVUFBUWhEO1lBQUVpRCxRQUFPLFdBQVNqRDtZQUFFa0QsZ0JBQWUsVUFBUWxELElBQUUwQjtXQUFHeUI7WUFBR0MsT0FBTTtZQUFRQyxNQUFLO1lBQU9DLE1BQUs7V0FBUUMsSUFBRTtZQUFXLFNBQVMxRyxFQUFFcUI7Z0JBQUdpQixFQUFFa0IsTUFBS3hELElBQUd3RCxLQUFLbUQsV0FBU3RGOztZQUFFLE9BQU9yQixFQUFFNEIsVUFBVWdGLFFBQU0sU0FBU3ZGO2dCQUFHQSxJQUFFQSxLQUFHbUMsS0FBS21EO2dCQUFTLElBQUkzRyxJQUFFd0QsS0FBS3FELGdCQUFnQnhGLElBQUdpQixJQUFFa0IsS0FBS3NELG1CQUFtQjlHO2dCQUFHc0MsRUFBRXlFLHdCQUFzQnZELEtBQUt3RCxlQUFlaEg7ZUFBSUEsRUFBRTRCLFVBQVVxRixVQUFRO2dCQUFXNUYsRUFBRTZGLFdBQVcxRCxLQUFLbUQsVUFBU25DLElBQUdoQixLQUFLbUQsV0FBUztlQUFNM0csRUFBRTRCLFVBQVVpRixrQkFBZ0IsU0FBUzdHO2dCQUFHLElBQUlzQyxJQUFFTSxFQUFFMEMsdUJBQXVCdEYsSUFBR1QsS0FBRztnQkFBRSxPQUFPK0MsTUFBSS9DLElBQUU4QixFQUFFaUIsR0FBRyxLQUFJL0MsTUFBSUEsSUFBRThCLEVBQUVyQixHQUFHbUgsUUFBUSxNQUFJYixFQUFFQyxPQUFPLEtBQUloSDtlQUFHUyxFQUFFNEIsVUFBVWtGLHFCQUFtQixTQUFTOUc7Z0JBQUcsSUFBSXNDLElBQUVqQixFQUFFK0YsTUFBTWxCLEVBQUVDO2dCQUFPLE9BQU85RSxFQUFFckIsR0FBR2lCLFFBQVFxQixJQUFHQTtlQUFHdEMsRUFBRTRCLFVBQVVvRixpQkFBZSxTQUFTaEg7Z0JBQUcsSUFBSXNDLElBQUVrQjtnQkFBSyxPQUFPbkMsRUFBRXJCLEdBQUdaLFlBQVlrSCxFQUFFRyxPQUFNN0QsRUFBRThCLDJCQUF5QnJELEVBQUVyQixHQUFHSCxTQUFTeUcsRUFBRUUsYUFBV25GLEVBQUVyQixHQUFHbUUsSUFBSXZCLEVBQUV5QixnQkFBZSxTQUFTaEQ7b0JBQUcsT0FBT2lCLEVBQUUrRSxnQkFBZ0JySCxHQUFFcUI7bUJBQUtvRCxxQkFBcUJMLFVBQVFaLEtBQUs2RCxnQkFBZ0JySDtlQUFJQSxFQUFFNEIsVUFBVXlGLGtCQUFnQixTQUFTckg7Z0JBQUdxQixFQUFFckIsR0FBR3NILFNBQVNyRyxRQUFRaUYsRUFBRUUsUUFBUW1CO2VBQVV2SCxFQUFFd0gsbUJBQWlCLFNBQVNsRjtnQkFBRyxPQUFPa0IsS0FBS2hFLEtBQUs7b0JBQVcsSUFBSUQsSUFBRThCLEVBQUVtQyxPQUFNZixJQUFFbEQsRUFBRWtJLEtBQUtqRDtvQkFBRy9CLE1BQUlBLElBQUUsSUFBSXpDLEVBQUV3RCxPQUFNakUsRUFBRWtJLEtBQUtqRCxHQUFFL0IsS0FBSSxZQUFVSCxLQUFHRyxFQUFFSCxHQUFHa0I7O2VBQVN4RCxFQUFFMEgsaUJBQWUsU0FBU3JHO2dCQUFHLE9BQU8sU0FBU3JCO29CQUFHQSxLQUFHQSxFQUFFZ0Isa0JBQWlCSyxFQUFFdUYsTUFBTXBEOztlQUFRZixFQUFFekMsR0FBRTtnQkFBTzJDLEtBQUk7Z0JBQVVnRixLQUFJLFNBQUFBO29CQUFXLE9BQU9wSTs7a0JBQU1TOztRQUFLLE9BQU9xQixFQUFFMEMsVUFBVWhFLEdBQUdtRyxFQUFFRyxnQkFBZUwsRUFBRUMsU0FBUVMsRUFBRWdCLGVBQWUsSUFBSWhCLE9BQUlyRixFQUFFQyxHQUFHdEIsS0FBRzBHLEVBQUVjO1FBQWlCbkcsRUFBRUMsR0FBR3RCLEdBQUc0SCxjQUFZbEIsR0FBRXJGLEVBQUVDLEdBQUd0QixHQUFHNkgsYUFBVztZQUFXLE9BQU94RyxFQUFFQyxHQUFHdEIsS0FBR2lFLEdBQUV5QyxFQUFFYztXQUFrQmQ7TUFBR3ZGLFNBQVEsU0FBU0U7UUFBRyxJQUFJckIsSUFBRSxVQUFTVCxJQUFFLGlCQUFnQnFELElBQUUsYUFBWTRCLElBQUUsTUFBSTVCLEdBQUVPLElBQUUsYUFBWTBCLElBQUV4RCxFQUFFQyxHQUFHdEIsSUFBR2lFO1lBQUc2RCxRQUFPO1lBQVNDLFFBQU87WUFBTUMsT0FBTTtXQUFTNUQ7WUFBRzZELG9CQUFtQjtZQUEwQkMsYUFBWTtZQUEwQkMsT0FBTTtZQUFRTCxRQUFPO1lBQVVDLFFBQU87V0FBUS9CO1lBQUdLLGdCQUFlLFVBQVE3QixJQUFFckI7WUFBRWlGLHFCQUFvQixVQUFRNUQsSUFBRXJCLElBQUUsT0FBSyxTQUFPcUIsSUFBRXJCO1dBQUkrQyxJQUFFO1lBQVcsU0FBU2xHLEVBQUVxQjtnQkFBR2lCLEVBQUVrQixNQUFLeEQsSUFBR3dELEtBQUttRCxXQUFTdEY7O1lBQUUsT0FBT3JCLEVBQUU0QixVQUFVeUcsU0FBTztnQkFBVyxJQUFJckksS0FBRyxHQUFFc0MsSUFBRWpCLEVBQUVtQyxLQUFLbUQsVUFBVVEsUUFBUS9DLEVBQUU4RCxhQUFhO2dCQUFHLElBQUc1RixHQUFFO29CQUFDLElBQUkvQyxJQUFFOEIsRUFBRW1DLEtBQUttRCxVQUFVckgsS0FBSzhFLEVBQUUrRCxPQUFPO29CQUFHLElBQUc1SSxHQUFFO3dCQUFDLElBQUcsWUFBVUEsRUFBRStJLE1BQUssSUFBRy9JLEVBQUVKLFdBQVNrQyxFQUFFbUMsS0FBS21ELFVBQVU5RyxTQUFTb0UsRUFBRTZELFNBQVE5SCxLQUFHLFFBQU07NEJBQUMsSUFBSXlDLElBQUVwQixFQUFFaUIsR0FBR2hELEtBQUs4RSxFQUFFMEQsUUFBUTs0QkFBR3JGLEtBQUdwQixFQUFFb0IsR0FBR3JELFlBQVk2RSxFQUFFNkQ7O3dCQUFROUgsTUFBSVQsRUFBRUosV0FBU2tDLEVBQUVtQyxLQUFLbUQsVUFBVTlHLFNBQVNvRSxFQUFFNkQsU0FBUXpHLEVBQUU5QixHQUFHMEIsUUFBUTt3QkFBVzFCLEVBQUVnSjs7O2dCQUFTL0UsS0FBS21ELFNBQVM2QixhQUFhLGlCQUFnQm5ILEVBQUVtQyxLQUFLbUQsVUFBVTlHLFNBQVNvRSxFQUFFNkQ7Z0JBQVM5SCxLQUFHcUIsRUFBRW1DLEtBQUttRCxVQUFVOEIsWUFBWXhFLEVBQUU2RDtlQUFTOUgsRUFBRTRCLFVBQVVxRixVQUFRO2dCQUFXNUYsRUFBRTZGLFdBQVcxRCxLQUFLbUQsVUFBUy9ELElBQUdZLEtBQUttRCxXQUFTO2VBQU0zRyxFQUFFd0gsbUJBQWlCLFNBQVNsRjtnQkFBRyxPQUFPa0IsS0FBS2hFLEtBQUs7b0JBQVcsSUFBSUQsSUFBRThCLEVBQUVtQyxNQUFNaUUsS0FBSzdFO29CQUFHckQsTUFBSUEsSUFBRSxJQUFJUyxFQUFFd0QsT0FBTW5DLEVBQUVtQyxNQUFNaUUsS0FBSzdFLEdBQUVyRCxLQUFJLGFBQVcrQyxLQUFHL0MsRUFBRStDOztlQUFRRyxFQUFFekMsR0FBRTtnQkFBTzJDLEtBQUk7Z0JBQVVnRixLQUFJLFNBQUFBO29CQUFXLE9BQU9wSTs7a0JBQU1TOztRQUFLLE9BQU9xQixFQUFFMEMsVUFBVWhFLEdBQUdpRyxFQUFFSyxnQkFBZWpDLEVBQUU2RCxvQkFBbUIsU0FBU2pJO1lBQUdBLEVBQUVnQjtZQUFpQixJQUFJc0IsSUFBRXRDLEVBQUVVO1lBQU9XLEVBQUVpQixHQUFHekMsU0FBU29FLEVBQUU4RCxZQUFVekYsSUFBRWpCLEVBQUVpQixHQUFHNkUsUUFBUS9DLEVBQUUyRCxVQUFTN0IsRUFBRXNCLGlCQUFpQjFFLEtBQUt6QixFQUFFaUIsSUFBRztXQUFZdkMsR0FBR2lHLEVBQUVvQyxxQkFBb0JoRSxFQUFFNkQsb0JBQW1CLFNBQVNqSTtZQUFHLElBQUlzQyxJQUFFakIsRUFBRXJCLEVBQUVVLFFBQVF5RyxRQUFRL0MsRUFBRTJELFFBQVE7WUFBRzFHLEVBQUVpQixHQUFHbUcsWUFBWXhFLEVBQUUrRCxPQUFNLGVBQWV4QyxLQUFLeEYsRUFBRXNJO1lBQVNqSCxFQUFFQyxHQUFHdEIsS0FBR2tHLEVBQUVzQixrQkFBaUJuRyxFQUFFQyxHQUFHdEIsR0FBRzRILGNBQVkxQixHQUFFN0UsRUFBRUMsR0FBR3RCLEdBQUc2SCxhQUFXO1lBQVcsT0FBT3hHLEVBQUVDLEdBQUd0QixLQUFHNkUsR0FBRXFCLEVBQUVzQjtXQUFrQnRCO01BQUcvRSxTQUFRLFNBQVNFO1FBQUcsSUFBSXJCLElBQUUsWUFBV3dFLElBQUUsaUJBQWdCckIsSUFBRSxlQUFjMEIsSUFBRSxNQUFJMUIsR0FBRWMsSUFBRSxhQUFZRyxJQUFFL0MsRUFBRUMsR0FBR3RCLElBQUdnRyxJQUFFLEtBQUlFLElBQUUsSUFBR0ksSUFBRSxJQUFHSTtZQUFHZ0MsVUFBUztZQUFJQyxXQUFVO1lBQUVDLFFBQU87WUFBRUMsT0FBTTtZQUFRQyxPQUFNO1dBQUdDO1lBQUdMLFVBQVM7WUFBbUJDLFVBQVM7WUFBVUMsT0FBTTtZQUFtQkMsT0FBTTtZQUFtQkMsTUFBSztXQUFXRTtZQUFHQyxNQUFLO1lBQU9DLE1BQUs7WUFBT0MsTUFBSztZQUFPQyxPQUFNO1dBQVNDO1lBQUdDLE9BQU0sVUFBUXpFO1lBQUUwRSxNQUFLLFNBQU8xRTtZQUFFMkUsU0FBUSxZQUFVM0U7WUFBRTRFLFlBQVcsZUFBYTVFO1lBQUU2RSxZQUFXLGVBQWE3RTtZQUFFOEUsZUFBYyxTQUFPOUUsSUFBRVo7WUFBRW9DLGdCQUFlLFVBQVF4QixJQUFFWjtXQUFHMkY7WUFBR0MsVUFBUztZQUFXL0IsUUFBTztZQUFTd0IsT0FBTTtZQUFRRixPQUFNO1lBQXNCRCxNQUFLO1lBQXFCRixNQUFLO1lBQXFCQyxNQUFLO1lBQXFCWSxNQUFLO1dBQWlCQztZQUFHakMsUUFBTztZQUFVa0MsYUFBWTtZQUF3QkYsTUFBSztZQUFpQkcsV0FBVTtZQUEyQ0MsWUFBVztZQUF1QkMsWUFBVztZQUFnQ0MsV0FBVTtXQUEwQkMsSUFBRTtZQUFXLFNBQVNwRyxFQUFFakUsR0FBRVQ7Z0JBQUcrQyxFQUFFa0IsTUFBS1MsSUFBR1QsS0FBSzhHLFNBQU8sTUFBSzlHLEtBQUsrRyxZQUFVLE1BQUsvRyxLQUFLZ0gsaUJBQWU7Z0JBQUtoSCxLQUFLaUgsYUFBVyxHQUFFakgsS0FBS2tILGNBQVksR0FBRWxILEtBQUttSCxVQUFRbkgsS0FBS29ILFdBQVdyTCxJQUFHaUUsS0FBS21ELFdBQVN0RixFQUFFckIsR0FBRztnQkFBR3dELEtBQUtxSCxxQkFBbUJ4SixFQUFFbUMsS0FBS21ELFVBQVVySCxLQUFLeUssRUFBRUcsWUFBWSxJQUFHMUcsS0FBS3NIOztZQUFxQixPQUFPN0csRUFBRXJDLFVBQVVtSixPQUFLO2dCQUFXLElBQUd2SCxLQUFLa0gsWUFBVyxNQUFNLElBQUl0SixNQUFNO2dCQUF1Qm9DLEtBQUt3SCxPQUFPaEMsRUFBRUM7ZUFBT2hGLEVBQUVyQyxVQUFVcUosa0JBQWdCO2dCQUFXbEgsU0FBU21ILFVBQVExSCxLQUFLdUg7ZUFBUTlHLEVBQUVyQyxVQUFVdUosT0FBSztnQkFBVyxJQUFHM0gsS0FBS2tILFlBQVcsTUFBTSxJQUFJdEosTUFBTTtnQkFBdUJvQyxLQUFLd0gsT0FBT2hDLEVBQUVvQztlQUFXbkgsRUFBRXJDLFVBQVVpSCxRQUFNLFNBQVM3STtnQkFBR0EsTUFBSXdELEtBQUtpSCxhQUFXLElBQUdwSixFQUFFbUMsS0FBS21ELFVBQVVySCxLQUFLeUssRUFBRUUsV0FBVyxNQUFJckgsRUFBRThCLDRCQUEwQjlCLEVBQUUyQixxQkFBcUJmLEtBQUttRDtnQkFBVW5ELEtBQUs2SCxPQUFPLEtBQUlDLGNBQWM5SCxLQUFLK0csWUFBVy9HLEtBQUsrRyxZQUFVO2VBQU10RyxFQUFFckMsVUFBVXlKLFFBQU0sU0FBU2hLO2dCQUFHQSxNQUFJbUMsS0FBS2lILGFBQVcsSUFBR2pILEtBQUsrRyxjQUFZZSxjQUFjOUgsS0FBSytHLFlBQVcvRyxLQUFLK0csWUFBVTtnQkFBTS9HLEtBQUttSCxRQUFRakMsYUFBV2xGLEtBQUtpSCxjQUFZakgsS0FBSytHLFlBQVVnQixhQUFheEgsU0FBU3lILGtCQUFnQmhJLEtBQUt5SCxrQkFBZ0J6SCxLQUFLdUgsTUFBTVUsS0FBS2pJLE9BQU1BLEtBQUttSCxRQUFRakM7ZUFBWXpFLEVBQUVyQyxVQUFVOEosS0FBRyxTQUFTMUw7Z0JBQUcsSUFBSXNDLElBQUVrQjtnQkFBS0EsS0FBS2dILGlCQUFlbkosRUFBRW1DLEtBQUttRCxVQUFVckgsS0FBS3lLLEVBQUVDLGFBQWE7Z0JBQUcsSUFBSXpLLElBQUVpRSxLQUFLbUksY0FBY25JLEtBQUtnSDtnQkFBZ0IsTUFBS3hLLElBQUV3RCxLQUFLOEcsT0FBT3pMLFNBQU8sS0FBR21CLElBQUUsSUFBRztvQkFBQyxJQUFHd0QsS0FBS2tILFlBQVcsWUFBWXJKLEVBQUVtQyxLQUFLbUQsVUFBVXhDLElBQUlrRixFQUFFRSxNQUFLO3dCQUFXLE9BQU9qSCxFQUFFb0osR0FBRzFMOztvQkFBSyxJQUFHVCxNQUFJUyxHQUFFLE9BQU93RCxLQUFLcUYsY0FBYXJGLEtBQUs2SDtvQkFBUSxJQUFJNUksSUFBRXpDLElBQUVULElBQUV5SixFQUFFQyxPQUFLRCxFQUFFb0M7b0JBQVM1SCxLQUFLd0gsT0FBT3ZJLEdBQUVlLEtBQUs4RyxPQUFPdEs7O2VBQU1pRSxFQUFFckMsVUFBVXFGLFVBQVE7Z0JBQVc1RixFQUFFbUMsS0FBS21ELFVBQVVpRixJQUFJL0csSUFBR3hELEVBQUU2RixXQUFXMUQsS0FBS21ELFVBQVN4RCxJQUFHSyxLQUFLOEcsU0FBTyxNQUFLOUcsS0FBS21ILFVBQVE7Z0JBQUtuSCxLQUFLbUQsV0FBUyxNQUFLbkQsS0FBSytHLFlBQVUsTUFBSy9HLEtBQUtpSCxZQUFVLE1BQUtqSCxLQUFLa0gsYUFBVztnQkFBS2xILEtBQUtnSCxpQkFBZSxNQUFLaEgsS0FBS3FILHFCQUFtQjtlQUFNNUcsRUFBRXJDLFVBQVVnSixhQUFXLFNBQVN0STtnQkFBRyxPQUFPQSxJQUFFakIsRUFBRXdLLFdBQVVuRixHQUFFcEUsSUFBR00sRUFBRWdELGdCQUFnQjVGLEdBQUVzQyxHQUFFeUcsSUFBR3pHO2VBQUcyQixFQUFFckMsVUFBVWtKLHFCQUFtQjtnQkFBVyxJQUFJOUssSUFBRXdEO2dCQUFLQSxLQUFLbUgsUUFBUWhDLFlBQVV0SCxFQUFFbUMsS0FBS21ELFVBQVU1RyxHQUFHc0osRUFBRUcsU0FBUSxTQUFTbkk7b0JBQUcsT0FBT3JCLEVBQUU4TCxTQUFTeks7b0JBQUssWUFBVW1DLEtBQUttSCxRQUFROUIsU0FBTyxrQkFBaUI5RSxTQUFTZ0ksbUJBQWlCMUssRUFBRW1DLEtBQUttRCxVQUFVNUcsR0FBR3NKLEVBQUVJLFlBQVcsU0FBU3BJO29CQUFHLE9BQU9yQixFQUFFNkksTUFBTXhIO21CQUFLdEIsR0FBR3NKLEVBQUVLLFlBQVcsU0FBU3JJO29CQUFHLE9BQU9yQixFQUFFcUwsTUFBTWhLOztlQUFNNEMsRUFBRXJDLFVBQVVrSyxXQUFTLFNBQVN6SztnQkFBRyxLQUFJLGtCQUFrQm1FLEtBQUtuRSxFQUFFWCxPQUFPc0wsVUFBUyxRQUFPM0ssRUFBRTRLO2tCQUFPLEtBQUsvRjtvQkFBRTdFLEVBQUVMLGtCQUFpQndDLEtBQUsySDtvQkFBTzs7a0JBQU0sS0FBSzdFO29CQUFFakYsRUFBRUwsa0JBQWlCd0MsS0FBS3VIO29CQUFPOztrQkFBTTtvQkFBUTs7ZUFBUzlHLEVBQUVyQyxVQUFVK0osZ0JBQWMsU0FBUzNMO2dCQUFHLE9BQU93RCxLQUFLOEcsU0FBT2pKLEVBQUU2SyxVQUFVN0ssRUFBRXJCLEdBQUdYLFNBQVNDLEtBQUt5SyxFQUFFRCxRQUFPdEcsS0FBSzhHLE9BQU82QixRQUFRbk07ZUFBSWlFLEVBQUVyQyxVQUFVd0ssc0JBQW9CLFNBQVMvSyxHQUFFckI7Z0JBQUcsSUFBSXNDLElBQUVqQixNQUFJMkgsRUFBRUMsTUFBSzFKLElBQUU4QixNQUFJMkgsRUFBRW9DLFVBQVMzSSxJQUFFZSxLQUFLbUksY0FBYzNMLElBQUc0QyxJQUFFWSxLQUFLOEcsT0FBT3pMLFNBQU8sR0FBRTJGLElBQUVqRixLQUFHLE1BQUlrRCxLQUFHSCxLQUFHRyxNQUFJRztnQkFBRSxJQUFHNEIsTUFBSWhCLEtBQUttSCxRQUFRN0IsTUFBSyxPQUFPOUk7Z0JBQUUsSUFBSW1ELElBQUU5QixNQUFJMkgsRUFBRW9DLFlBQVUsSUFBRSxHQUFFdkcsS0FBR3BDLElBQUVVLEtBQUdLLEtBQUs4RyxPQUFPekw7Z0JBQU8sT0FBT2dHLE9BQUssSUFBRXJCLEtBQUs4RyxPQUFPOUcsS0FBSzhHLE9BQU96TCxTQUFPLEtBQUcyRSxLQUFLOEcsT0FBT3pGO2VBQUlaLEVBQUVyQyxVQUFVeUsscUJBQW1CLFNBQVNyTSxHQUFFc0M7Z0JBQUcsSUFBSS9DLElBQUU4QixFQUFFK0YsTUFBTWlDLEVBQUVDO29CQUFPZ0QsZUFBY3RNO29CQUFFdU0sV0FBVWpLOztnQkFBSSxPQUFPakIsRUFBRW1DLEtBQUttRCxVQUFVMUYsUUFBUTFCLElBQUdBO2VBQUcwRSxFQUFFckMsVUFBVTRLLDZCQUEyQixTQUFTeE07Z0JBQUcsSUFBR3dELEtBQUtxSCxvQkFBbUI7b0JBQUN4SixFQUFFbUMsS0FBS3FILG9CQUFvQnZMLEtBQUt5SyxFQUFFakMsUUFBUTFJLFlBQVl3SyxFQUFFOUI7b0JBQVEsSUFBSXhGLElBQUVrQixLQUFLcUgsbUJBQW1CNEIsU0FBU2pKLEtBQUttSSxjQUFjM0w7b0JBQUlzQyxLQUFHakIsRUFBRWlCLEdBQUc3QyxTQUFTbUssRUFBRTlCOztlQUFVN0QsRUFBRXJDLFVBQVVvSixTQUFPLFNBQVNoTCxHQUFFc0M7Z0JBQUcsSUFBSS9DLElBQUVpRSxNQUFLZixJQUFFcEIsRUFBRW1DLEtBQUttRCxVQUFVckgsS0FBS3lLLEVBQUVDLGFBQWEsSUFBR3hGLElBQUVsQyxLQUFHRyxLQUFHZSxLQUFLNEksb0JBQW9CcE0sR0FBRXlDLElBQUdVLElBQUV3QyxRQUFRbkMsS0FBSytHLFlBQVcxRixTQUFPLEdBQUVaLFNBQU8sR0FBRUcsU0FBTztnQkFBRSxJQUFHcEUsTUFBSWdKLEVBQUVDLFFBQU1wRSxJQUFFK0UsRUFBRVQsTUFBS2xGLElBQUUyRixFQUFFWCxNQUFLN0UsSUFBRTRFLEVBQUVHLFNBQU90RSxJQUFFK0UsRUFBRVIsT0FBTW5GLElBQUUyRixFQUFFVjtnQkFBSzlFLElBQUU0RSxFQUFFSSxRQUFPNUUsS0FBR25ELEVBQUVtRCxHQUFHM0UsU0FBUytKLEVBQUU5QixTQUFRLGFBQVl0RSxLQUFLa0gsY0FBWTtnQkFBRyxJQUFJeEUsSUFBRTFDLEtBQUs2SSxtQkFBbUI3SCxHQUFFSjtnQkFBRyxLQUFJOEIsRUFBRWEsd0JBQXNCdEUsS0FBRytCLEdBQUU7b0JBQUNoQixLQUFLa0gsY0FBWSxHQUFFdkgsS0FBR0ssS0FBS3FGLFNBQVFyRixLQUFLZ0osMkJBQTJCaEk7b0JBQUcsSUFBSThCLElBQUVqRixFQUFFK0YsTUFBTWlDLEVBQUVFO3dCQUFNK0MsZUFBYzlIO3dCQUFFK0gsV0FBVW5JOztvQkFBSXhCLEVBQUU4QiwyQkFBeUJyRCxFQUFFbUMsS0FBS21ELFVBQVU5RyxTQUFTK0osRUFBRU4sVUFBUWpJLEVBQUVtRCxHQUFHL0UsU0FBU3dFO29CQUFHckIsRUFBRTZDLE9BQU9qQixJQUFHbkQsRUFBRW9CLEdBQUdoRCxTQUFTb0YsSUFBR3hELEVBQUVtRCxHQUFHL0UsU0FBU29GLElBQUd4RCxFQUFFb0IsR0FBRzBCLElBQUl2QixFQUFFeUIsZ0JBQWU7d0JBQVdoRCxFQUFFbUQsR0FBR3BGLFlBQVl5RixJQUFFLE1BQUlaLEdBQUd4RSxTQUFTbUssRUFBRTlCLFNBQVF6RyxFQUFFb0IsR0FBR3JELFlBQVl3SyxFQUFFOUIsU0FBTyxNQUFJN0QsSUFBRSxNQUFJWTt3QkFBR3RGLEVBQUVtTCxjQUFZLEdBQUVwRyxXQUFXOzRCQUFXLE9BQU9qRCxFQUFFOUIsRUFBRW9ILFVBQVUxRixRQUFRcUY7MkJBQUk7dUJBQUs3QixxQkFBcUJ1QixPQUFLM0UsRUFBRW9CLEdBQUdyRCxZQUFZd0ssRUFBRTlCLFNBQVF6RyxFQUFFbUQsR0FBRy9FLFNBQVNtSyxFQUFFOUI7b0JBQVF0RSxLQUFLa0gsY0FBWSxHQUFFckosRUFBRW1DLEtBQUttRCxVQUFVMUYsUUFBUXFGLEtBQUluRCxLQUFHSyxLQUFLNkg7O2VBQVVwSCxFQUFFdUQsbUJBQWlCLFNBQVN4SDtnQkFBRyxPQUFPd0QsS0FBS2hFLEtBQUs7b0JBQVcsSUFBSThDLElBQUVqQixFQUFFbUMsTUFBTWlFLEtBQUt0RSxJQUFHVixJQUFFcEIsRUFBRXdLLFdBQVVuRixHQUFFckYsRUFBRW1DLE1BQU1pRTtvQkFBUSxjQUFZLHNCQUFvQnpILElBQUUsY0FBWVQsRUFBRVMsT0FBS3FCLEVBQUV3SyxPQUFPcEosR0FBRXpDO29CQUFHLElBQUk0QyxJQUFFLG1CQUFpQjVDLElBQUVBLElBQUV5QyxFQUFFbUc7b0JBQU0sSUFBR3RHLE1BQUlBLElBQUUsSUFBSTJCLEVBQUVULE1BQUtmLElBQUdwQixFQUFFbUMsTUFBTWlFLEtBQUt0RSxHQUFFYixLQUFJLG1CQUFpQnRDLEdBQUVzQyxFQUFFb0osR0FBRzFMLFNBQVEsSUFBRyxtQkFBaUI0QyxHQUFFO3dCQUFDLFNBQVEsTUFBSU4sRUFBRU0sSUFBRyxNQUFNLElBQUl4QixNQUFNLHNCQUFvQndCLElBQUU7d0JBQUtOLEVBQUVNOzJCQUFVSCxFQUFFaUcsYUFBV3BHLEVBQUV1RyxTQUFRdkcsRUFBRStJOztlQUFZcEgsRUFBRXlJLHVCQUFxQixTQUFTMU07Z0JBQUcsSUFBSXNDLElBQUVNLEVBQUUwQyx1QkFBdUI5QjtnQkFBTSxJQUFHbEIsR0FBRTtvQkFBQyxJQUFJL0MsSUFBRThCLEVBQUVpQixHQUFHO29CQUFHLElBQUcvQyxLQUFHOEIsRUFBRTlCLEdBQUdNLFNBQVMrSixFQUFFQyxXQUFVO3dCQUFDLElBQUlwSCxJQUFFcEIsRUFBRXdLLFdBQVV4SyxFQUFFOUIsR0FBR2tJLFFBQU9wRyxFQUFFbUMsTUFBTWlFLFNBQVFqRCxJQUFFaEIsS0FBSytCLGFBQWE7d0JBQWlCZixNQUFJL0IsRUFBRWlHLFlBQVUsSUFBR3pFLEVBQUV1RCxpQkFBaUIxRSxLQUFLekIsRUFBRTlCLElBQUdrRCxJQUFHK0IsS0FBR25ELEVBQUU5QixHQUFHa0ksS0FBS3RFLEdBQUd1SSxHQUFHbEg7d0JBQUd4RSxFQUFFZ0I7OztlQUFvQnlCLEVBQUV3QixHQUFFO2dCQUFPdEIsS0FBSTtnQkFBVWdGLEtBQUksU0FBQUE7b0JBQVcsT0FBT25EOzs7Z0JBQUs3QixLQUFJO2dCQUFVZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPakI7O2tCQUFNekM7O1FBQUssT0FBTzVDLEVBQUUwQyxVQUFVaEUsR0FBR3NKLEVBQUVoRCxnQkFBZTBELEVBQUVJLFlBQVdFLEVBQUVxQyx1QkFBc0JyTCxFQUFFd0MsUUFBUTlELEdBQUdzSixFQUFFTSxlQUFjO1lBQVd0SSxFQUFFMEksRUFBRUssV0FBVzVLLEtBQUs7Z0JBQVcsSUFBSVEsSUFBRXFCLEVBQUVtQztnQkFBTTZHLEVBQUU3QyxpQkFBaUIxRSxLQUFLOUMsR0FBRUEsRUFBRXlIOztZQUFZcEcsRUFBRUMsR0FBR3RCLEtBQUdxSyxFQUFFN0Msa0JBQWlCbkcsRUFBRUMsR0FBR3RCLEdBQUc0SCxjQUFZeUMsR0FBRWhKLEVBQUVDLEdBQUd0QixHQUFHNkgsYUFBVztZQUFXLE9BQU94RyxFQUFFQyxHQUFHdEIsS0FBR29FLEdBQUVpRyxFQUFFN0M7V0FBa0I2QztNQUFHbEosU0FBUSxTQUFTRTtRQUFHLElBQUlyQixJQUFFLFlBQVd3RSxJQUFFLGlCQUFnQnJCLElBQUUsZUFBYzBCLElBQUUsTUFBSTFCLEdBQUVjLElBQUUsYUFBWUcsSUFBRS9DLEVBQUVDLEdBQUd0QixJQUFHZ0csSUFBRSxLQUFJRTtZQUFHbUMsU0FBUTtZQUFFaEosUUFBTztXQUFJaUg7WUFBRytCLFFBQU87WUFBVWhKLFFBQU87V0FBVXFIO1lBQUdELE1BQUssU0FBTzVCO1lBQUU4SCxPQUFNLFVBQVE5SDtZQUFFK0gsTUFBSyxTQUFPL0g7WUFBRWdJLFFBQU8sV0FBU2hJO1lBQUV3QixnQkFBZSxVQUFReEIsSUFBRVo7V0FBRzhFO1lBQUd0QyxNQUFLO1lBQU9xRyxVQUFTO1lBQVdDLFlBQVc7WUFBYUMsV0FBVTtXQUFhaEU7WUFBR2lFLE9BQU07WUFBUUMsUUFBTztXQUFVN0Q7WUFBRzhELFNBQVE7WUFBcUNqRixhQUFZO1dBQTRCMEIsSUFBRTtZQUFXLFNBQVMvRSxFQUFFN0UsR0FBRVQ7Z0JBQUcrQyxFQUFFa0IsTUFBS3FCLElBQUdyQixLQUFLNEosb0JBQWtCLEdBQUU1SixLQUFLbUQsV0FBUzNHLEdBQUV3RCxLQUFLbUgsVUFBUW5ILEtBQUtvSCxXQUFXckw7Z0JBQUdpRSxLQUFLNkosZ0JBQWNoTSxFQUFFNkssVUFBVTdLLEVBQUUscUNBQW1DckIsRUFBRXNOLEtBQUcsU0FBTyw0Q0FBMEN0TixFQUFFc04sS0FBRztnQkFBUTlKLEtBQUsrSixVQUFRL0osS0FBS21ILFFBQVF0TCxTQUFPbUUsS0FBS2dLLGVBQWEsTUFBS2hLLEtBQUttSCxRQUFRdEwsVUFBUW1FLEtBQUtpSywwQkFBMEJqSyxLQUFLbUQsVUFBU25ELEtBQUs2SjtnQkFBZTdKLEtBQUttSCxRQUFRdEMsVUFBUTdFLEtBQUs2RTs7WUFBUyxPQUFPeEQsRUFBRWpELFVBQVV5RyxTQUFPO2dCQUFXaEgsRUFBRW1DLEtBQUttRCxVQUFVOUcsU0FBU2tKLEVBQUV0QyxRQUFNakQsS0FBSzFFLFNBQU8wRSxLQUFLekU7ZUFBUThGLEVBQUVqRCxVQUFVN0MsT0FBSztnQkFBVyxJQUFJaUIsSUFBRXdEO2dCQUFLLElBQUdBLEtBQUs0SixrQkFBaUIsTUFBTSxJQUFJaE0sTUFBTTtnQkFBNkIsS0FBSUMsRUFBRW1DLEtBQUttRCxVQUFVOUcsU0FBU2tKLEVBQUV0QyxPQUFNO29CQUFDLElBQUluRSxTQUFPLEdBQUUvQyxTQUFPO29CQUFFLElBQUdpRSxLQUFLK0osWUFBVWpMLElBQUVqQixFQUFFNkssVUFBVTdLLEVBQUVtQyxLQUFLK0osU0FBU2pPLEtBQUsrSixFQUFFOEQsV0FBVTdLLEVBQUV6RCxXQUFTeUQsSUFBRTtzQkFBU0EsTUFBSS9DLElBQUU4QixFQUFFaUIsR0FBR21GLEtBQUt0RSxJQUFHNUQsS0FBR0EsRUFBRTZOLG9CQUFtQjt3QkFBQyxJQUFJM0ssSUFBRXBCLEVBQUUrRixNQUFNVixFQUFFRDt3QkFBTSxJQUFHcEYsRUFBRW1DLEtBQUttRCxVQUFVMUYsUUFBUXdCLEtBQUlBLEVBQUVzRSxzQkFBcUI7NEJBQUN6RSxNQUFJdUMsRUFBRTJDLGlCQUFpQjFFLEtBQUt6QixFQUFFaUIsSUFBRyxTQUFRL0MsS0FBRzhCLEVBQUVpQixHQUFHbUYsS0FBS3RFLEdBQUU7NEJBQU8sSUFBSXFCLElBQUVoQixLQUFLa0s7NEJBQWdCck0sRUFBRW1DLEtBQUttRCxVQUFVdkgsWUFBWTJKLEVBQUUrRCxVQUFVck4sU0FBU3NKLEVBQUVnRSxhQUFZdkosS0FBS21ELFNBQVN6QyxNQUFNTSxLQUFHOzRCQUFFaEIsS0FBS21ELFNBQVM2QixhQUFhLGtCQUFpQixJQUFHaEYsS0FBSzZKLGNBQWN4TyxVQUFRd0MsRUFBRW1DLEtBQUs2SixlQUFlak8sWUFBWTJKLEVBQUVpRSxXQUFXVyxLQUFLLGtCQUFpQjs0QkFBR25LLEtBQUtvSyxrQkFBa0I7NEJBQUcsSUFBSTNKLElBQUUsU0FBRkE7Z0NBQWE1QyxFQUFFckIsRUFBRTJHLFVBQVV2SCxZQUFZMkosRUFBRWdFLFlBQVl0TixTQUFTc0osRUFBRStELFVBQVVyTixTQUFTc0osRUFBRXRDLE9BQU16RyxFQUFFMkcsU0FBU3pDLE1BQU1NLEtBQUc7Z0NBQUd4RSxFQUFFNE4sa0JBQWtCLElBQUd2TSxFQUFFckIsRUFBRTJHLFVBQVUxRixRQUFReUYsRUFBRWlHOzs0QkFBUSxLQUFJL0osRUFBRThCLHlCQUF3QixZQUFZVDs0QkFBSSxJQUFJRyxJQUFFSSxFQUFFLEdBQUd1QixnQkFBY3ZCLEVBQUVxSixNQUFNLElBQUczSCxJQUFFLFdBQVM5Qjs0QkFBRS9DLEVBQUVtQyxLQUFLbUQsVUFBVXhDLElBQUl2QixFQUFFeUIsZ0JBQWVKLEdBQUdRLHFCQUFxQnVCLElBQUd4QyxLQUFLbUQsU0FBU3pDLE1BQU1NLEtBQUdoQixLQUFLbUQsU0FBU1QsS0FBRzs7OztlQUFTckIsRUFBRWpELFVBQVU5QyxPQUFLO2dCQUFXLElBQUlrQixJQUFFd0Q7Z0JBQUssSUFBR0EsS0FBSzRKLGtCQUFpQixNQUFNLElBQUloTSxNQUFNO2dCQUE2QixJQUFHQyxFQUFFbUMsS0FBS21ELFVBQVU5RyxTQUFTa0osRUFBRXRDLE9BQU07b0JBQUMsSUFBSW5FLElBQUVqQixFQUFFK0YsTUFBTVYsRUFBRWtHO29CQUFNLElBQUd2TCxFQUFFbUMsS0FBS21ELFVBQVUxRixRQUFRcUIsS0FBSUEsRUFBRXlFLHNCQUFxQjt3QkFBQyxJQUFJeEgsSUFBRWlFLEtBQUtrSyxpQkFBZ0JqTCxJQUFFbEQsTUFBSXlKLEVBQUVpRSxRQUFNLGdCQUFjO3dCQUFlekosS0FBS21ELFNBQVN6QyxNQUFNM0UsS0FBR2lFLEtBQUttRCxTQUFTbEUsS0FBRyxNQUFLRyxFQUFFNkMsT0FBT2pDLEtBQUttRCxXQUFVdEYsRUFBRW1DLEtBQUttRCxVQUFVbEgsU0FBU3NKLEVBQUVnRSxZQUFZM04sWUFBWTJKLEVBQUUrRCxVQUFVMU4sWUFBWTJKLEVBQUV0Qzt3QkFBTWpELEtBQUttRCxTQUFTNkIsYUFBYSxrQkFBaUIsSUFBR2hGLEtBQUs2SixjQUFjeE8sVUFBUXdDLEVBQUVtQyxLQUFLNkosZUFBZTVOLFNBQVNzSixFQUFFaUUsV0FBV1csS0FBSyxrQkFBaUI7d0JBQUduSyxLQUFLb0ssa0JBQWtCO3dCQUFHLElBQUlwSixJQUFFLFNBQUZBOzRCQUFheEUsRUFBRTROLGtCQUFrQixJQUFHdk0sRUFBRXJCLEVBQUUyRyxVQUFVdkgsWUFBWTJKLEVBQUVnRSxZQUFZdE4sU0FBU3NKLEVBQUUrRCxVQUFVN0wsUUFBUXlGLEVBQUVtRzs7d0JBQVMsT0FBT3JKLEtBQUttRCxTQUFTekMsTUFBTTNFLEtBQUcsSUFBR3FELEVBQUU4QiwrQkFBNkJyRCxFQUFFbUMsS0FBS21ELFVBQVV4QyxJQUFJdkIsRUFBRXlCLGdCQUFlRyxHQUFHQyxxQkFBcUJ1QixVQUFReEI7OztlQUFPSyxFQUFFakQsVUFBVWdNLG1CQUFpQixTQUFTdk07Z0JBQUdtQyxLQUFLNEosbUJBQWlCL0w7ZUFBR3dELEVBQUVqRCxVQUFVcUYsVUFBUTtnQkFBVzVGLEVBQUU2RixXQUFXMUQsS0FBS21ELFVBQVN4RCxJQUFHSyxLQUFLbUgsVUFBUSxNQUFLbkgsS0FBSytKLFVBQVEsTUFBSy9KLEtBQUttRCxXQUFTO2dCQUFLbkQsS0FBSzZKLGdCQUFjLE1BQUs3SixLQUFLNEosbUJBQWlCO2VBQU12SSxFQUFFakQsVUFBVWdKLGFBQVcsU0FBU3RJO2dCQUFHLE9BQU9BLElBQUVqQixFQUFFd0ssV0FBVTNGLEdBQUU1RCxJQUFHQSxFQUFFK0YsU0FBTzFDLFFBQVFyRCxFQUFFK0YsU0FBUXpGLEVBQUVnRCxnQkFBZ0I1RixHQUFFc0MsR0FBRWdFO2dCQUFHaEU7ZUFBR3VDLEVBQUVqRCxVQUFVOEwsZ0JBQWM7Z0JBQVcsSUFBSTFOLElBQUVxQixFQUFFbUMsS0FBS21ELFVBQVU5RyxTQUFTbUosRUFBRWlFO2dCQUFPLE9BQU9qTixJQUFFZ0osRUFBRWlFLFFBQU1qRSxFQUFFa0U7ZUFBUXJJLEVBQUVqRCxVQUFVNEwsYUFBVztnQkFBVyxJQUFJeE4sSUFBRXdELE1BQUtsQixJQUFFakIsRUFBRW1DLEtBQUttSCxRQUFRdEwsUUFBUSxJQUFHRSxJQUFFLDJDQUF5Q2lFLEtBQUttSCxRQUFRdEwsU0FBTztnQkFBSyxPQUFPZ0MsRUFBRWlCLEdBQUdoRCxLQUFLQyxHQUFHQyxLQUFLLFNBQVM2QixHQUFFaUI7b0JBQUd0QyxFQUFFeU4sMEJBQTBCNUksRUFBRWlKLHNCQUFzQnhMLE1BQUlBO29CQUFNQTtlQUFHdUMsRUFBRWpELFVBQVU2TCw0QkFBMEIsU0FBU3pOLEdBQUVzQztnQkFBRyxJQUFHdEMsR0FBRTtvQkFBQyxJQUFJVCxJQUFFOEIsRUFBRXJCLEdBQUdILFNBQVNrSixFQUFFdEM7b0JBQU16RyxFQUFFd0ksYUFBYSxpQkFBZ0JqSixJQUFHK0MsRUFBRXpELFVBQVF3QyxFQUFFaUIsR0FBR21HLFlBQVlNLEVBQUVpRSxZQUFXek4sR0FBR29PLEtBQUssaUJBQWdCcE87O2VBQUtzRixFQUFFaUosd0JBQXNCLFNBQVM5TjtnQkFBRyxJQUFJc0MsSUFBRU0sRUFBRTBDLHVCQUF1QnRGO2dCQUFHLE9BQU9zQyxJQUFFakIsRUFBRWlCLEdBQUcsS0FBRztlQUFNdUMsRUFBRTJDLG1CQUFpQixTQUFTeEg7Z0JBQUcsT0FBT3dELEtBQUtoRSxLQUFLO29CQUFXLElBQUk4QyxJQUFFakIsRUFBRW1DLE9BQU1mLElBQUVILEVBQUVtRixLQUFLdEUsSUFBR1AsSUFBRXZCLEVBQUV3SyxXQUFVM0YsR0FBRTVELEVBQUVtRixRQUFPLGNBQVksc0JBQW9CekgsSUFBRSxjQUFZVCxFQUFFUyxPQUFLQTtvQkFBRyxLQUFJeUMsS0FBR0csRUFBRXlGLFVBQVEsWUFBWTdDLEtBQUt4RixPQUFLNEMsRUFBRXlGLFVBQVEsSUFBRzVGLE1BQUlBLElBQUUsSUFBSW9DLEVBQUVyQixNQUFLWjtvQkFBR04sRUFBRW1GLEtBQUt0RSxHQUFFVixLQUFJLG1CQUFpQnpDLEdBQUU7d0JBQUMsU0FBUSxNQUFJeUMsRUFBRXpDLElBQUcsTUFBTSxJQUFJb0IsTUFBTSxzQkFBb0JwQixJQUFFO3dCQUFLeUMsRUFBRXpDOzs7ZUFBU3lDLEVBQUVvQyxHQUFFO2dCQUFPbEMsS0FBSTtnQkFBVWdGLEtBQUksU0FBQUE7b0JBQVcsT0FBT25EOzs7Z0JBQUs3QixLQUFJO2dCQUFVZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPekI7O2tCQUFNckI7O1FBQUssT0FBT3hELEVBQUUwQyxVQUFVaEUsR0FBRzJHLEVBQUVMLGdCQUFlZ0QsRUFBRW5CLGFBQVksU0FBU2xJO1lBQUdBLEVBQUVnQjtZQUFpQixJQUFJc0IsSUFBRXNILEVBQUVrRSxzQkFBc0J0SyxPQUFNakUsSUFBRThCLEVBQUVpQixHQUFHbUYsS0FBS3RFLElBQUdWLElBQUVsRCxJQUFFLFdBQVM4QixFQUFFbUMsTUFBTWlFO1lBQU9tQyxFQUFFcEMsaUJBQWlCMUUsS0FBS3pCLEVBQUVpQixJQUFHRztZQUFLcEIsRUFBRUMsR0FBR3RCLEtBQUc0SixFQUFFcEMsa0JBQWlCbkcsRUFBRUMsR0FBR3RCLEdBQUc0SCxjQUFZZ0MsR0FBRXZJLEVBQUVDLEdBQUd0QixHQUFHNkgsYUFBVztZQUFXLE9BQU94RyxFQUFFQyxHQUFHdEIsS0FBR29FLEdBQUV3RixFQUFFcEM7V0FBa0JvQztNQUFHekksU0FBUSxTQUFTRTtRQUFHLElBQUlyQixJQUFFLFlBQVdULElBQUUsaUJBQWdCaUYsSUFBRSxlQUFjckIsSUFBRSxNQUFJcUIsR0FBRUssSUFBRSxhQUFZWixJQUFFNUMsRUFBRUMsR0FBR3RCLElBQUdvRSxJQUFFLElBQUc0QixJQUFFLElBQUdFLElBQUUsSUFBR0ksSUFBRSxHQUFFSTtZQUFHa0csTUFBSyxTQUFPeko7WUFBRTBKLFFBQU8sV0FBUzFKO1lBQUVzRCxNQUFLLFNBQU90RDtZQUFFd0osT0FBTSxVQUFReEo7WUFBRTRLLE9BQU0sVUFBUTVLO1lBQUVrRCxnQkFBZSxVQUFRbEQsSUFBRTBCO1lBQUVtSixrQkFBaUIsWUFBVTdLLElBQUUwQjtZQUFFb0osa0JBQWlCLFlBQVU5SyxJQUFFMEI7V0FBR2tFO1lBQUdtRixVQUFTO1lBQW9CQyxVQUFTO1lBQVcxSCxNQUFLO1dBQVF1QztZQUFHa0YsVUFBUztZQUFxQmhHLGFBQVk7WUFBMkJrRyxZQUFXO1lBQWlCQyxXQUFVO1lBQWdCQyxjQUFhO1lBQW1CQyxZQUFXO1lBQWNDLGVBQWM7V0FBMkVuRixJQUFFO1lBQVcsU0FBU3JKLEVBQUVxQjtnQkFBR2lCLEVBQUVrQixNQUFLeEQsSUFBR3dELEtBQUttRCxXQUFTdEYsR0FBRW1DLEtBQUtzSDs7WUFBcUIsT0FBTzlLLEVBQUU0QixVQUFVeUcsU0FBTztnQkFBVyxJQUFHN0UsS0FBS2lMLFlBQVVwTixFQUFFbUMsTUFBTTNELFNBQVNrSixFQUFFb0YsV0FBVSxRQUFPO2dCQUFFLElBQUk3TCxJQUFFdEMsRUFBRTBPLHNCQUFzQmxMLE9BQU1qRSxJQUFFOEIsRUFBRWlCLEdBQUd6QyxTQUFTa0osRUFBRXRDO2dCQUFNLElBQUd6RyxFQUFFMk8sZUFBY3BQLEdBQUUsUUFBTztnQkFBRSxJQUFHLGtCQUFpQndFLFNBQVNnSSxvQkFBa0IxSyxFQUFFaUIsR0FBRzZFLFFBQVE2QixFQUFFdUYsWUFBWTFQLFFBQU87b0JBQUMsSUFBSTRELElBQUVzQixTQUFTQyxjQUFjO29CQUFPdkIsRUFBRW1NLFlBQVU3RixFQUFFbUYsVUFBUzdNLEVBQUVvQixHQUFHb00sYUFBYXJMLE9BQU1uQyxFQUFFb0IsR0FBRzFDLEdBQUcsU0FBUUMsRUFBRTJPOztnQkFBYSxJQUFJL0w7b0JBQUcwSixlQUFjOUk7bUJBQU1nQixJQUFFbkQsRUFBRStGLE1BQU1WLEVBQUVELE1BQUs3RDtnQkFBRyxPQUFPdkIsRUFBRWlCLEdBQUdyQixRQUFRdUQsS0FBSUEsRUFBRXVDLHlCQUF1QnZELEtBQUsrRSxTQUFRL0UsS0FBS2dGLGFBQWEsa0JBQWlCO2dCQUFHbkgsRUFBRWlCLEdBQUdtRyxZQUFZTSxFQUFFdEMsT0FBTXBGLEVBQUVpQixHQUFHckIsUUFBUUksRUFBRStGLE1BQU1WLEVBQUVpRyxPQUFNL0osTUFBSztlQUFJNUMsRUFBRTRCLFVBQVVxRixVQUFRO2dCQUFXNUYsRUFBRTZGLFdBQVcxRCxLQUFLbUQsVUFBU25DLElBQUduRCxFQUFFbUMsS0FBS21ELFVBQVVpRixJQUFJekksSUFBR0ssS0FBS21ELFdBQVM7ZUFBTTNHLEVBQUU0QixVQUFVa0oscUJBQW1CO2dCQUFXekosRUFBRW1DLEtBQUttRCxVQUFVNUcsR0FBRzJHLEVBQUVxSCxPQUFNdkssS0FBSzZFO2VBQVNySSxFQUFFd0gsbUJBQWlCLFNBQVNsRjtnQkFBRyxPQUFPa0IsS0FBS2hFLEtBQUs7b0JBQVcsSUFBSUQsSUFBRThCLEVBQUVtQyxNQUFNaUUsS0FBS2pEO29CQUFHLElBQUdqRixNQUFJQSxJQUFFLElBQUlTLEVBQUV3RCxPQUFNbkMsRUFBRW1DLE1BQU1pRSxLQUFLakQsR0FBRWpGLEtBQUksbUJBQWlCK0MsR0FBRTt3QkFBQyxTQUFRLE1BQUkvQyxFQUFFK0MsSUFBRyxNQUFNLElBQUlsQixNQUFNLHNCQUFvQmtCLElBQUU7d0JBQUsvQyxFQUFFK0MsR0FBR1EsS0FBS1U7OztlQUFVeEQsRUFBRTJPLGNBQVksU0FBU3JNO2dCQUFHLEtBQUlBLEtBQUdBLEVBQUUySixVQUFRM0YsR0FBRTtvQkFBQyxJQUFJL0csSUFBRThCLEVBQUUySCxFQUFFa0YsVUFBVTtvQkFBRzNPLEtBQUdBLEVBQUV1UCxXQUFXQyxZQUFZeFA7b0JBQUcsS0FBSSxJQUFJa0QsSUFBRXBCLEVBQUU2SyxVQUFVN0ssRUFBRTJILEVBQUVkLGVBQWN0RixJQUFFLEdBQUVBLElBQUVILEVBQUU1RCxRQUFPK0QsS0FBSTt3QkFBQyxJQUFJNEIsSUFBRXhFLEVBQUUwTyxzQkFBc0JqTSxFQUFFRyxLQUFJTzs0QkFBR21KLGVBQWM3SixFQUFFRzs7d0JBQUksSUFBR3ZCLEVBQUVtRCxHQUFHM0UsU0FBU2tKLEVBQUV0QyxXQUFTbkUsTUFBSSxZQUFVQSxFQUFFZ0csUUFBTSxrQkFBa0I5QyxLQUFLbEQsRUFBRTVCLE9BQU9zTCxZQUFVLGNBQVkxSixFQUFFZ0csU0FBT2pILEVBQUUyTixTQUFTeEssR0FBRWxDLEVBQUU1QixVQUFTOzRCQUFDLElBQUltRSxJQUFFeEQsRUFBRStGLE1BQU1WLEVBQUVrRyxNQUFLeko7NEJBQUc5QixFQUFFbUQsR0FBR3ZELFFBQVE0RCxJQUFHQSxFQUFFa0MseUJBQXVCdEUsRUFBRUcsR0FBRzRGLGFBQWEsaUJBQWdCOzRCQUFTbkgsRUFBRW1ELEdBQUdwRixZQUFZMkosRUFBRXRDLE1BQU14RixRQUFRSSxFQUFFK0YsTUFBTVYsRUFBRW1HLFFBQU8xSjs7OztlQUFTbkQsRUFBRTBPLHdCQUFzQixTQUFTMU87Z0JBQUcsSUFBSXNDLFNBQU8sR0FBRS9DLElBQUVxRCxFQUFFMEMsdUJBQXVCdEY7Z0JBQUcsT0FBT1QsTUFBSStDLElBQUVqQixFQUFFOUIsR0FBRyxLQUFJK0MsS0FBR3RDLEVBQUU4TztlQUFZOU8sRUFBRWlQLHlCQUF1QixTQUFTM007Z0JBQUcsSUFBRyxnQkFBZ0JrRCxLQUFLbEQsRUFBRTJKLFdBQVMsa0JBQWtCekcsS0FBS2xELEVBQUU1QixPQUFPc0wsYUFBVzFKLEVBQUV0QjtnQkFBaUJzQixFQUFFNE0sb0JBQW1CMUwsS0FBS2lMLGFBQVdwTixFQUFFbUMsTUFBTTNELFNBQVNrSixFQUFFb0YsWUFBVztvQkFBQyxJQUFJNU8sSUFBRVMsRUFBRTBPLHNCQUFzQmxMLE9BQU1mLElBQUVwQixFQUFFOUIsR0FBR00sU0FBU2tKLEVBQUV0QztvQkFBTSxLQUFJaEUsS0FBR0gsRUFBRTJKLFVBQVE3SCxLQUFHM0IsS0FBR0gsRUFBRTJKLFVBQVE3SCxHQUFFO3dCQUFDLElBQUc5QixFQUFFMkosVUFBUTdILEdBQUU7NEJBQUMsSUFBSXhCLElBQUV2QixFQUFFOUIsR0FBR0QsS0FBSzBKLEVBQUVkLGFBQWE7NEJBQUc3RyxFQUFFdUIsR0FBRzNCLFFBQVE7O3dCQUFTLFlBQVlJLEVBQUVtQyxNQUFNdkMsUUFBUTs7b0JBQVMsSUFBSXVELElBQUVuRCxFQUFFOUIsR0FBR0QsS0FBSzBKLEVBQUV3RixlQUFlN0c7b0JBQU0sSUFBR25ELEVBQUUzRixRQUFPO3dCQUFDLElBQUlzRSxJQUFFcUIsRUFBRTJILFFBQVE3SixFQUFFNUI7d0JBQVE0QixFQUFFMkosVUFBUWpHLEtBQUc3QyxJQUFFLEtBQUdBLEtBQUliLEVBQUUySixVQUFRL0YsS0FBRy9DLElBQUVxQixFQUFFM0YsU0FBTyxLQUFHc0UsS0FBSUEsSUFBRSxNQUFJQSxJQUFFO3dCQUFHcUIsRUFBRXJCLEdBQUdvRjs7O2VBQVc5RixFQUFFekMsR0FBRTtnQkFBTzJDLEtBQUk7Z0JBQVVnRixLQUFJLFNBQUFBO29CQUFXLE9BQU9wSTs7a0JBQU1TOztRQUFLLE9BQU9xQixFQUFFMEMsVUFBVWhFLEdBQUcyRyxFQUFFdUgsa0JBQWlCakYsRUFBRWQsYUFBWW1CLEVBQUU0Rix3QkFBd0JsUCxHQUFHMkcsRUFBRXVILGtCQUFpQmpGLEVBQUVxRixXQUFVaEYsRUFBRTRGLHdCQUF3QmxQLEdBQUcyRyxFQUFFdUgsa0JBQWlCakYsRUFBRXNGLGNBQWFqRixFQUFFNEYsd0JBQXdCbFAsR0FBRzJHLEVBQUVMLGlCQUFlLE1BQUlLLEVBQUVzSCxrQkFBaUIzRSxFQUFFc0YsYUFBYTVPLEdBQUcyRyxFQUFFTCxnQkFBZTJDLEVBQUVkLGFBQVltQixFQUFFekgsVUFBVXlHLFFBQVF0SSxHQUFHMkcsRUFBRUwsZ0JBQWUyQyxFQUFFb0YsWUFBVyxTQUFTL007WUFBR0EsRUFBRTZOO1lBQW9CN04sRUFBRUMsR0FBR3RCLEtBQUdxSixFQUFFN0Isa0JBQWlCbkcsRUFBRUMsR0FBR3RCLEdBQUc0SCxjQUFZeUIsR0FBRWhJLEVBQUVDLEdBQUd0QixHQUFHNkgsYUFBVztZQUFXLE9BQU94RyxFQUFFQyxHQUFHdEIsS0FBR2lFLEdBQUVvRixFQUFFN0I7V0FBa0I2QjtNQUFHbEksU0FBUSxTQUFTRTtRQUFHLElBQUlyQixJQUFFLFNBQVF3RSxJQUFFLGlCQUFnQnJCLElBQUUsWUFBVzBCLElBQUUsTUFBSTFCLEdBQUVjLElBQUUsYUFBWUcsSUFBRS9DLEVBQUVDLEdBQUd0QixJQUFHZ0csSUFBRSxLQUFJRSxJQUFFLEtBQUlJLElBQUUsSUFBR0k7WUFBR3lJLFdBQVU7WUFBRXhHLFdBQVU7WUFBRUosUUFBTztZQUFFeEosT0FBTTtXQUFHZ0s7WUFBR29HLFVBQVM7WUFBbUJ4RyxVQUFTO1lBQVVKLE9BQU07WUFBVXhKLE1BQUs7V0FBV2lLO1lBQUc0RCxNQUFLLFNBQU8vSDtZQUFFZ0ksUUFBTyxXQUFTaEk7WUFBRTRCLE1BQUssU0FBTzVCO1lBQUU4SCxPQUFNLFVBQVE5SDtZQUFFdUssU0FBUSxZQUFVdks7WUFBRXdLLFFBQU8sV0FBU3hLO1lBQUV5SyxlQUFjLGtCQUFnQnpLO1lBQUUwSyxpQkFBZ0Isb0JBQWtCMUs7WUFBRTJLLGlCQUFnQixvQkFBa0IzSztZQUFFNEssbUJBQWtCLHNCQUFvQjVLO1lBQUV3QixnQkFBZSxVQUFReEIsSUFBRVo7V0FBR29GO1lBQUdxRyxvQkFBbUI7WUFBMEJ4QixVQUFTO1lBQWlCeUIsTUFBSztZQUFhbkosTUFBSztZQUFPQyxNQUFLO1dBQVFtRDtZQUFHZ0csUUFBTztZQUFnQjFILGFBQVk7WUFBd0IySCxjQUFhO1lBQXlCQyxlQUFjO1dBQXFEL0YsSUFBRTtZQUFXLFNBQVM5RixFQUFFakUsR0FBRVQ7Z0JBQUcrQyxFQUFFa0IsTUFBS1MsSUFBR1QsS0FBS21ILFVBQVFuSCxLQUFLb0gsV0FBV3JMLElBQUdpRSxLQUFLbUQsV0FBUzNHLEdBQUV3RCxLQUFLdU0sVUFBUTFPLEVBQUVyQixHQUFHVixLQUFLc0ssRUFBRWdHLFFBQVE7Z0JBQUdwTSxLQUFLd00sWUFBVSxNQUFLeE0sS0FBS3lNLFlBQVUsR0FBRXpNLEtBQUswTSxzQkFBb0IsR0FBRTFNLEtBQUsyTSx3QkFBc0I7Z0JBQUUzTSxLQUFLNEosb0JBQWtCLEdBQUU1SixLQUFLNE0sdUJBQXFCLEdBQUU1TSxLQUFLNk0sa0JBQWdCOztZQUFFLE9BQU9wTSxFQUFFckMsVUFBVXlHLFNBQU8sU0FBU2hIO2dCQUFHLE9BQU9tQyxLQUFLeU0sV0FBU3pNLEtBQUsxRSxTQUFPMEUsS0FBS3pFLEtBQUtzQztlQUFJNEMsRUFBRXJDLFVBQVU3QyxPQUFLLFNBQVNpQjtnQkFBRyxJQUFJc0MsSUFBRWtCO2dCQUFLLElBQUdBLEtBQUs0SixrQkFBaUIsTUFBTSxJQUFJaE0sTUFBTTtnQkFBMEJ3QixFQUFFOEIsMkJBQXlCckQsRUFBRW1DLEtBQUttRCxVQUFVOUcsU0FBU3dKLEVBQUU3QyxVQUFRaEQsS0FBSzRKLG9CQUFrQjtnQkFBRyxJQUFJN04sSUFBRThCLEVBQUUrRixNQUFNNEIsRUFBRXZDO29CQUFNNkYsZUFBY3RNOztnQkFBSXFCLEVBQUVtQyxLQUFLbUQsVUFBVTFGLFFBQVExQixJQUFHaUUsS0FBS3lNLFlBQVUxUSxFQUFFd0gseUJBQXVCdkQsS0FBS3lNLFlBQVU7Z0JBQUV6TSxLQUFLOE0sbUJBQWtCOU0sS0FBSytNLGlCQUFnQmxQLEVBQUUwQyxTQUFTeU0sTUFBTS9RLFNBQVM0SixFQUFFc0c7Z0JBQU1uTSxLQUFLaU4sbUJBQWtCak4sS0FBS2tOLG1CQUFrQnJQLEVBQUVtQyxLQUFLbUQsVUFBVTVHLEdBQUdpSixFQUFFc0csZUFBYzFGLEVBQUVpRyxjQUFhLFNBQVN4TztvQkFBRyxPQUFPaUIsRUFBRXhELEtBQUt1QztvQkFBS0EsRUFBRW1DLEtBQUt1TSxTQUFTaFEsR0FBR2lKLEVBQUV5RyxtQkFBa0I7b0JBQVdwTyxFQUFFaUIsRUFBRXFFLFVBQVV4QyxJQUFJNkUsRUFBRXdHLGlCQUFnQixTQUFTeFA7d0JBQUdxQixFQUFFckIsRUFBRVUsUUFBUTZDLEdBQUdqQixFQUFFcUUsY0FBWXJFLEVBQUU2Tix3QkFBc0I7O29CQUFPM00sS0FBS21OLGNBQWM7b0JBQVcsT0FBT3JPLEVBQUVzTyxhQUFhNVE7O2VBQU9pRSxFQUFFckMsVUFBVTlDLE9BQUssU0FBU2tCO2dCQUFHLElBQUlzQyxJQUFFa0I7Z0JBQUssSUFBR3hELEtBQUdBLEVBQUVnQixrQkFBaUJ3QyxLQUFLNEosa0JBQWlCLE1BQU0sSUFBSWhNLE1BQU07Z0JBQTBCLElBQUk3QixJQUFFcUQsRUFBRThCLDJCQUF5QnJELEVBQUVtQyxLQUFLbUQsVUFBVTlHLFNBQVN3SixFQUFFN0M7Z0JBQU1qSCxNQUFJaUUsS0FBSzRKLG9CQUFrQjtnQkFBRyxJQUFJM0ssSUFBRXBCLEVBQUUrRixNQUFNNEIsRUFBRTREO2dCQUFNdkwsRUFBRW1DLEtBQUttRCxVQUFVMUYsUUFBUXdCLElBQUdlLEtBQUt5TSxhQUFXeE4sRUFBRXNFLHlCQUF1QnZELEtBQUt5TSxZQUFVO2dCQUFFek0sS0FBS2lOLG1CQUFrQmpOLEtBQUtrTixtQkFBa0JyUCxFQUFFMEMsVUFBVTZILElBQUk1QyxFQUFFb0csVUFBUy9OLEVBQUVtQyxLQUFLbUQsVUFBVXZILFlBQVlpSyxFQUFFNUM7Z0JBQU1wRixFQUFFbUMsS0FBS21ELFVBQVVpRixJQUFJNUMsRUFBRXNHLGdCQUFlak8sRUFBRW1DLEtBQUt1TSxTQUFTbkUsSUFBSTVDLEVBQUV5RztnQkFBbUJsUSxJQUFFOEIsRUFBRW1DLEtBQUttRCxVQUFVeEMsSUFBSXZCLEVBQUV5QixnQkFBZSxTQUFTaEQ7b0JBQUcsT0FBT2lCLEVBQUV1TyxXQUFXeFA7bUJBQUtvRCxxQkFBcUJ1QixLQUFHeEMsS0FBS3FOO2VBQWU1TSxFQUFFckMsVUFBVXFGLFVBQVE7Z0JBQVc1RixFQUFFNkYsV0FBVzFELEtBQUttRCxVQUFTeEQsSUFBRzlCLEVBQUV3QyxRQUFPRSxVQUFTUCxLQUFLbUQsVUFBU25ELEtBQUt3TSxXQUFXcEUsSUFBSS9HO2dCQUFHckIsS0FBS21ILFVBQVEsTUFBS25ILEtBQUttRCxXQUFTLE1BQUtuRCxLQUFLdU0sVUFBUSxNQUFLdk0sS0FBS3dNLFlBQVU7Z0JBQUt4TSxLQUFLeU0sV0FBUyxNQUFLek0sS0FBSzBNLHFCQUFtQixNQUFLMU0sS0FBSzJNLHVCQUFxQjtnQkFBSzNNLEtBQUs0TSx1QkFBcUIsTUFBSzVNLEtBQUs2TSxrQkFBZ0I7ZUFBTXBNLEVBQUVyQyxVQUFVZ0osYUFBVyxTQUFTdEk7Z0JBQUcsT0FBT0EsSUFBRWpCLEVBQUV3SyxXQUFVbkYsR0FBRXBFLElBQUdNLEVBQUVnRCxnQkFBZ0I1RixHQUFFc0MsR0FBRXlHLElBQUd6RztlQUFHMkIsRUFBRXJDLFVBQVVnUCxlQUFhLFNBQVM1UTtnQkFBRyxJQUFJc0MsSUFBRWtCLE1BQUtqRSxJQUFFcUQsRUFBRThCLDJCQUF5QnJELEVBQUVtQyxLQUFLbUQsVUFBVTlHLFNBQVN3SixFQUFFN0M7Z0JBQU1oRCxLQUFLbUQsU0FBU21JLGNBQVl0TCxLQUFLbUQsU0FBU21JLFdBQVc3TCxhQUFXNk4sS0FBS0MsZ0JBQWNoTixTQUFTeU0sS0FBS1EsWUFBWXhOLEtBQUttRDtnQkFBVW5ELEtBQUttRCxTQUFTekMsTUFBTStNLFVBQVEsU0FBUXpOLEtBQUttRCxTQUFTdUssZ0JBQWdCO2dCQUFlMU4sS0FBS21ELFNBQVN3SyxZQUFVLEdBQUU1UixLQUFHcUQsRUFBRTZDLE9BQU9qQyxLQUFLbUQsV0FBVXRGLEVBQUVtQyxLQUFLbUQsVUFBVWxILFNBQVM0SixFQUFFNUM7Z0JBQU1qRCxLQUFLbUgsUUFBUXBDLFNBQU8vRSxLQUFLNE47Z0JBQWdCLElBQUkzTyxJQUFFcEIsRUFBRStGLE1BQU00QixFQUFFMkQ7b0JBQU9MLGVBQWN0TTtvQkFBSXdFLElBQUUsU0FBRkE7b0JBQWFsQyxFQUFFcUksUUFBUXBDLFNBQU9qRyxFQUFFcUUsU0FBUzRCLFNBQVFqRyxFQUFFOEssb0JBQWtCLEdBQUUvTCxFQUFFaUIsRUFBRXFFLFVBQVUxRixRQUFRd0I7O2dCQUFJbEQsSUFBRThCLEVBQUVtQyxLQUFLdU0sU0FBUzVMLElBQUl2QixFQUFFeUIsZ0JBQWVHLEdBQUdDLHFCQUFxQnVCLEtBQUd4QjtlQUFLUCxFQUFFckMsVUFBVXdQLGdCQUFjO2dCQUFXLElBQUlwUixJQUFFd0Q7Z0JBQUtuQyxFQUFFMEMsVUFBVTZILElBQUk1QyxFQUFFb0csU0FBU3JQLEdBQUdpSixFQUFFb0csU0FBUSxTQUFTOU07b0JBQUd5QixhQUFXekIsRUFBRTVCLFVBQVFWLEVBQUUyRyxhQUFXckUsRUFBRTVCLFVBQVFXLEVBQUVyQixFQUFFMkcsVUFBVTBLLElBQUkvTyxFQUFFNUIsUUFBUTdCLFVBQVFtQixFQUFFMkcsU0FBUzRCOztlQUFXdEUsRUFBRXJDLFVBQVU2TyxrQkFBZ0I7Z0JBQVcsSUFBSXpRLElBQUV3RDtnQkFBS0EsS0FBS3lNLFlBQVV6TSxLQUFLbUgsUUFBUWhDLFdBQVN0SCxFQUFFbUMsS0FBS21ELFVBQVU1RyxHQUFHaUosRUFBRXVHLGlCQUFnQixTQUFTbE87b0JBQUdBLEVBQUU0SyxVQUFRM0YsS0FBR3RHLEVBQUVsQjtxQkFBUzBFLEtBQUt5TSxZQUFVNU8sRUFBRW1DLEtBQUttRCxVQUFVaUYsSUFBSTVDLEVBQUV1RztlQUFrQnRMLEVBQUVyQyxVQUFVOE8sa0JBQWdCO2dCQUFXLElBQUkxUSxJQUFFd0Q7Z0JBQUtBLEtBQUt5TSxXQUFTNU8sRUFBRXdDLFFBQVE5RCxHQUFHaUosRUFBRXFHLFFBQU8sU0FBU2hPO29CQUFHLE9BQU9yQixFQUFFc1IsY0FBY2pRO3FCQUFLQSxFQUFFd0MsUUFBUStILElBQUk1QyxFQUFFcUc7ZUFBU3BMLEVBQUVyQyxVQUFVaVAsYUFBVztnQkFBVyxJQUFJN1EsSUFBRXdEO2dCQUFLQSxLQUFLbUQsU0FBU3pDLE1BQU0rTSxVQUFRLFFBQU96TixLQUFLbUQsU0FBUzZCLGFBQWEsZUFBYztnQkFBUWhGLEtBQUs0SixvQkFBa0IsR0FBRTVKLEtBQUttTixjQUFjO29CQUFXdFAsRUFBRTBDLFNBQVN5TSxNQUFNcFIsWUFBWWlLLEVBQUVzRyxPQUFNM1AsRUFBRXVSLHFCQUFvQnZSLEVBQUV3UjtvQkFBa0JuUSxFQUFFckIsRUFBRTJHLFVBQVUxRixRQUFRK0gsRUFBRTZEOztlQUFXNUksRUFBRXJDLFVBQVU2UCxrQkFBZ0I7Z0JBQVdqTyxLQUFLd00sY0FBWTNPLEVBQUVtQyxLQUFLd00sV0FBV3pJLFVBQVMvRCxLQUFLd00sWUFBVTtlQUFPL0wsRUFBRXJDLFVBQVUrTyxnQkFBYyxTQUFTM1E7Z0JBQUcsSUFBSXNDLElBQUVrQixNQUFLakUsSUFBRThCLEVBQUVtQyxLQUFLbUQsVUFBVTlHLFNBQVN3SixFQUFFN0MsUUFBTTZDLEVBQUU3QyxPQUFLO2dCQUFHLElBQUdoRCxLQUFLeU0sWUFBVXpNLEtBQUttSCxRQUFRd0UsVUFBUztvQkFBQyxJQUFJMU0sSUFBRUcsRUFBRThCLDJCQUF5Qm5GO29CQUFFLElBQUdpRSxLQUFLd00sWUFBVWpNLFNBQVNDLGNBQWMsUUFBT1IsS0FBS3dNLFVBQVVwQixZQUFVdkYsRUFBRTZFO29CQUFTM08sS0FBRzhCLEVBQUVtQyxLQUFLd00sV0FBV3ZRLFNBQVNGLElBQUc4QixFQUFFbUMsS0FBS3dNLFdBQVcwQixTQUFTM04sU0FBU3lNLE9BQU1uUCxFQUFFbUMsS0FBS21ELFVBQVU1RyxHQUFHaUosRUFBRXNHLGVBQWMsU0FBU2pPO3dCQUFHLE9BQU9pQixFQUFFNk4sNkJBQTBCN04sRUFBRTZOLHdCQUFzQixXQUFROU8sRUFBRVgsV0FBU1csRUFBRXNRLGtCQUFnQixhQUFXclAsRUFBRXFJLFFBQVF3RSxXQUFTN00sRUFBRXFFLFNBQVM0QixVQUFRakcsRUFBRXhEO3dCQUFXMkQsS0FBR0csRUFBRTZDLE9BQU9qQyxLQUFLd00sWUFBVzNPLEVBQUVtQyxLQUFLd00sV0FBV3ZRLFNBQVM0SixFQUFFNUMsUUFBT3pHLEdBQUU7b0JBQU8sS0FBSXlDLEdBQUUsWUFBWXpDO29CQUFJcUIsRUFBRW1DLEtBQUt3TSxXQUFXN0wsSUFBSXZCLEVBQUV5QixnQkFBZXJFLEdBQUd5RSxxQkFBcUJ5Qjt1QkFBUSxLQUFJMUMsS0FBS3lNLFlBQVV6TSxLQUFLd00sV0FBVTtvQkFBQzNPLEVBQUVtQyxLQUFLd00sV0FBVzVRLFlBQVlpSyxFQUFFNUM7b0JBQU0sSUFBSWpDLElBQUUsU0FBRkE7d0JBQWFsQyxFQUFFbVAsbUJBQWtCelIsS0FBR0E7O29CQUFLNEMsRUFBRThCLDJCQUF5QnJELEVBQUVtQyxLQUFLbUQsVUFBVTlHLFNBQVN3SixFQUFFN0MsUUFBTW5GLEVBQUVtQyxLQUFLd00sV0FBVzdMLElBQUl2QixFQUFFeUIsZ0JBQWVHLEdBQUdDLHFCQUFxQnlCLEtBQUcxQjt1QkFBU3hFLEtBQUdBO2VBQUtpRSxFQUFFckMsVUFBVTBQLGdCQUFjO2dCQUFXOU4sS0FBS29PO2VBQWlCM04sRUFBRXJDLFVBQVVnUSxnQkFBYztnQkFBVyxJQUFJdlEsSUFBRW1DLEtBQUttRCxTQUFTa0wsZUFBYTlOLFNBQVNnSSxnQkFBZ0IrRjtpQkFBY3RPLEtBQUswTSxzQkFBb0I3TyxNQUFJbUMsS0FBS21ELFNBQVN6QyxNQUFNNk4sY0FBWXZPLEtBQUs2TSxrQkFBZ0I7Z0JBQU03TSxLQUFLME0sdUJBQXFCN08sTUFBSW1DLEtBQUttRCxTQUFTekMsTUFBTThOLGVBQWF4TyxLQUFLNk0sa0JBQWdCO2VBQU9wTSxFQUFFckMsVUFBVTJQLG9CQUFrQjtnQkFBVy9OLEtBQUttRCxTQUFTekMsTUFBTTZOLGNBQVksSUFBR3ZPLEtBQUttRCxTQUFTekMsTUFBTThOLGVBQWE7ZUFBSS9OLEVBQUVyQyxVQUFVME8sa0JBQWdCO2dCQUFXOU0sS0FBSzBNLHFCQUFtQm5NLFNBQVN5TSxLQUFLeUIsY0FBWXBPLE9BQU9xTyxZQUFXMU8sS0FBSzZNLGtCQUFnQjdNLEtBQUsyTztlQUFzQmxPLEVBQUVyQyxVQUFVMk8sZ0JBQWM7Z0JBQVcsSUFBSXZRLElBQUVvUyxTQUFTL1EsRUFBRXVJLEVBQUVrRyxlQUFlclAsSUFBSSxvQkFBa0IsR0FBRTtnQkFBSStDLEtBQUs0TSx1QkFBcUJyTSxTQUFTeU0sS0FBS3RNLE1BQU04TixnQkFBYyxJQUFHeE8sS0FBSzBNLHVCQUFxQm5NLFNBQVN5TSxLQUFLdE0sTUFBTThOLGVBQWFoUyxJQUFFd0QsS0FBSzZNLGtCQUFnQjtlQUFPcE0sRUFBRXJDLFVBQVU0UCxrQkFBZ0I7Z0JBQVd6TixTQUFTeU0sS0FBS3RNLE1BQU04TixlQUFheE8sS0FBSzRNO2VBQXNCbk0sRUFBRXJDLFVBQVV1USxxQkFBbUI7Z0JBQVcsSUFBSTlRLElBQUUwQyxTQUFTQyxjQUFjO2dCQUFPM0MsRUFBRXVOLFlBQVV2RixFQUFFcUcsb0JBQW1CM0wsU0FBU3lNLEtBQUtRLFlBQVkzUDtnQkFBRyxJQUFJckIsSUFBRXFCLEVBQUVnUixjQUFZaFIsRUFBRTRRO2dCQUFZLE9BQU9sTyxTQUFTeU0sS0FBS3pCLFlBQVkxTixJQUFHckI7ZUFBR2lFLEVBQUV1RCxtQkFBaUIsU0FBU3hILEdBQUVzQztnQkFBRyxPQUFPa0IsS0FBS2hFLEtBQUs7b0JBQVcsSUFBSWlELElBQUVwQixFQUFFbUMsTUFBTWlFLEtBQUt0RSxJQUFHUCxJQUFFdkIsRUFBRXdLLFdBQVU1SCxFQUFFcU8sU0FBUWpSLEVBQUVtQyxNQUFNaUUsUUFBTyxjQUFZLHNCQUFvQnpILElBQUUsY0FBWVQsRUFBRVMsT0FBS0E7b0JBQUcsSUFBR3lDLE1BQUlBLElBQUUsSUFBSXdCLEVBQUVULE1BQUtaLElBQUd2QixFQUFFbUMsTUFBTWlFLEtBQUt0RSxHQUFFVixLQUFJLG1CQUFpQnpDLEdBQUU7d0JBQUMsU0FBUSxNQUFJeUMsRUFBRXpDLElBQUcsTUFBTSxJQUFJb0IsTUFBTSxzQkFBb0JwQixJQUFFO3dCQUFLeUMsRUFBRXpDLEdBQUdzQzsyQkFBUU0sRUFBRTdELFFBQU0wRCxFQUFFMUQsS0FBS3VEOztlQUFNRyxFQUFFd0IsR0FBRTtnQkFBT3RCLEtBQUk7Z0JBQVVnRixLQUFJLFNBQUFBO29CQUFXLE9BQU9uRDs7O2dCQUFLN0IsS0FBSTtnQkFBVWdGLEtBQUksU0FBQUE7b0JBQVcsT0FBT2pCOztrQkFBTXpDOztRQUFLLE9BQU81QyxFQUFFMEMsVUFBVWhFLEdBQUdpSixFQUFFM0MsZ0JBQWV1RCxFQUFFMUIsYUFBWSxTQUFTbEk7WUFBRyxJQUFJc0MsSUFBRWtCLE1BQUtqRSxTQUFPLEdBQUVrRCxJQUFFRyxFQUFFMEMsdUJBQXVCOUI7WUFBTWYsTUFBSWxELElBQUU4QixFQUFFb0IsR0FBRztZQUFJLElBQUkrQixJQUFFbkQsRUFBRTlCLEdBQUdrSSxLQUFLdEUsS0FBRyxXQUFTOUIsRUFBRXdLLFdBQVV4SyxFQUFFOUIsR0FBR2tJLFFBQU9wRyxFQUFFbUMsTUFBTWlFO1lBQVEsUUFBTWpFLEtBQUt3SSxXQUFTLFdBQVN4SSxLQUFLd0ksV0FBU2hNLEVBQUVnQjtZQUFpQixJQUFJNkQsSUFBRXhELEVBQUU5QixHQUFHNEUsSUFBSTZFLEVBQUV2QyxNQUFLLFNBQVN6RztnQkFBR0EsRUFBRStHLHdCQUFzQmxDLEVBQUVWLElBQUk2RSxFQUFFNkQsUUFBTztvQkFBV3hMLEVBQUVpQixHQUFHaUIsR0FBRyxlQUFhakIsRUFBRWlHOzs7WUFBWXdCLEVBQUV2QyxpQkFBaUIxRSxLQUFLekIsRUFBRTlCLElBQUdpRixHQUFFaEI7WUFBUW5DLEVBQUVDLEdBQUd0QixLQUFHK0osRUFBRXZDLGtCQUFpQm5HLEVBQUVDLEdBQUd0QixHQUFHNEgsY0FBWW1DLEdBQUUxSSxFQUFFQyxHQUFHdEIsR0FBRzZILGFBQVc7WUFBVyxPQUFPeEcsRUFBRUMsR0FBR3RCLEtBQUdvRSxHQUFFMkYsRUFBRXZDO1dBQWtCdUM7TUFBRzVJLFNBQVEsU0FBU0U7UUFBRyxJQUFJckIsSUFBRSxhQUFZd0UsSUFBRSxpQkFBZ0JyQixJQUFFLGdCQUFlMEIsSUFBRSxNQUFJMUIsR0FBRWMsSUFBRSxhQUFZRyxJQUFFL0MsRUFBRUMsR0FBR3RCLElBQUdnRztZQUFHdU0sUUFBTztZQUFHQyxRQUFPO1lBQU85UixRQUFPO1dBQUl3RjtZQUFHcU0sUUFBTztZQUFTQyxRQUFPO1lBQVM5UixRQUFPO1dBQW9CNEY7WUFBR21NLFVBQVMsYUFBVzVOO1lBQUU2TixRQUFPLFdBQVM3TjtZQUFFOEUsZUFBYyxTQUFPOUUsSUFBRVo7V0FBR3lDO1lBQUdpTSxlQUFjO1lBQWdCQyxlQUFjO1lBQWdCQyxVQUFTO1lBQVdDLEtBQUk7WUFBTWhMLFFBQU87V0FBVWlCO1lBQUdnSyxVQUFTO1lBQXNCakwsUUFBTztZQUFVa0wsV0FBVTtZQUFhQyxJQUFHO1lBQUtDLGFBQVk7WUFBY0MsV0FBVTtZQUFZQyxVQUFTO1lBQVlDLGdCQUFlO1lBQWlCQyxpQkFBZ0I7V0FBb0J0SztZQUFHdUssUUFBTztZQUFTQyxVQUFTO1dBQVluSyxJQUFFO1lBQVcsU0FBU3BGLEVBQUVqRSxHQUFFVDtnQkFBRyxJQUFJa0QsSUFBRWU7Z0JBQUtsQixFQUFFa0IsTUFBS1MsSUFBR1QsS0FBS21ELFdBQVMzRyxHQUFFd0QsS0FBS2lRLGlCQUFlLFdBQVN6VCxFQUFFZ00sVUFBUW5JLFNBQU83RDtnQkFBRXdELEtBQUttSCxVQUFRbkgsS0FBS29ILFdBQVdyTCxJQUFHaUUsS0FBS2tRLFlBQVVsUSxLQUFLbUgsUUFBUWpLLFNBQU8sTUFBSXFJLEVBQUVvSyxZQUFVLE9BQUszUCxLQUFLbUgsUUFBUWpLLFNBQU8sTUFBSXFJLEVBQUVzSztnQkFBZ0I3UCxLQUFLbVEsZUFBWW5RLEtBQUtvUSxlQUFZcFEsS0FBS3FRLGdCQUFjLE1BQUtyUSxLQUFLc1EsZ0JBQWM7Z0JBQUV6UyxFQUFFbUMsS0FBS2lRLGdCQUFnQjFULEdBQUd1RyxFQUFFb00sUUFBTyxTQUFTclI7b0JBQUcsT0FBT29CLEVBQUVzUixTQUFTMVM7b0JBQUttQyxLQUFLd1EsV0FBVXhRLEtBQUt1UTs7WUFBVyxPQUFPOVAsRUFBRXJDLFVBQVVvUyxVQUFRO2dCQUFXLElBQUloVSxJQUFFd0QsTUFBS2xCLElBQUVrQixLQUFLaVEsbUJBQWlCalEsS0FBS2lRLGVBQWU1UCxTQUFPbUYsRUFBRXdLLFdBQVN4SyxFQUFFdUssUUFBT2hVLElBQUUsV0FBU2lFLEtBQUttSCxRQUFRNkgsU0FBT2xRLElBQUVrQixLQUFLbUgsUUFBUTZILFFBQU8vUCxJQUFFbEQsTUFBSXlKLEVBQUV3SyxXQUFTaFEsS0FBS3lRLGtCQUFnQjtnQkFBRXpRLEtBQUttUSxlQUFZblEsS0FBS29RLGVBQVlwUSxLQUFLc1EsZ0JBQWN0USxLQUFLMFE7Z0JBQW1CLElBQUkxUCxJQUFFbkQsRUFBRTZLLFVBQVU3SyxFQUFFbUMsS0FBS2tRO2dCQUFZbFAsRUFBRTJQLElBQUksU0FBU25VO29CQUFHLElBQUlzQyxTQUFPLEdBQUVrQyxJQUFFNUIsRUFBRTBDLHVCQUF1QnRGO29CQUFHLE9BQU93RSxNQUFJbEMsSUFBRWpCLEVBQUVtRCxHQUFHLEtBQUlsQyxNQUFJQSxFQUFFK1AsZUFBYS9QLEVBQUVvRCxrQkFBZXJFLEVBQUVpQixHQUFHL0MsS0FBSzZVLE1BQUkzUixHQUFFK0IsTUFBRzttQkFBTzZQLE9BQU8sU0FBU2hUO29CQUFHLE9BQU9BO21CQUFJaVQsS0FBSyxTQUFTalQsR0FBRXJCO29CQUFHLE9BQU9xQixFQUFFLEtBQUdyQixFQUFFO21CQUFLdVUsUUFBUSxTQUFTbFQ7b0JBQUdyQixFQUFFMlQsU0FBU2EsS0FBS25ULEVBQUUsS0FBSXJCLEVBQUU0VCxTQUFTWSxLQUFLblQsRUFBRTs7ZUFBTzRDLEVBQUVyQyxVQUFVcUYsVUFBUTtnQkFBVzVGLEVBQUU2RixXQUFXMUQsS0FBS21ELFVBQVN4RCxJQUFHOUIsRUFBRW1DLEtBQUtpUSxnQkFBZ0I3SCxJQUFJL0csSUFBR3JCLEtBQUttRCxXQUFTO2dCQUFLbkQsS0FBS2lRLGlCQUFlLE1BQUtqUSxLQUFLbUgsVUFBUSxNQUFLbkgsS0FBS2tRLFlBQVUsTUFBS2xRLEtBQUttUSxXQUFTO2dCQUFLblEsS0FBS29RLFdBQVMsTUFBS3BRLEtBQUtxUSxnQkFBYyxNQUFLclEsS0FBS3NRLGdCQUFjO2VBQU03UCxFQUFFckMsVUFBVWdKLGFBQVcsU0FBU3RJO2dCQUFHLElBQUdBLElBQUVqQixFQUFFd0ssV0FBVTdGLEdBQUUxRCxJQUFHLG1CQUFpQkEsRUFBRTVCLFFBQU87b0JBQUMsSUFBSW5CLElBQUU4QixFQUFFaUIsRUFBRTVCLFFBQVFpTixLQUFLO29CQUFNcE8sTUFBSUEsSUFBRXFELEVBQUVzQyxPQUFPbEYsSUFBR3FCLEVBQUVpQixFQUFFNUIsUUFBUWlOLEtBQUssTUFBS3BPLEtBQUkrQyxFQUFFNUIsU0FBTyxNQUFJbkI7O2dCQUFFLE9BQU9xRCxFQUFFZ0QsZ0JBQWdCNUYsR0FBRXNDLEdBQUU0RCxJQUFHNUQ7ZUFBRzJCLEVBQUVyQyxVQUFVcVMsZ0JBQWM7Z0JBQVcsT0FBT3pRLEtBQUtpUSxtQkFBaUI1UCxTQUFPTCxLQUFLaVEsZUFBZWdCLGNBQVlqUixLQUFLaVEsZUFBZXRDO2VBQVdsTixFQUFFckMsVUFBVXNTLG1CQUFpQjtnQkFBVyxPQUFPMVEsS0FBS2lRLGVBQWU1QixnQkFBYzFNLEtBQUt1UCxJQUFJM1EsU0FBU3lNLEtBQUtxQixjQUFhOU4sU0FBU2dJLGdCQUFnQjhGO2VBQWU1TixFQUFFckMsVUFBVStTLG1CQUFpQjtnQkFBVyxPQUFPblIsS0FBS2lRLG1CQUFpQjVQLFNBQU9BLE9BQU8rUSxjQUFZcFIsS0FBS2lRLGVBQWUvTjtlQUFjekIsRUFBRXJDLFVBQVVtUyxXQUFTO2dCQUFXLElBQUkxUyxJQUFFbUMsS0FBS3lRLGtCQUFnQnpRLEtBQUttSCxRQUFRNEgsUUFBT3ZTLElBQUV3RCxLQUFLMFEsb0JBQW1CNVIsSUFBRWtCLEtBQUttSCxRQUFRNEgsU0FBT3ZTLElBQUV3RCxLQUFLbVI7Z0JBQW1CLElBQUduUixLQUFLc1Esa0JBQWdCOVQsS0FBR3dELEtBQUt3USxXQUFVM1MsS0FBR2lCLEdBQUU7b0JBQUMsSUFBSS9DLElBQUVpRSxLQUFLb1EsU0FBU3BRLEtBQUtvUSxTQUFTL1UsU0FBTztvQkFBRyxhQUFZMkUsS0FBS3FRLGtCQUFnQnRVLEtBQUdpRSxLQUFLcVIsVUFBVXRWOztnQkFBSSxJQUFHaUUsS0FBS3FRLGlCQUFleFMsSUFBRW1DLEtBQUttUSxTQUFTLE1BQUluUSxLQUFLbVEsU0FBUyxLQUFHLEdBQUUsT0FBT25RLEtBQUtxUSxnQkFBYztxQkFBVXJRLEtBQUtzUjtnQkFBUyxLQUFJLElBQUlyUyxJQUFFZSxLQUFLbVEsU0FBUzlVLFFBQU80RCxPQUFLO29CQUFDLElBQUlHLElBQUVZLEtBQUtxUSxrQkFBZ0JyUSxLQUFLb1EsU0FBU25SLE1BQUlwQixLQUFHbUMsS0FBS21RLFNBQVNsUixZQUFVLE1BQUllLEtBQUttUSxTQUFTbFIsSUFBRSxNQUFJcEIsSUFBRW1DLEtBQUttUSxTQUFTbFIsSUFBRTtvQkFBSUcsS0FBR1ksS0FBS3FSLFVBQVVyUixLQUFLb1EsU0FBU25SOztlQUFNd0IsRUFBRXJDLFVBQVVpVCxZQUFVLFNBQVM3VTtnQkFBR3dELEtBQUtxUSxnQkFBYzdULEdBQUV3RCxLQUFLc1I7Z0JBQVMsSUFBSXhTLElBQUVrQixLQUFLa1EsVUFBVWxTLE1BQU07Z0JBQUtjLElBQUVBLEVBQUU2UixJQUFJLFNBQVM5UztvQkFBRyxPQUFPQSxJQUFFLG1CQUFpQnJCLElBQUUsU0FBT3FCLElBQUUsWUFBVXJCLElBQUU7O2dCQUFRLElBQUlULElBQUU4QixFQUFFaUIsRUFBRXlTLEtBQUs7Z0JBQU14VixFQUFFTSxTQUFTNkcsRUFBRWlNLGtCQUFnQnBULEVBQUU0SCxRQUFRNEIsRUFBRXFLLFVBQVU5VCxLQUFLeUosRUFBRXVLLGlCQUFpQjdULFNBQVNpSCxFQUFFb0I7Z0JBQVF2SSxFQUFFRSxTQUFTaUgsRUFBRW9CLFdBQVN2SSxFQUFFeVYsUUFBUWpNLEVBQUVrSyxJQUFJM1QsS0FBSyxPQUFLeUosRUFBRW9LLFdBQVcxVCxTQUFTaUgsRUFBRW9CO2dCQUFRekcsRUFBRW1DLEtBQUtpUSxnQkFBZ0J4UyxRQUFRcUYsRUFBRW1NO29CQUFVbkcsZUFBY3RNOztlQUFLaUUsRUFBRXJDLFVBQVVrVCxTQUFPO2dCQUFXelQsRUFBRW1DLEtBQUtrUSxXQUFXVyxPQUFPdEwsRUFBRWpCLFFBQVExSSxZQUFZc0gsRUFBRW9CO2VBQVM3RCxFQUFFdUQsbUJBQWlCLFNBQVN4SDtnQkFBRyxPQUFPd0QsS0FBS2hFLEtBQUs7b0JBQVcsSUFBSThDLElBQUVqQixFQUFFbUMsTUFBTWlFLEtBQUt0RSxJQUFHVixJQUFFLGNBQVksc0JBQW9CekMsSUFBRSxjQUFZVCxFQUFFUyxPQUFLQTtvQkFDejArQixJQUFHc0MsTUFBSUEsSUFBRSxJQUFJMkIsRUFBRVQsTUFBS2YsSUFBR3BCLEVBQUVtQyxNQUFNaUUsS0FBS3RFLEdBQUViLEtBQUksbUJBQWlCdEMsR0FBRTt3QkFBQyxTQUFRLE1BQUlzQyxFQUFFdEMsSUFBRyxNQUFNLElBQUlvQixNQUFNLHNCQUFvQnBCLElBQUU7d0JBQUtzQyxFQUFFdEM7OztlQUFTeUMsRUFBRXdCLEdBQUU7Z0JBQU90QixLQUFJO2dCQUFVZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPbkQ7OztnQkFBSzdCLEtBQUk7Z0JBQVVnRixLQUFJLFNBQUFBO29CQUFXLE9BQU8zQjs7a0JBQU0vQjs7UUFBSyxPQUFPNUMsRUFBRXdDLFFBQVE5RCxHQUFHdUcsRUFBRXFELGVBQWM7WUFBVyxLQUFJLElBQUkzSixJQUFFcUIsRUFBRTZLLFVBQVU3SyxFQUFFMEgsRUFBRWdLLFlBQVd6USxJQUFFdEMsRUFBRW5CLFFBQU95RCxPQUFLO2dCQUFDLElBQUkvQyxJQUFFOEIsRUFBRXJCLEVBQUVzQztnQkFBSStHLEVBQUU3QixpQkFBaUIxRSxLQUFLdkQsR0FBRUEsRUFBRWtJOztZQUFXcEcsRUFBRUMsR0FBR3RCLEtBQUdxSixFQUFFN0Isa0JBQWlCbkcsRUFBRUMsR0FBR3RCLEdBQUc0SCxjQUFZeUIsR0FBRWhJLEVBQUVDLEdBQUd0QixHQUFHNkgsYUFBVztZQUFXLE9BQU94RyxFQUFFQyxHQUFHdEIsS0FBR29FLEdBQUVpRixFQUFFN0I7V0FBa0I2QjtNQUFHbEksU0FBUSxTQUFTRTtRQUFHLElBQUlyQixJQUFFLE9BQU1ULElBQUUsaUJBQWdCaUYsSUFBRSxVQUFTckIsSUFBRSxNQUFJcUIsR0FBRUssSUFBRSxhQUFZWixJQUFFNUMsRUFBRUMsR0FBR3RCLElBQUdvRSxJQUFFLEtBQUk0QjtZQUFHNEcsTUFBSyxTQUFPeko7WUFBRTBKLFFBQU8sV0FBUzFKO1lBQUVzRCxNQUFLLFNBQU90RDtZQUFFd0osT0FBTSxVQUFReEo7WUFBRWtELGdCQUFlLFVBQVFsRCxJQUFFMEI7V0FBR3FCO1lBQUcwTSxlQUFjO1lBQWdCOUssUUFBTztZQUFTcUcsVUFBUztZQUFXM0gsTUFBSztZQUFPQyxNQUFLO1dBQVFIO1lBQUcyTyxHQUFFO1lBQUloQyxJQUFHO1lBQUtHLFVBQVM7WUFBWThCLE1BQUs7WUFBMEVDLFlBQVc7WUFBNkJyTixRQUFPO1lBQVVzTixjQUFhO1lBQW1DbE4sYUFBWTtZQUE0Q29MLGlCQUFnQjtZQUFtQitCLHVCQUFzQjtXQUE0QjNPLElBQUU7WUFBVyxTQUFTMUcsRUFBRXFCO2dCQUFHaUIsRUFBRWtCLE1BQUt4RCxJQUFHd0QsS0FBS21ELFdBQVN0Rjs7WUFBRSxPQUFPckIsRUFBRTRCLFVBQVU3QyxPQUFLO2dCQUFXLElBQUlpQixJQUFFd0Q7Z0JBQUssTUFBS0EsS0FBS21ELFNBQVNtSSxjQUFZdEwsS0FBS21ELFNBQVNtSSxXQUFXN0wsYUFBVzZOLEtBQUtDLGdCQUFjMVAsRUFBRW1DLEtBQUttRCxVQUFVOUcsU0FBU3FHLEVBQUU0QixXQUFTekcsRUFBRW1DLEtBQUttRCxVQUFVOUcsU0FBU3FHLEVBQUVpSSxZQUFXO29CQUFDLElBQUk3TCxTQUFPLEdBQUUvQyxTQUFPLEdBQUVrRCxJQUFFcEIsRUFBRW1DLEtBQUttRCxVQUFVUSxRQUFRYixFQUFFNE8sTUFBTSxJQUFHMVEsSUFBRTVCLEVBQUUwQyx1QkFBdUI5QixLQUFLbUQ7b0JBQVVsRSxNQUFJbEQsSUFBRThCLEVBQUU2SyxVQUFVN0ssRUFBRW9CLEdBQUduRCxLQUFLZ0gsRUFBRXdCLFVBQVN2SSxJQUFFQSxFQUFFQSxFQUFFVixTQUFPO29CQUFJLElBQUlzRSxJQUFFOUIsRUFBRStGLE1BQU1wQixFQUFFNEc7d0JBQU1OLGVBQWM5SSxLQUFLbUQ7d0JBQVc5QixJQUFFeEQsRUFBRStGLE1BQU1wQixFQUFFUzt3QkFBTTZGLGVBQWMvTTs7b0JBQUksSUFBR0EsS0FBRzhCLEVBQUU5QixHQUFHMEIsUUFBUWtDLElBQUc5QixFQUFFbUMsS0FBS21ELFVBQVUxRixRQUFRNEQsS0FBSUEsRUFBRWtDLHlCQUF1QjVELEVBQUU0RCxzQkFBcUI7d0JBQUN2QyxNQUFJbEMsSUFBRWpCLEVBQUVtRCxHQUFHLEtBQUloQixLQUFLcVIsVUFBVXJSLEtBQUttRCxVQUFTbEU7d0JBQUcsSUFBSXdCLElBQUUsU0FBRkE7NEJBQWEsSUFBSTNCLElBQUVqQixFQUFFK0YsTUFBTXBCLEVBQUU2RztnQ0FBUVAsZUFBY3RNLEVBQUUyRztnQ0FBV2xFLElBQUVwQixFQUFFK0YsTUFBTXBCLEVBQUUyRztnQ0FBT0wsZUFBYy9NOzs0QkFBSThCLEVBQUU5QixHQUFHMEIsUUFBUXFCLElBQUdqQixFQUFFckIsRUFBRTJHLFVBQVUxRixRQUFRd0I7O3dCQUFJSCxJQUFFa0IsS0FBS3FSLFVBQVV2UyxHQUFFQSxFQUFFd00sWUFBVzdLLEtBQUdBOzs7ZUFBT2pFLEVBQUU0QixVQUFVcUYsVUFBUTtnQkFBVzVGLEVBQUVqQyxZQUFZb0UsS0FBS21ELFVBQVNuQyxJQUFHaEIsS0FBS21ELFdBQVM7ZUFBTTNHLEVBQUU0QixVQUFVaVQsWUFBVSxTQUFTN1UsR0FBRXNDLEdBQUUvQztnQkFBRyxJQUFJa0QsSUFBRWUsTUFBS2dCLElBQUVuRCxFQUFFaUIsR0FBR2hELEtBQUtnSCxFQUFFOE8sY0FBYyxJQUFHalMsSUFBRTVELEtBQUdxRCxFQUFFOEIsNEJBQTBCRixLQUFHbkQsRUFBRW1ELEdBQUczRSxTQUFTcUcsRUFBRU0sU0FBT2IsUUFBUXRFLEVBQUVpQixHQUFHaEQsS0FBS2dILEVBQUU2TyxZQUFZLE1BQUt0USxJQUFFLFNBQUZBO29CQUFhLE9BQU9wQyxFQUFFNlMsb0JBQW9CdFYsR0FBRXdFLEdBQUVyQixHQUFFNUQ7O2dCQUFJaUYsS0FBR3JCLElBQUU5QixFQUFFbUQsR0FBR0wsSUFBSXZCLEVBQUV5QixnQkFBZVEsR0FBR0oscUJBQXFCTCxLQUFHUyxLQUFJTCxLQUFHbkQsRUFBRW1ELEdBQUdwRixZQUFZOEcsRUFBRU87ZUFBT3pHLEVBQUU0QixVQUFVMFQsc0JBQW9CLFNBQVN0VixHQUFFc0MsR0FBRS9DLEdBQUVrRDtnQkFBRyxJQUFHSCxHQUFFO29CQUFDakIsRUFBRWlCLEdBQUdsRCxZQUFZOEcsRUFBRTRCO29CQUFRLElBQUl0RCxJQUFFbkQsRUFBRWlCLEVBQUV3TSxZQUFZeFAsS0FBS2dILEVBQUUrTyx1QkFBdUI7b0JBQUc3USxLQUFHbkQsRUFBRW1ELEdBQUdwRixZQUFZOEcsRUFBRTRCLFNBQVF4RixFQUFFa0csYUFBYSxrQkFBaUI7O2dCQUFHLElBQUduSCxFQUFFckIsR0FBR1AsU0FBU3lHLEVBQUU0QixTQUFROUgsRUFBRXdJLGFBQWEsa0JBQWlCLElBQUdqSixLQUFHcUQsRUFBRTZDLE9BQU96RjtnQkFBR3FCLEVBQUVyQixHQUFHUCxTQUFTeUcsRUFBRU8sU0FBT3BGLEVBQUVyQixHQUFHWixZQUFZOEcsRUFBRU0sT0FBTXhHLEVBQUU4TyxjQUFZek4sRUFBRXJCLEVBQUU4TyxZQUFZalAsU0FBU3FHLEVBQUUwTSxnQkFBZTtvQkFBQyxJQUFJelAsSUFBRTlCLEVBQUVyQixHQUFHbUgsUUFBUWIsRUFBRThNLFVBQVU7b0JBQUdqUSxLQUFHOUIsRUFBRThCLEdBQUc3RCxLQUFLZ0gsRUFBRWdOLGlCQUFpQjdULFNBQVN5RyxFQUFFNEIsU0FBUTlILEVBQUV3SSxhQUFhLGtCQUFpQjs7Z0JBQUcvRixLQUFHQTtlQUFLekMsRUFBRXdILG1CQUFpQixTQUFTbEY7Z0JBQUcsT0FBT2tCLEtBQUtoRSxLQUFLO29CQUFXLElBQUlELElBQUU4QixFQUFFbUMsT0FBTWYsSUFBRWxELEVBQUVrSSxLQUFLakQ7b0JBQUcsSUFBRy9CLE1BQUlBLElBQUUsSUFBSXpDLEVBQUV3RCxPQUFNakUsRUFBRWtJLEtBQUtqRCxHQUFFL0IsS0FBSSxtQkFBaUJILEdBQUU7d0JBQUMsU0FBUSxNQUFJRyxFQUFFSCxJQUFHLE1BQU0sSUFBSWxCLE1BQU0sc0JBQW9Ca0IsSUFBRTt3QkFBS0csRUFBRUg7OztlQUFTRyxFQUFFekMsR0FBRTtnQkFBTzJDLEtBQUk7Z0JBQVVnRixLQUFJLFNBQUFBO29CQUFXLE9BQU9wSTs7a0JBQU1TOztRQUFLLE9BQU9xQixFQUFFMEMsVUFBVWhFLEdBQUdpRyxFQUFFSyxnQkFBZUMsRUFBRTRCLGFBQVksU0FBU2xJO1lBQUdBLEVBQUVnQixrQkFBaUIwRixFQUFFYyxpQkFBaUIxRSxLQUFLekIsRUFBRW1DLE9BQU07WUFBVW5DLEVBQUVDLEdBQUd0QixLQUFHMEcsRUFBRWMsa0JBQWlCbkcsRUFBRUMsR0FBR3RCLEdBQUc0SCxjQUFZbEIsR0FBRXJGLEVBQUVDLEdBQUd0QixHQUFHNkgsYUFBVztZQUFXLE9BQU94RyxFQUFFQyxHQUFHdEIsS0FBR2lFLEdBQUV5QyxFQUFFYztXQUFrQmQ7TUFBR3ZGLFNBQVEsU0FBU0U7UUFBRyxJQUFHLHNCQUFvQmtVLFFBQU8sTUFBTSxJQUFJblUsTUFBTTtRQUF5RCxJQUFJcEIsSUFBRSxXQUFVd0UsSUFBRSxpQkFBZ0JyQixJQUFFLGNBQWEwQixJQUFFLE1BQUkxQixHQUFFYyxJQUFFNUMsRUFBRUMsR0FBR3RCLElBQUdvRSxJQUFFLEtBQUk0QixJQUFFLGFBQVlFO1lBQUdzUCxZQUFXO1lBQUVDLFVBQVM7WUFBOEV4VSxTQUFRO1lBQWN5VSxPQUFNO1lBQUdDLE9BQU07WUFBRUMsT0FBTTtZQUFFQyxXQUFVO1lBQUVDLFdBQVU7WUFBTXZELFFBQU87WUFBTXdEO1lBQWVDLFlBQVc7V0FBRzFQO1lBQUdrUCxXQUFVO1lBQVVDLFVBQVM7WUFBU0MsT0FBTTtZQUE0QnpVLFNBQVE7WUFBUzBVLE9BQU07WUFBa0JDLE1BQUs7WUFBVUMsVUFBUztZQUFtQkMsV0FBVTtZQUFvQnZELFFBQU87WUFBU3dELGFBQVk7WUFBUUMsV0FBVTtXQUE0QnRQO1lBQUd1UCxLQUFJO1lBQWdCN00sT0FBTTtZQUFjOE0sUUFBTztZQUFhL00sTUFBSztXQUFnQko7WUFBR3RDLE1BQUs7WUFBTzBQLEtBQUk7V0FBT25OO1lBQUc0RCxNQUFLLFNBQU8vSDtZQUFFZ0ksUUFBTyxXQUFTaEk7WUFBRTRCLE1BQUssU0FBTzVCO1lBQUU4SCxPQUFNLFVBQVE5SDtZQUFFdVIsVUFBUyxhQUFXdlI7WUFBRWtKLE9BQU0sVUFBUWxKO1lBQUV1SyxTQUFRLFlBQVV2SztZQUFFd1IsVUFBUyxhQUFXeFI7WUFBRTRFLFlBQVcsZUFBYTVFO1lBQUU2RSxZQUFXLGVBQWE3RTtXQUFHd0U7WUFBRzdDLE1BQUs7WUFBT0MsTUFBSztXQUFRbUQ7WUFBRzBNLFNBQVE7WUFBV0MsZUFBYztXQUFrQnhNO1lBQUc5SyxVQUFTO1lBQUV1WCxVQUFTO1dBQUduTTtZQUFHb00sT0FBTTtZQUFRek8sT0FBTTtZQUFRK0YsT0FBTTtZQUFRMkksUUFBTztXQUFVQyxJQUFFO1lBQVcsU0FBUzFTLEVBQUU1QyxHQUFFckI7Z0JBQUdzQyxFQUFFa0IsTUFBS1MsSUFBR1QsS0FBS29ULGNBQVksR0FBRXBULEtBQUtxVCxXQUFTLEdBQUVyVCxLQUFLc1QsY0FBWSxJQUFHdFQsS0FBS3VUO2dCQUFrQnZULEtBQUs0SixvQkFBa0IsR0FBRTVKLEtBQUt3VCxVQUFRLE1BQUt4VCxLQUFLdkUsVUFBUW9DLEdBQUVtQyxLQUFLeVQsU0FBT3pULEtBQUtvSCxXQUFXNUs7Z0JBQUd3RCxLQUFLMFQsTUFBSSxNQUFLMVQsS0FBSzJUOztZQUFnQixPQUFPbFQsRUFBRXJDLFVBQVV3VixTQUFPO2dCQUFXNVQsS0FBS29ULGNBQVk7ZUFBRzNTLEVBQUVyQyxVQUFVeVYsVUFBUTtnQkFBVzdULEtBQUtvVCxjQUFZO2VBQUczUyxFQUFFckMsVUFBVTBWLGdCQUFjO2dCQUFXOVQsS0FBS29ULGNBQVlwVCxLQUFLb1Q7ZUFBWTNTLEVBQUVyQyxVQUFVeUcsU0FBTyxTQUFTckk7Z0JBQUcsSUFBR0EsR0FBRTtvQkFBQyxJQUFJc0MsSUFBRWtCLEtBQUt6QixZQUFZd1YsVUFBU2hZLElBQUU4QixFQUFFckIsRUFBRTJSLGVBQWVsSyxLQUFLbkY7b0JBQUcvQyxNQUFJQSxJQUFFLElBQUlpRSxLQUFLekIsWUFBWS9CLEVBQUUyUixlQUFjbk8sS0FBS2dVLHVCQUFzQm5XLEVBQUVyQixFQUFFMlIsZUFBZWxLLEtBQUtuRixHQUFFL0M7b0JBQUlBLEVBQUV3WCxlQUFlVSxTQUFPbFksRUFBRXdYLGVBQWVVLE9BQU1sWSxFQUFFbVkseUJBQXVCblksRUFBRW9ZLE9BQU8sTUFBS3BZLEtBQUdBLEVBQUVxWSxPQUFPLE1BQUtyWTt1QkFBTztvQkFBQyxJQUFHOEIsRUFBRW1DLEtBQUtxVSxpQkFBaUJoWSxTQUFTd0osRUFBRTVDLE9BQU0sWUFBWWpELEtBQUtvVSxPQUFPLE1BQUtwVTtvQkFBTUEsS0FBS21VLE9BQU8sTUFBS25VOztlQUFRUyxFQUFFckMsVUFBVXFGLFVBQVE7Z0JBQVc2USxhQUFhdFUsS0FBS3FULFdBQVVyVCxLQUFLdVUsaUJBQWdCMVcsRUFBRTZGLFdBQVcxRCxLQUFLdkUsU0FBUXVFLEtBQUt6QixZQUFZd1Y7Z0JBQVVsVyxFQUFFbUMsS0FBS3ZFLFNBQVMyTSxJQUFJcEksS0FBS3pCLFlBQVlpVyxZQUFXM1csRUFBRW1DLEtBQUt2RSxTQUFTa0ksUUFBUSxVQUFVeUUsSUFBSTtnQkFBaUJwSSxLQUFLMFQsT0FBSzdWLEVBQUVtQyxLQUFLMFQsS0FBSzNQLFVBQVMvRCxLQUFLb1QsYUFBVyxNQUFLcFQsS0FBS3FULFdBQVM7Z0JBQUtyVCxLQUFLc1QsY0FBWSxNQUFLdFQsS0FBS3VULGlCQUFlLE1BQUt2VCxLQUFLd1QsVUFBUSxNQUFLeFQsS0FBS3ZFLFVBQVE7Z0JBQUt1RSxLQUFLeVQsU0FBTyxNQUFLelQsS0FBSzBULE1BQUk7ZUFBTWpULEVBQUVyQyxVQUFVN0MsT0FBSztnQkFBVyxJQUFJaUIsSUFBRXdEO2dCQUFLLElBQUcsV0FBU25DLEVBQUVtQyxLQUFLdkUsU0FBU3dCLElBQUksWUFBVyxNQUFNLElBQUlXLE1BQU07Z0JBQXVDLElBQUlrQixJQUFFakIsRUFBRStGLE1BQU01RCxLQUFLekIsWUFBWXFGLE1BQU1YO2dCQUFNLElBQUdqRCxLQUFLeVUsbUJBQWlCelUsS0FBS29ULFlBQVc7b0JBQUMsSUFBR3BULEtBQUs0SixrQkFBaUIsTUFBTSxJQUFJaE0sTUFBTTtvQkFBNEJDLEVBQUVtQyxLQUFLdkUsU0FBU2dDLFFBQVFxQjtvQkFBRyxJQUFJL0MsSUFBRThCLEVBQUUyTixTQUFTeEwsS0FBS3ZFLFFBQVFpWixjQUFjbk0saUJBQWdCdkksS0FBS3ZFO29CQUFTLElBQUdxRCxFQUFFeUUseUJBQXVCeEgsR0FBRTtvQkFBTyxJQUFJa0QsSUFBRWUsS0FBS3FVLGlCQUFnQnJULElBQUU1QixFQUFFc0MsT0FBTzFCLEtBQUt6QixZQUFZb1c7b0JBQU0xVixFQUFFK0YsYUFBYSxNQUFLaEUsSUFBR2hCLEtBQUt2RSxRQUFRdUosYUFBYSxvQkFBbUJoRSxJQUFHaEIsS0FBSzRVO29CQUFhNVUsS0FBS3lULE9BQU96QixhQUFXblUsRUFBRW9CLEdBQUdoRCxTQUFTNEosRUFBRTdDO29CQUFNLElBQUlyRCxJQUFFLHFCQUFtQkssS0FBS3lULE9BQU9uQixZQUFVdFMsS0FBS3lULE9BQU9uQixVQUFVaFQsS0FBS1UsTUFBS2YsR0FBRWUsS0FBS3ZFLFdBQVN1RSxLQUFLeVQsT0FBT25CLFdBQVVqUixJQUFFckIsS0FBSzZVLGVBQWVsVixJQUFHaUIsSUFBRVosS0FBS3lULE9BQU9qQixlQUFhLElBQUVqUyxTQUFTeU0sT0FBS25QLEVBQUVtQyxLQUFLeVQsT0FBT2pCO29CQUFXM1UsRUFBRW9CLEdBQUdnRixLQUFLakUsS0FBS3pCLFlBQVl3VixVQUFTL1QsTUFBTWtPLFNBQVN0TixJQUFHL0MsRUFBRW1DLEtBQUt2RSxTQUFTZ0MsUUFBUXVDLEtBQUt6QixZQUFZcUYsTUFBTWdQO29CQUFVNVMsS0FBS3dULFVBQVEsSUFBSXpCO3dCQUFRK0MsWUFBV3pUO3dCQUFFNUYsU0FBUXdEO3dCQUFFL0IsUUFBTzhDLEtBQUt2RTt3QkFBUXNaLFNBQVF4Tzt3QkFBRXlPLGFBQVl4Uzt3QkFBRXVNLFFBQU8vTyxLQUFLeVQsT0FBTzFFO3dCQUFPd0QsYUFBWXZTLEtBQUt5VCxPQUFPbEI7d0JBQVkwQyxtQkFBa0I7d0JBQUk3VixFQUFFNkMsT0FBT2hELElBQUdlLEtBQUt3VCxRQUFRMEIsWUFBV3JYLEVBQUVvQixHQUFHaEQsU0FBUzRKLEVBQUU1QztvQkFBTSxJQUFJUCxJQUFFLFNBQUZBO3dCQUFhLElBQUk1RCxJQUFFdEMsRUFBRThXO3dCQUFZOVcsRUFBRThXLGNBQVksTUFBSzlXLEVBQUVvTixvQkFBa0IsR0FBRS9MLEVBQUVyQixFQUFFZixTQUFTZ0MsUUFBUWpCLEVBQUUrQixZQUFZcUYsTUFBTXVGO3dCQUFPckssTUFBSXlHLEVBQUVvTixPQUFLblcsRUFBRTRYLE9BQU8sTUFBSzVYOztvQkFBSSxJQUFHNEMsRUFBRThCLDJCQUF5QnJELEVBQUVtQyxLQUFLMFQsS0FBS3JYLFNBQVN3SixFQUFFN0MsT0FBTSxPQUFPaEQsS0FBSzRKLG9CQUFrQjt5QkFBTy9MLEVBQUVtQyxLQUFLMFQsS0FBSy9TLElBQUl2QixFQUFFeUIsZ0JBQWU2QixHQUFHekIscUJBQXFCUixFQUFFMFU7b0JBQXNCelM7O2VBQU1qQyxFQUFFckMsVUFBVTlDLE9BQUssU0FBU2tCO2dCQUFHLElBQUlzQyxJQUFFa0IsTUFBS2pFLElBQUVpRSxLQUFLcVUsaUJBQWdCcFYsSUFBRXBCLEVBQUUrRixNQUFNNUQsS0FBS3pCLFlBQVlxRixNQUFNd0Y7Z0JBQU0sSUFBR3BKLEtBQUs0SixrQkFBaUIsTUFBTSxJQUFJaE0sTUFBTTtnQkFBNEIsSUFBSW9ELElBQUUsU0FBRkE7b0JBQWFsQyxFQUFFd1UsZ0JBQWMvTixFQUFFdEMsUUFBTWxILEVBQUV1UCxjQUFZdlAsRUFBRXVQLFdBQVdDLFlBQVl4UCxJQUFHK0MsRUFBRXJELFFBQVFpUyxnQkFBZ0I7b0JBQW9CN1AsRUFBRWlCLEVBQUVyRCxTQUFTZ0MsUUFBUXFCLEVBQUVQLFlBQVlxRixNQUFNeUYsU0FBUXZLLEVBQUU4SyxvQkFBa0IsR0FBRTlLLEVBQUV5VjtvQkFBZ0IvWCxLQUFHQTs7Z0JBQUtxQixFQUFFbUMsS0FBS3ZFLFNBQVNnQyxRQUFRd0IsSUFBR0EsRUFBRXNFLHlCQUF1QjFGLEVBQUU5QixHQUFHSCxZQUFZaUssRUFBRTVDO2dCQUFNakQsS0FBS3VULGVBQWUxTSxFQUFFMEQsVUFBUSxHQUFFdkssS0FBS3VULGVBQWUxTSxFQUFFckMsVUFBUSxHQUFFeEUsS0FBS3VULGVBQWUxTSxFQUFFb00sVUFBUTtnQkFBRTdULEVBQUU4QiwyQkFBeUJyRCxFQUFFbUMsS0FBSzBULEtBQUtyWCxTQUFTd0osRUFBRTdDLFNBQU9oRCxLQUFLNEosb0JBQWtCO2dCQUFFL0wsRUFBRTlCLEdBQUc0RSxJQUFJdkIsRUFBRXlCLGdCQUFlRyxHQUFHQyxxQkFBcUJMLE1BQUlJLEtBQUloQixLQUFLc1QsY0FBWTtlQUFLN1MsRUFBRXJDLFVBQVVxVyxnQkFBYztnQkFBVyxPQUFPdFMsUUFBUW5DLEtBQUtvVjtlQUFhM1UsRUFBRXJDLFVBQVVpVyxnQkFBYztnQkFBVyxPQUFPclUsS0FBSzBULE1BQUkxVCxLQUFLMFQsT0FBSzdWLEVBQUVtQyxLQUFLeVQsT0FBT3hCLFVBQVU7ZUFBSXhSLEVBQUVyQyxVQUFVd1csYUFBVztnQkFBVyxJQUFJcFksSUFBRXFCLEVBQUVtQyxLQUFLcVU7Z0JBQWlCclUsS0FBS3FWLGtCQUFrQjdZLEVBQUVWLEtBQUtzSyxFQUFFMk0sZ0JBQWUvUyxLQUFLb1YsYUFBWTVZLEVBQUVaLFlBQVlpSyxFQUFFN0MsT0FBSyxNQUFJNkMsRUFBRTVDO2dCQUFNakQsS0FBS3VVO2VBQWlCOVQsRUFBRXJDLFVBQVVpWCxvQkFBa0IsU0FBUzdZLEdBQUVzQztnQkFBRyxJQUFJRyxJQUFFZSxLQUFLeVQsT0FBT3JCO2dCQUFLLGNBQVksc0JBQW9CdFQsSUFBRSxjQUFZL0MsRUFBRStDLFFBQU1BLEVBQUVXLFlBQVVYLEVBQUVmLFVBQVFrQixJQUFFcEIsRUFBRWlCLEdBQUdqRCxTQUFTa0UsR0FBR3ZELE1BQUlBLEVBQUU4WSxRQUFRQyxPQUFPelcsS0FBR3RDLEVBQUVnWixLQUFLM1gsRUFBRWlCLEdBQUcwVyxVQUFRaFosRUFBRXlDLElBQUUsU0FBTyxRQUFRSDtlQUFJMkIsRUFBRXJDLFVBQVVnWCxXQUFTO2dCQUFXLElBQUl2WCxJQUFFbUMsS0FBS3ZFLFFBQVFzRyxhQUFhO2dCQUF1QixPQUFPbEUsTUFBSUEsSUFBRSxxQkFBbUJtQyxLQUFLeVQsT0FBT3ZCLFFBQU1sUyxLQUFLeVQsT0FBT3ZCLE1BQU01UyxLQUFLVSxLQUFLdkUsV0FBU3VFLEtBQUt5VCxPQUFPdkI7Z0JBQU9yVTtlQUFHNEMsRUFBRXJDLFVBQVVtVyxnQkFBYztnQkFBV3ZVLEtBQUt3VCxXQUFTeFQsS0FBS3dULFFBQVFpQztlQUFXaFYsRUFBRXJDLFVBQVV5VyxpQkFBZSxTQUFTaFg7Z0JBQUcsT0FBT3FGLEVBQUVyRixFQUFFMEU7ZUFBZ0I5QixFQUFFckMsVUFBVXVWLGdCQUFjO2dCQUFXLElBQUluWCxJQUFFd0QsTUFBS2xCLElBQUVrQixLQUFLeVQsT0FBT2hXLFFBQVFPLE1BQU07Z0JBQUtjLEVBQUVpUyxRQUFRLFNBQVNqUztvQkFBRyxJQUFHLFlBQVVBLEdBQUVqQixFQUFFckIsRUFBRWYsU0FBU2MsR0FBR0MsRUFBRStCLFlBQVlxRixNQUFNMkcsT0FBTS9OLEVBQUVpWCxPQUFPcEIsVUFBUyxTQUFTeFU7d0JBQUcsT0FBT3JCLEVBQUVxSSxPQUFPaEg7NkJBQVUsSUFBR2lCLE1BQUkrSCxFQUFFcU0sUUFBTzt3QkFBQyxJQUFJblgsSUFBRStDLE1BQUkrSCxFQUFFb00sUUFBTXpXLEVBQUUrQixZQUFZcUYsTUFBTXFDLGFBQVd6SixFQUFFK0IsWUFBWXFGLE1BQU1nSSxTQUFRM00sSUFBRUgsTUFBSStILEVBQUVvTSxRQUFNelcsRUFBRStCLFlBQVlxRixNQUFNc0MsYUFBVzFKLEVBQUUrQixZQUFZcUYsTUFBTWlQO3dCQUFTaFYsRUFBRXJCLEVBQUVmLFNBQVNjLEdBQUdSLEdBQUVTLEVBQUVpWCxPQUFPcEIsVUFBUyxTQUFTeFU7NEJBQUcsT0FBT3JCLEVBQUUyWCxPQUFPdFc7MkJBQUt0QixHQUFHMEMsR0FBRXpDLEVBQUVpWCxPQUFPcEIsVUFBUyxTQUFTeFU7NEJBQUcsT0FBT3JCLEVBQUU0WCxPQUFPdlc7OztvQkFBS0EsRUFBRXJCLEVBQUVmLFNBQVNrSSxRQUFRLFVBQVVwSCxHQUFHLGlCQUFnQjt3QkFBVyxPQUFPQyxFQUFFbEI7O29CQUFXMEUsS0FBS3lULE9BQU9wQixXQUFTclMsS0FBS3lULFNBQU81VixFQUFFd0ssV0FBVXJJLEtBQUt5VDtvQkFBUWhXLFNBQVE7b0JBQVM0VSxVQUFTO3FCQUFLclMsS0FBSzBWO2VBQWFqVixFQUFFckMsVUFBVXNYLFlBQVU7Z0JBQVcsSUFBSTdYLElBQUU5QixFQUFFaUUsS0FBS3ZFLFFBQVFzRyxhQUFhO2lCQUF5Qi9CLEtBQUt2RSxRQUFRc0csYUFBYSxZQUFVLGFBQVdsRSxPQUFLbUMsS0FBS3ZFLFFBQVF1SixhQUFhLHVCQUFzQmhGLEtBQUt2RSxRQUFRc0csYUFBYSxZQUFVO2dCQUFJL0IsS0FBS3ZFLFFBQVF1SixhQUFhLFNBQVE7ZUFBTXZFLEVBQUVyQyxVQUFVK1YsU0FBTyxTQUFTM1gsR0FBRXNDO2dCQUFHLElBQUkvQyxJQUFFaUUsS0FBS3pCLFlBQVl3VjtnQkFBUyxPQUFPalYsSUFBRUEsS0FBR2pCLEVBQUVyQixFQUFFMlIsZUFBZWxLLEtBQUtsSSxJQUFHK0MsTUFBSUEsSUFBRSxJQUFJa0IsS0FBS3pCLFlBQVkvQixFQUFFMlIsZUFBY25PLEtBQUtnVTtnQkFBc0JuVyxFQUFFckIsRUFBRTJSLGVBQWVsSyxLQUFLbEksR0FBRStDLEtBQUl0QyxNQUFJc0MsRUFBRXlVLGVBQWUsY0FBWS9XLEVBQUVzSSxPQUFLK0IsRUFBRXJDLFFBQU1xQyxFQUFFb00sVUFBUTtnQkFBR3BWLEVBQUVpQixFQUFFdVYsaUJBQWlCaFksU0FBU3dKLEVBQUU1QyxTQUFPbkUsRUFBRXdVLGdCQUFjL04sRUFBRXRDLGFBQVVuRSxFQUFFd1UsY0FBWS9OLEVBQUV0QyxTQUFPcVIsYUFBYXhWLEVBQUV1VTtnQkFBVXZVLEVBQUV3VSxjQUFZL04sRUFBRXRDLE1BQUtuRSxFQUFFMlUsT0FBT3RCLFNBQU9yVCxFQUFFMlUsT0FBT3RCLE1BQU01VyxhQUFVdUQsRUFBRXVVLFdBQVN2UyxXQUFXO29CQUFXaEMsRUFBRXdVLGdCQUFjL04sRUFBRXRDLFFBQU1uRSxFQUFFdkQ7bUJBQVF1RCxFQUFFMlUsT0FBT3RCLE1BQU01VyxjQUFZdUQsRUFBRXZEO2VBQVNrRixFQUFFckMsVUFBVWdXLFNBQU8sU0FBUzVYLEdBQUVzQztnQkFBRyxJQUFJL0MsSUFBRWlFLEtBQUt6QixZQUFZd1Y7Z0JBQVMsSUFBR2pWLElBQUVBLEtBQUdqQixFQUFFckIsRUFBRTJSLGVBQWVsSyxLQUFLbEksSUFBRytDLE1BQUlBLElBQUUsSUFBSWtCLEtBQUt6QixZQUFZL0IsRUFBRTJSLGVBQWNuTyxLQUFLZ1U7Z0JBQXNCblcsRUFBRXJCLEVBQUUyUixlQUFlbEssS0FBS2xJLEdBQUUrQyxLQUFJdEMsTUFBSXNDLEVBQUV5VSxlQUFlLGVBQWEvVyxFQUFFc0ksT0FBSytCLEVBQUVyQyxRQUFNcUMsRUFBRW9NLFVBQVE7aUJBQUluVSxFQUFFb1Ysd0JBQXVCLE9BQU9JLGFBQWF4VixFQUFFdVUsV0FBVXZVLEVBQUV3VSxjQUFZL04sRUFBRW9OO2dCQUFJN1QsRUFBRTJVLE9BQU90QixTQUFPclQsRUFBRTJVLE9BQU90QixNQUFNN1csYUFBVXdELEVBQUV1VSxXQUFTdlMsV0FBVztvQkFBV2hDLEVBQUV3VSxnQkFBYy9OLEVBQUVvTixPQUFLN1QsRUFBRXhEO21CQUFRd0QsRUFBRTJVLE9BQU90QixNQUFNN1csY0FBWXdELEVBQUV4RDtlQUFRbUYsRUFBRXJDLFVBQVU4Vix1QkFBcUI7Z0JBQVcsS0FBSSxJQUFJclcsS0FBS21DLEtBQUt1VCxnQkFBbEI7b0JBQWlDLElBQUd2VCxLQUFLdVQsZUFBZTFWLElBQUcsUUFBTzs7Z0JBQUUsUUFBTztlQUFHNEMsRUFBRXJDLFVBQVVnSixhQUFXLFNBQVN0STtnQkFBRyxPQUFPQSxJQUFFakIsRUFBRXdLLFdBQVVySSxLQUFLekIsWUFBWXVRLFNBQVFqUixFQUFFbUMsS0FBS3ZFLFNBQVN3SSxRQUFPbkYsSUFBR0EsRUFBRXFULFNBQU8sbUJBQWlCclQsRUFBRXFULFVBQVFyVCxFQUFFcVQ7b0JBQU81VyxNQUFLdUQsRUFBRXFUO29CQUFNN1csTUFBS3dELEVBQUVxVDtvQkFBUS9TLEVBQUVnRCxnQkFBZ0I1RixHQUFFc0MsR0FBRWtCLEtBQUt6QixZQUFZb1gsY0FBYTdXO2VBQUcyQixFQUFFckMsVUFBVTRWLHFCQUFtQjtnQkFBVyxJQUFJblc7Z0JBQUssSUFBR21DLEtBQUt5VCxRQUFPLEtBQUksSUFBSWpYLEtBQUt3RCxLQUFLeVQsUUFBbEI7b0JBQXlCelQsS0FBS3pCLFlBQVl1USxRQUFRdFMsT0FBS3dELEtBQUt5VCxPQUFPalgsT0FBS3FCLEVBQUVyQixLQUFHd0QsS0FBS3lULE9BQU9qWDs7Z0JBQUksT0FBT3FCO2VBQUc0QyxFQUFFdUQsbUJBQWlCLFNBQVN4SDtnQkFBRyxPQUFPd0QsS0FBS2hFLEtBQUs7b0JBQVcsSUFBSThDLElBQUVqQixFQUFFbUMsTUFBTWlFLEtBQUt0RSxJQUFHVixJQUFFLGNBQVksc0JBQW9CekMsSUFBRSxjQUFZVCxFQUFFUyxPQUFLQTtvQkFBRSxLQUFJc0MsTUFBSSxlQUFla0QsS0FBS3hGLFFBQU1zQyxNQUFJQSxJQUFFLElBQUkyQixFQUFFVCxNQUFLZixJQUFHcEIsRUFBRW1DLE1BQU1pRSxLQUFLdEUsR0FBRWI7b0JBQUksbUJBQWlCdEMsSUFBRzt3QkFBQyxTQUFRLE1BQUlzQyxFQUFFdEMsSUFBRyxNQUFNLElBQUlvQixNQUFNLHNCQUFvQnBCLElBQUU7d0JBQUtzQyxFQUFFdEM7OztlQUFTeUMsRUFBRXdCLEdBQUU7Z0JBQU90QixLQUFJO2dCQUFVZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPbkQ7OztnQkFBSzdCLEtBQUk7Z0JBQVVnRixLQUFJLFNBQUFBO29CQUFXLE9BQU96Qjs7O2dCQUFLdkQsS0FBSTtnQkFBT2dGLEtBQUksU0FBQUE7b0JBQVcsT0FBTzNIOzs7Z0JBQUsyQyxLQUFJO2dCQUFXZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPeEU7OztnQkFBS1IsS0FBSTtnQkFBUWdGLEtBQUksU0FBQUE7b0JBQVcsT0FBT3FCOzs7Z0JBQUtyRyxLQUFJO2dCQUFZZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPOUM7OztnQkFBS2xDLEtBQUk7Z0JBQWNnRixLQUFJLFNBQUFBO29CQUFXLE9BQU9yQjs7a0JBQU1yQzs7UUFBSyxPQUFPNUMsRUFBRUMsR0FBR3RCLEtBQUcyVyxFQUFFblAsa0JBQWlCbkcsRUFBRUMsR0FBR3RCLEdBQUc0SCxjQUFZK08sR0FBRXRWLEVBQUVDLEdBQUd0QixHQUFHNkgsYUFBVztZQUFXLE9BQU94RyxFQUFFQyxHQUFHdEIsS0FBR2lFLEdBQUUwUyxFQUFFblA7V0FBa0JtUDtNQUFHeFY7S0FBUyxTQUFVeUI7UUFBRyxJQUFJTyxJQUFFLFdBQVUwQixJQUFFLGlCQUFnQlosSUFBRSxjQUFhRyxJQUFFLE1BQUlILEdBQUUrQixJQUFFcEQsRUFBRXRCLEdBQUc2QixJQUFHK0MsSUFBRXRELEVBQUVpSixXQUFVckgsRUFBRThOO1lBQVN3RCxXQUFVO1lBQVE3VSxTQUFRO1lBQVFtWSxTQUFRO1lBQUczRCxVQUFTO1lBQWlIblAsSUFBRTFELEVBQUVpSixXQUFVckgsRUFBRTJVO1lBQWFDLFNBQVE7WUFBOEIxUztZQUFHRixNQUFLO1lBQU9DLE1BQUs7V0FBUXNDO1lBQUdzUSxPQUFNO1lBQWlCQyxTQUFRO1dBQW9CdFE7WUFBRzRELE1BQUssU0FBT3hJO1lBQUV5SSxRQUFPLFdBQVN6STtZQUFFcUMsTUFBSyxTQUFPckM7WUFBRXVJLE9BQU0sVUFBUXZJO1lBQUVnUyxVQUFTLGFBQVdoUztZQUFFMkosT0FBTSxVQUFRM0o7WUFBRWdMLFNBQVEsWUFBVWhMO1lBQUVpUyxVQUFTLGFBQVdqUztZQUFFcUYsWUFBVyxlQUFhckY7WUFBRXNGLFlBQVcsZUFBYXRGO1dBQUdpRixJQUFFLFNBQVM3RTtZQUFHLFNBQVN3QjtnQkFBSSxPQUFPMUQsRUFBRWtCLE1BQUt3QyxJQUFHM0UsRUFBRW1DLE1BQUtnQixFQUFFYixNQUFNSCxNQUFLSTs7WUFBWSxPQUFPNUQsRUFBRWdHLEdBQUV4QixJQUFHd0IsRUFBRXBFLFVBQVVxVyxnQkFBYztnQkFBVyxPQUFPelUsS0FBS29WLGNBQVlwVixLQUFLK1Y7ZUFBZXZULEVBQUVwRSxVQUFVaVcsZ0JBQWM7Z0JBQVcsT0FBT3JVLEtBQUswVCxNQUFJMVQsS0FBSzBULE9BQUt0VSxFQUFFWSxLQUFLeVQsT0FBT3hCLFVBQVU7ZUFBSXpQLEVBQUVwRSxVQUFVd1csYUFBVztnQkFBVyxJQUFJL1csSUFBRXVCLEVBQUVZLEtBQUtxVTtnQkFBaUJyVSxLQUFLcVYsa0JBQWtCeFgsRUFBRS9CLEtBQUt5SixFQUFFc1EsUUFBTzdWLEtBQUtvVixhQUFZcFYsS0FBS3FWLGtCQUFrQnhYLEVBQUUvQixLQUFLeUosRUFBRXVRLFVBQVM5VixLQUFLK1Y7Z0JBQWVsWSxFQUFFakMsWUFBWXNILEVBQUVGLE9BQUssTUFBSUUsRUFBRUQsT0FBTWpELEtBQUt1VTtlQUFpQi9SLEVBQUVwRSxVQUFVMlgsY0FBWTtnQkFBVyxPQUFPL1YsS0FBS3ZFLFFBQVFzRyxhQUFhLG9CQUFrQixxQkFBbUIvQixLQUFLeVQsT0FBT21DLFVBQVE1VixLQUFLeVQsT0FBT21DLFFBQVF0VyxLQUFLVSxLQUFLdkUsV0FBU3VFLEtBQUt5VCxPQUFPbUM7ZUFBVXBULEVBQUV3QixtQkFBaUIsU0FBU25HO2dCQUFHLE9BQU9tQyxLQUFLaEUsS0FBSztvQkFBVyxJQUFJUSxJQUFFNEMsRUFBRVksTUFBTWlFLEtBQUt4RCxJQUFHM0IsSUFBRSxjQUFZLHNCQUFvQmpCLElBQUUsY0FBWTlCLEVBQUU4QixNQUFJQSxJQUFFO29CQUFLLEtBQUlyQixNQUFJLGVBQWV3RixLQUFLbkUsUUFBTXJCLE1BQUlBLElBQUUsSUFBSWdHLEVBQUV4QyxNQUFLbEIsSUFBR00sRUFBRVksTUFBTWlFLEtBQUt4RCxHQUFFakU7b0JBQUksbUJBQWlCcUIsSUFBRzt3QkFBQyxTQUFRLE1BQUlyQixFQUFFcUIsSUFBRyxNQUFNLElBQUlELE1BQU0sc0JBQW9CQyxJQUFFO3dCQUFLckIsRUFBRXFCOzs7ZUFBU29CLEVBQUV1RCxHQUFFO2dCQUFPckQsS0FBSTtnQkFBVWdGLEtBQUksU0FBQUE7b0JBQVcsT0FBTzlDOzs7Z0JBQUtsQyxLQUFJO2dCQUFVZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPekI7OztnQkFBS3ZELEtBQUk7Z0JBQU9nRixLQUFJLFNBQUFBO29CQUFXLE9BQU94RTs7O2dCQUFLUixLQUFJO2dCQUFXZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPMUQ7OztnQkFBS3RCLEtBQUk7Z0JBQVFnRixLQUFJLFNBQUFBO29CQUFXLE9BQU9xQjs7O2dCQUFLckcsS0FBSTtnQkFBWWdGLEtBQUksU0FBQUE7b0JBQVcsT0FBT3ZEOzs7Z0JBQUt6QixLQUFJO2dCQUFjZ0YsS0FBSSxTQUFBQTtvQkFBVyxPQUFPckI7O2tCQUFNTjtVQUFHeEI7UUFBRyxPQUFPNUIsRUFBRXRCLEdBQUc2QixLQUFHa0csRUFBRTdCLGtCQUFpQjVFLEVBQUV0QixHQUFHNkIsR0FBR3lFLGNBQVl5QixHQUFFekcsRUFBRXRCLEdBQUc2QixHQUFHMEUsYUFBVztZQUFXLE9BQU9qRixFQUFFdEIsR0FBRzZCLEtBQUc2QyxHQUFFcUQsRUFBRTdCO1dBQWtCNkI7T0FBSWxJOzs7OztBQ0RwL2IsU0FBU3FZLG1CQUFtQnZhO0lBQ3hCLElBQUl3YSxnQkFBZ0I3YSxFQUFFSyxTQUFTSSxTQUFTQSxTQUFTb04sU0FBUztJQUMxRGdOLGNBQWNyYSxZQUFZO0lBRTFCLElBQUlzYSxhQUFhOWEsRUFBRTZhLGVBQWUxTyxLQUFLO0lBQ3ZDMk8sV0FBV2phLFNBQVM7OztBQVF4QixTQUFTa2EsdUJBQXVCMWE7SUFDNUIsSUFBSXdhLGdCQUFnQjdhLEVBQUVLLFNBQVNJLFNBQVNBLFNBQVNvTixTQUFTO0lBQzFEZ04sY0FBY3JhLFlBQVk7SUFFMUIsSUFBSXdhLGFBQWFoYixFQUFFNmEsZUFBZXRPLEtBQUs7SUFDdkN5TyxXQUFXbmEsU0FBUzs7Ozs7QUNyQnhCYixFQUFFLGtCQUFrQjZZLE1BQU07SUFDeEI3WSxFQUFFLGtCQUFrQlEsWUFBWTtJQUNoQ1IsRUFBRTRFLE1BQU0vRCxTQUFTOzs7OztBQ0VuQixTQUFTb2EsY0FBYzVhLFNBQVMrQztJQUM1QixLQUFJcEQsRUFBRUssU0FBUzZhLE9BQ2Y7UUFDSWxiLEVBQUVLLFNBQVM2YSxJQUFJOVg7Ozs7QUFVdkIsU0FBUytYLFlBQVlDLFdBQVdDO0lBRTVCcmIsRUFBRW9iLFdBQVdFLFNBQVNEOzs7QUFJMUJyYixFQUFFLGFBQWE2WSxNQUFNO0lBRWpCLElBQUluSyxLQUFLMU8sRUFBRTRFLE1BQU1tSyxLQUFLO0lBR3RCL08sRUFBRSxNQUFNME8sSUFBSXBOLEtBQUssV0FBV3NELEtBQUtyRTs7O0FBTXJDLFNBQVNnYjtJQUVMdmIsRUFBRSw0QkFBNEJ5SjtJQUM5QnpKLEVBQUUsNEJBQTRCeUo7SUFDOUJ6SixFQUFFLHVCQUF1QnlKO0lBR3pCekosRUFBRSw4QkFBOEJzQixLQUFLLFlBQVksU0FBU1gsR0FBR3dLO1FBQUssUUFBUUE7Ozs7QUFNOUUsU0FBU3FRLGdCQUFnQm5iO0lBQ3JCTCxFQUFFSyxTQUFTSSxTQUFTb04sV0FBV3JOLFlBQVk7SUFDM0NSLEVBQUVLLFNBQVNRLFNBQVM7Ozs7O0FDbkR4QmIsRUFBRSxVQUFVeWIsT0FBTztJQUNmLElBQUl6YixFQUFFNEUsTUFBTXNXLFNBQVMsaUJBQWlCO1FBQ2xDbGIsRUFBRSxZQUFZa0IsTUFBTTs7Ozs7O0FDRjVCbEIsRUFBRSxjQUFjNlksTUFBTTtJQUNsQjdZLEVBQUU0RSxNQUFNaUYsWUFBWTtJQUNwQjdKLEVBQUUsbUJBQW1CNkosWUFBWTtJQUNqQzZSLFFBQVFDLElBQUk7Ozs7O0FDSGhCM2IsRUFBRWlGLFFBQVEyVyxPQUFPO0lBQ2IsSUFBSUEsU0FBUzViLEVBQUVpRixRQUFRc047SUFFdkIsSUFBSXFKLFVBQVUsSUFBSTtRQUNkNWIsRUFBRSxtQkFBbUJhLFNBQVM7UUFDOUJiLEVBQUUsZUFBZWEsU0FBUztRQUMxQmIsRUFBRSxRQUFRYSxTQUFTO1dBQ2hCO1FBQ0hiLEVBQUUsbUJBQW1CUSxZQUFZO1FBQ2pDUixFQUFFLGVBQWVRLFlBQVk7UUFDN0JSLEVBQUUsUUFBUVEsWUFBWTs7OztBQUk5QlIsRUFBRSxzQkFBc0I2WSxNQUFNO0lBQzFCN1ksRUFBRSxvQ0FBb0NFOzs7OztBQ0oxQyxTQUFTMmIsVUFBVXRHLEtBQUt1RyxLQUFLQyxNQUFNQyxlQUFldFM7SUFDbEQsSUFEeUR1UyxRQUN6RGpYLFVBQUEvRSxTQUFBLEtBQUErRSxVQUFBLE9BQUFrWCxZQUFBbFgsVUFBQSxLQURpRTtJQUVoRSxJQUFJbVgsU0FBUyxJQUFJQztRQUNoQnRDLFVBQVUsSUFBSXVDLE9BQU9DLEtBQUtDLE9BQU9ULEtBQUtDO1FBQ3RDeEcsS0FBS0E7UUFDTGlILE1BQU0saUJBQWlCOVMsT0FBTztRQUM5QitTLGdCQUFpQlIsVUFBVSxPQUFRLDhCQUE4QkEsUUFBUSxvQkFBb0I7O0lBRzlGLElBQUlTLGFBQWEsSUFBSUwsT0FBT0MsS0FBS0s7UUFDdEJuQyxTQUFTd0I7UUFDbEJZLFVBQVU7O0lBR1pULE9BQU9VLFlBQVksU0FBUztRQUMzQkgsV0FBV0ksS0FBS3ZILEtBQUs0Rzs7Ozs7O0FDeEJ2Qm5jLEVBQUUsMkJBQTJCNlksTUFBTTtJQUNsQzdZLEVBQUU0RSxNQUFNbkUsU0FBU29OLFNBQVMsUUFBUXJOLFlBQVksc0JBQXNCSyxTQUFTO0lBQzdFYixFQUFFNEUsTUFBTXBFLFlBQVksdUJBQXVCSyxTQUFTOzs7QUFRckQsSUFBSWtjLHlCQUF5Qi9jLEVBQUUsd0JBQXdCeWIsT0FDbkQ7SUFDSSxJQUFJemIsRUFBRSx3QkFBd0IyRSxHQUFHLGFBQWE7UUFDMUMzRSxFQUFFLHNCQUFzQlMsU0FBU29OLFNBQVMsUUFBUXJOLFlBQVkscUJBQXFCSyxTQUFTO1dBQ3pGO1FBQ0hiLEVBQUUsc0JBQXNCUyxTQUFTb04sU0FBUyxRQUFRck4sWUFBWSxlQUFlSyxTQUFTOzs7Ozs7QUNabEcsU0FBU21jLDJCQUEyQnhiO0lBQ2hDeEIsRUFBRXdCLE9BQU9mLFNBQVNBLFNBQVNDLEtBQUssYUFBYUYsWUFBWTtJQUN6RFIsRUFBRXdCLE9BQU9mLFNBQVNvSixZQUFZOzs7OztBQ1BsQyxTQUFTb1QsWUFBWTVjO0lBRWpCLElBQUtMLEVBQUdLLFNBQVVZLFNBQVUsV0FBYTtRQUNyQ2pCLEVBQUUsc0VBQXNFUSxZQUFZO1FBQ3BGUixFQUFFLHNCQUFzQmtkO1dBRzVCO1FBQ0lsZCxFQUFFLHNFQUFzRVEsWUFBWTtRQUNwRlIsRUFBRSxzQkFBc0JrZDtRQUd4QmxkLEVBQUVLLFNBQVNJLFNBQVNJLFNBQVM7UUFDN0JiLEVBQUVLLFNBQVN3SixZQUFZO1FBQ3ZCN0osRUFBRUssU0FBU0ksU0FBU0EsU0FBUzBMLEtBQUssc0JBQXNCZ1I7UUFDeERuZCxFQUFFSyxTQUFTSSxTQUFTQSxTQUFTb0osWUFBWTs7OztBQUlqRCxTQUFTdVQscUJBQXFCL2M7SUFDdEJMLEVBQUUsc0VBQXNFUSxZQUFZO0lBQ3BGUixFQUFFLHNCQUFzQmtkO0lBR3hCbGQsRUFBRUssU0FBU0ksU0FBU0EsU0FBUzBMLE9BQU9BLEtBQUssc0JBQXNCa1I7SUFDL0RyZCxFQUFFSyxTQUFTSSxTQUFTQSxTQUFTMEwsS0FBSyxxQkFBcUJ0TCxTQUFTO0lBQ2hFYixFQUFFSyxTQUFTSSxTQUFTQSxTQUFTMEwsT0FBT3pMLEtBQUssbURBQW1ERyxTQUFTOzs7QUFJN0diLEVBQUUsYUFBYW1CLEdBQUcscUJBQXFCLFNBQVNDO0lBQ3hDLEtBQUlwQixFQUFFb0IsRUFBRVUsUUFBUWIsU0FBUyw0QkFBMkI7UUFDaERqQixFQUFFNEUsTUFBTTJILE9BQU83TCxLQUFLLGtCQUFrQkYsWUFBWSxpQkFBaUJLLFNBQVM7UUFDNUViLEVBQUU0RSxNQUFNMkgsT0FBTzdMLEtBQUssYUFBYVA7UUFDakNILEVBQUU0RSxNQUFNMkgsT0FBTzdMLEtBQUssYUFBYVI7O0dBRXRDaUIsR0FBRyxzQkFBc0IsU0FBU0M7SUFDakMsS0FBSXBCLEVBQUVvQixFQUFFVSxRQUFRYixTQUFTLDRCQUEyQjtRQUNoRGpCLEVBQUU0RSxNQUFNMkgsT0FBTzdMLEtBQUssZ0JBQWdCRixZQUFZLGVBQWVLLFNBQVM7UUFDeEViLEVBQUU0RSxNQUFNMkgsT0FBTzdMLEtBQUssYUFBYVI7UUFDakNGLEVBQUU0RSxNQUFNMkgsT0FBTzdMLEtBQUssYUFBYVA7Ozs7Ozs7O0FDeEM3Q0gsRUFBRW1GLFVBQVUwVCxNQUFNLFNBQVN6WDtJQUN2QixJQUFJVSxTQUFTVixFQUFFVTtJQUVmLEtBQUs5QixFQUFFOEIsUUFBUTZDLEdBQUcsbUJBQW1CM0UsRUFBRThCLFFBQVFzVSxVQUFVelIsR0FBRyxnQkFBZ0I7UUFDeEUzRSxFQUFFLGlCQUFpQnNkOzs7O0FBSTNCdGQsRUFBRSxlQUFlNlksTUFBTTtJQUNyQjdZLEVBQUUsaUJBQWlCdWQ7OztBQUtyQnZkLEVBQUUsaUJBQWlCNlksTUFBTTtJQUN2QjdZLEVBQUU0RSxNQUFNaUYsWUFBWTtJQUNwQjdKLEVBQUUsc0JBQXNCbWQ7SUFDeEJuZCxFQUFFLGlCQUFpQjZKLFlBQVk7Ozs7O0NiaEJqQyxTQUFBN0osR0FBQWlGLFFBQVNuRixVQUFBQTtJQUVMO0dBS0lFLFFBQUVpRixRQUFBRSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gV2hlbiBhIHJlbW92ZSBmaWVsZCBpcyBjbGlja2VkXG5mdW5jdGlvbiBjb3VudHJ5X3JlbW92ZWQoKVxue1xuICAgIHZhciBjb3VudHJpZXMgPSAkKCcjY291bnRyaWVzX3BhcmVudCBzZWxlY3QnKTtcblxuICAgIGlmKGNvdW50cmllcy5sZW5ndGggPD0gMSlcbiAgICB7XG4gICAgICAgIC8vIGhpZGUgdGhlIHJlbW92ZSBsaW5rc1xuICAgICAgICAkKCcucmVtb3ZlX2ZpZWxkJykuaGlkZSgpO1xuICAgIH1lbHNle1xuICAgICAgICAkKCcucmVtb3ZlX2ZpZWxkJykuc2hvdygpO1xuICAgIH1cbn1cblxuLy8gR2VuZXJpYyBwcmVwYXJlZG5lc3MgYWN0aW9uIGl0ZW1cbmZ1bmN0aW9uIGdwYUFjdGlvbkNoYW5nZWQoIGVsZW1lbnQgKSB7XG4gICAgdmFyIGFkZEFjdGlvbkJ1dHRvbiA9ICQoXCIjYWRkLWFjdGlvbi1idG5cIik7XG4gICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuICAgICAgICAvLyBFbmFibGUgdGhlIGFkZCBhY3Rpb24gYnV0dG9uXG4gICAgICAgIGFkZEFjdGlvbkJ1dHRvbi5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gU2hvdyBkZXBhcnRtZW50IGRyb3Bkb3duXG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkuZmluZChcIi5ncGFfYWN0aW9uX2RlcGFydG1lbnRcIikuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhpZGUgZGVwYXJ0bWVudCBkcm9wZG93blxuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuZ3BhX2FjdGlvbl9kZXBhcnRtZW50XCIpLmhpZGUoKTtcblxuICAgICAgICAvLyBEaXNhYmxlIHRoZSBhZGQgYWN0aW9uIGJ1dHRvbiBpZiB0aGVyZSBhcmUgbm8gY2hlY2tlZCBhY3Rpb25zXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgJChcImlucHV0W25hbWU9Z3BhX2FjdGlvbl06Y2hlY2tlZFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGkgPCAxKSB7XG4gICAgICAgICAgICBhZGRBY3Rpb25CdXR0b24uYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qXG4qIFZlcmlmeSBpZiB0aGUgQWRkIGRlcGFydG1lbnQgb3B0aW9uIGlzIHNlbGVjdGVkIGFuZCBvcGVuIHRoZSBtb2RhbCB3aW5kb3dcbipcbiogQHBhcmFtIE9iamVjdCBzZWxlY3QgICAgICBUaGUgc2VsZWN0IE9iamVjdFxuKiBAcGFyYW0gc3RyaW5nIG1vZGFsX2lkICAgIFRoZSBtb2RhbCBpZCB0byBvcGVuXG4qL1xuZnVuY3Rpb24gYWRkRGVwYXJ0bWVudE1vZGFsKHNlbGVjdCwgbW9kYWxfaWQpe1xuICAgIGlmKCQoc2VsZWN0KS5maW5kKFwiOnNlbGVjdGVkXCIpLmhhc0NsYXNzKCdhZGQtZGVwYXJ0bWVudCcpKVxuICAgIHtcbiAgICAgICAgJChtb2RhbF9pZCkubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgJCgnI2FkZF9kZXBhcnRtZW50Jykub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKHNlbGVjdCkuZmluZChcIm9wdGlvblwiKS5maXJzdCgpLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgfVxufSIsImZ1bmN0aW9uIHJlYWRVUkwoaW5wdXQpIHtcbiAgaWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzWzBdKSB7XG4gICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIFxuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgJCgnLkFnZW5jeS1kZXRhaWxzX19sb2dvX19wcmV2aWV3JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZS50YXJnZXQucmVzdWx0ICsgJyknKTtcbiAgICAgICAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5hZGRDbGFzcygnU2VsZWN0ZWQnKVxuICAgICAgfVxuICAgICAgXG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbnB1dC5maWxlc1swXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJldmlld0xvZ28obG9nb0ltYWdlKXtcbiAgICByZWFkVVJMKGxvZ29JbWFnZSk7XG4gICAgJChcIiNzZWxlY3QtbG9nb1wiKS5oaWRlKCk7XG4gICAgJChcIiNyZXBsYWNlLWxvZ29cIikuc2hvdygpO1xuICAgICQoXCIjcmVtb3ZlLWxvZ29cIikuc2hvdygpO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyUHJldmlld0xvZ28oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgJChcIiNpbWdJbnBcIikudHJpZ2dlcignY2xpY2snKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTG9nb1ByZXZpZXcoZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoXCIjcmVwbGFjZS1sb2dvXCIpLmhpZGUoKTtcbiAgICAkKFwiI3JlbW92ZS1sb2dvXCIpLmhpZGUoKTtcbiAgICAkKFwiI3NlbGVjdC1sb2dvXCIpLnNob3coKTtcbiAgICAkKCcuQWdlbmN5LWRldGFpbHNfX2xvZ29fX3ByZXZpZXcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xuICAgICQoJy5BZ2VuY3ktZGV0YWlsc19fbG9nb19fcHJldmlldycpLnJlbW92ZUNsYXNzKCdTZWxlY3RlZCcpO1xufSIsIi8qIVxuICogQm9vdHN0cmFwIHY0LjAuMC1hbHBoYS42IChodHRwczovL2dldGJvb3RzdHJhcC5jb20pXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE3IFRoZSBCb290c3RyYXAgQXV0aG9ycyAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2dyYXBocy9jb250cmlidXRvcnMpXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICovXG5pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgalF1ZXJ5KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5LiBqUXVlcnkgbXVzdCBiZSBpbmNsdWRlZCBiZWZvcmUgQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdC5cIik7K2Z1bmN0aW9uKHQpe3ZhciBlPXQuZm4uanF1ZXJ5LnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi5cIik7aWYoZVswXTwyJiZlWzFdPDl8fDE9PWVbMF0mJjk9PWVbMV0mJmVbMl08MXx8ZVswXT49NCl0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGF0IGxlYXN0IGpRdWVyeSB2MS45LjEgYnV0IGxlc3MgdGhhbiB2NC4wLjBcIil9KGpRdWVyeSksK2Z1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2lmKCF0KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4hZXx8XCJvYmplY3RcIiE9dHlwZW9mIGUmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGU/dDplfWZ1bmN0aW9uIGUodCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZudWxsIT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIit0eXBlb2YgZSk7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmKE9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3Quc2V0UHJvdG90eXBlT2YodCxlKTp0Ll9fcHJvdG9fXz1lKX1mdW5jdGlvbiBuKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSxvPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCkscj1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQpe3JldHVybnt9LnRvU3RyaW5nLmNhbGwodCkubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBuKHQpe3JldHVybih0WzBdfHx0KS5ub2RlVHlwZX1mdW5jdGlvbiBpKCl7cmV0dXJue2JpbmRUeXBlOmEuZW5kLGRlbGVnYXRlVHlwZTphLmVuZCxoYW5kbGU6ZnVuY3Rpb24oZSl7aWYodChlLnRhcmdldCkuaXModGhpcykpcmV0dXJuIGUuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpfX19ZnVuY3Rpb24gbygpe2lmKHdpbmRvdy5RVW5pdClyZXR1cm4hMTt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9vdHN0cmFwXCIpO2Zvcih2YXIgZSBpbiBoKWlmKHZvaWQgMCE9PXQuc3R5bGVbZV0pcmV0dXJue2VuZDpoW2VdfTtyZXR1cm4hMX1mdW5jdGlvbiByKGUpe3ZhciBuPXRoaXMsaT0hMTtyZXR1cm4gdCh0aGlzKS5vbmUoYy5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbigpe2k9ITB9KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7aXx8Yy50cmlnZ2VyVHJhbnNpdGlvbkVuZChuKX0sZSksdGhpc31mdW5jdGlvbiBzKCl7YT1vKCksdC5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZD1yLGMuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJih0LmV2ZW50LnNwZWNpYWxbYy5UUkFOU0lUSU9OX0VORF09aSgpKX12YXIgYT0hMSxsPTFlNixoPXtXZWJraXRUcmFuc2l0aW9uOlwid2Via2l0VHJhbnNpdGlvbkVuZFwiLE1velRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCIsT1RyYW5zaXRpb246XCJvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZFwiLHRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCJ9LGM9e1RSQU5TSVRJT05fRU5EOlwiYnNUcmFuc2l0aW9uRW5kXCIsZ2V0VUlEOmZ1bmN0aW9uKHQpe2RvIHQrPX5+KE1hdGgucmFuZG9tKCkqbCk7d2hpbGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodCkpO3JldHVybiB0fSxnZXRTZWxlY3RvckZyb21FbGVtZW50OmZ1bmN0aW9uKHQpe3ZhciBlPXQuZ2V0QXR0cmlidXRlKFwiZGF0YS10YXJnZXRcIik7cmV0dXJuIGV8fChlPXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKXx8XCJcIixlPS9eI1thLXpdL2kudGVzdChlKT9lOm51bGwpLGV9LHJlZmxvdzpmdW5jdGlvbih0KXtyZXR1cm4gdC5vZmZzZXRIZWlnaHR9LHRyaWdnZXJUcmFuc2l0aW9uRW5kOmZ1bmN0aW9uKGUpe3QoZSkudHJpZ2dlcihhLmVuZCl9LHN1cHBvcnRzVHJhbnNpdGlvbkVuZDpmdW5jdGlvbigpe3JldHVybiBCb29sZWFuKGEpfSx0eXBlQ2hlY2tDb25maWc6ZnVuY3Rpb24odCxpLG8pe2Zvcih2YXIgciBpbiBvKWlmKG8uaGFzT3duUHJvcGVydHkocikpe3ZhciBzPW9bcl0sYT1pW3JdLGw9YSYmbihhKT9cImVsZW1lbnRcIjplKGEpO2lmKCFuZXcgUmVnRXhwKHMpLnRlc3QobCkpdGhyb3cgbmV3IEVycm9yKHQudG9VcHBlckNhc2UoKStcIjogXCIrKCdPcHRpb24gXCInK3IrJ1wiIHByb3ZpZGVkIHR5cGUgXCInK2wrJ1wiICcpKygnYnV0IGV4cGVjdGVkIHR5cGUgXCInK3MrJ1wiLicpKX19fTtyZXR1cm4gcygpLGN9KGpRdWVyeSkscz0oZnVuY3Rpb24odCl7dmFyIGU9XCJhbGVydFwiLGk9XCI0LjAuMC1hbHBoYS42XCIscz1cImJzLmFsZXJ0XCIsYT1cIi5cIitzLGw9XCIuZGF0YS1hcGlcIixoPXQuZm5bZV0sYz0xNTAsdT17RElTTUlTUzonW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJ30sZD17Q0xPU0U6XCJjbG9zZVwiK2EsQ0xPU0VEOlwiY2xvc2VkXCIrYSxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrYStsfSxmPXtBTEVSVDpcImFsZXJ0XCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxfPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10fXJldHVybiBlLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbih0KXt0PXR8fHRoaXMuX2VsZW1lbnQ7dmFyIGU9dGhpcy5fZ2V0Um9vdEVsZW1lbnQodCksbj10aGlzLl90cmlnZ2VyQ2xvc2VFdmVudChlKTtuLmlzRGVmYXVsdFByZXZlbnRlZCgpfHx0aGlzLl9yZW1vdmVFbGVtZW50KGUpfSxlLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQscyksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fZ2V0Um9vdEVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpLGk9ITE7cmV0dXJuIG4mJihpPXQobilbMF0pLGl8fChpPXQoZSkuY2xvc2VzdChcIi5cIitmLkFMRVJUKVswXSksaX0sZS5wcm90b3R5cGUuX3RyaWdnZXJDbG9zZUV2ZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXQuRXZlbnQoZC5DTE9TRSk7cmV0dXJuIHQoZSkudHJpZ2dlcihuKSxufSxlLnByb3RvdHlwZS5fcmVtb3ZlRWxlbWVudD1mdW5jdGlvbihlKXt2YXIgbj10aGlzO3JldHVybiB0KGUpLnJlbW92ZUNsYXNzKGYuU0hPVyksci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdChlKS5oYXNDbGFzcyhmLkZBREUpP3ZvaWQgdChlKS5vbmUoci5UUkFOU0lUSU9OX0VORCxmdW5jdGlvbih0KXtyZXR1cm4gbi5fZGVzdHJveUVsZW1lbnQoZSx0KX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMpOnZvaWQgdGhpcy5fZGVzdHJveUVsZW1lbnQoZSl9LGUucHJvdG90eXBlLl9kZXN0cm95RWxlbWVudD1mdW5jdGlvbihlKXt0KGUpLmRldGFjaCgpLnRyaWdnZXIoZC5DTE9TRUQpLnJlbW92ZSgpfSxlLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBpPXQodGhpcyksbz1pLmRhdGEocyk7b3x8KG89bmV3IGUodGhpcyksaS5kYXRhKHMsbykpLFwiY2xvc2VcIj09PW4mJm9bbl0odGhpcyl9KX0sZS5faGFuZGxlRGlzbWlzcz1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7ZSYmZS5wcmV2ZW50RGVmYXVsdCgpLHQuY2xvc2UodGhpcyl9fSxvKGUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaX19XSksZX0oKTtyZXR1cm4gdChkb2N1bWVudCkub24oZC5DTElDS19EQVRBX0FQSSx1LkRJU01JU1MsXy5faGFuZGxlRGlzbWlzcyhuZXcgXykpLHQuZm5bZV09Xy5falF1ZXJ5SW50ZXJmYWNlLHQuZm5bZV0uQ29uc3RydWN0b3I9Xyx0LmZuW2VdLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdC5mbltlXT1oLF8uX2pRdWVyeUludGVyZmFjZX0sX30oalF1ZXJ5KSxmdW5jdGlvbih0KXt2YXIgZT1cImJ1dHRvblwiLGk9XCI0LjAuMC1hbHBoYS42XCIscj1cImJzLmJ1dHRvblwiLHM9XCIuXCIrcixhPVwiLmRhdGEtYXBpXCIsbD10LmZuW2VdLGg9e0FDVElWRTpcImFjdGl2ZVwiLEJVVFRPTjpcImJ0blwiLEZPQ1VTOlwiZm9jdXNcIn0sYz17REFUQV9UT0dHTEVfQ0FSUk9UOidbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJyxEQVRBX1RPR0dMRTonW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScsSU5QVVQ6XCJpbnB1dFwiLEFDVElWRTpcIi5hY3RpdmVcIixCVVRUT046XCIuYnRuXCJ9LHU9e0NMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitzK2EsRk9DVVNfQkxVUl9EQVRBX0FQSTpcImZvY3VzXCIrcythK1wiIFwiKyhcImJsdXJcIitzK2EpfSxkPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10fXJldHVybiBlLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt2YXIgZT0hMCxuPXQodGhpcy5fZWxlbWVudCkuY2xvc2VzdChjLkRBVEFfVE9HR0xFKVswXTtpZihuKXt2YXIgaT10KHRoaXMuX2VsZW1lbnQpLmZpbmQoYy5JTlBVVClbMF07aWYoaSl7aWYoXCJyYWRpb1wiPT09aS50eXBlKWlmKGkuY2hlY2tlZCYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSkpZT0hMTtlbHNle3ZhciBvPXQobikuZmluZChjLkFDVElWRSlbMF07byYmdChvKS5yZW1vdmVDbGFzcyhoLkFDVElWRSl9ZSYmKGkuY2hlY2tlZD0hdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhoLkFDVElWRSksdChpKS50cmlnZ2VyKFwiY2hhbmdlXCIpKSxpLmZvY3VzKCl9fXRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1wcmVzc2VkXCIsIXQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoaC5BQ1RJVkUpKSxlJiZ0KHRoaXMuX2VsZW1lbnQpLnRvZ2dsZUNsYXNzKGguQUNUSVZFKX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LHIpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLmRhdGEocik7aXx8KGk9bmV3IGUodGhpcyksdCh0aGlzKS5kYXRhKHIsaSkpLFwidG9nZ2xlXCI9PT1uJiZpW25dKCl9KX0sbyhlLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGl9fV0pLGV9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKHUuQ0xJQ0tfREFUQV9BUEksYy5EQVRBX1RPR0dMRV9DQVJST1QsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO3ZhciBuPWUudGFyZ2V0O3QobikuaGFzQ2xhc3MoaC5CVVRUT04pfHwobj10KG4pLmNsb3Nlc3QoYy5CVVRUT04pKSxkLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KG4pLFwidG9nZ2xlXCIpfSkub24odS5GT0NVU19CTFVSX0RBVEFfQVBJLGMuREFUQV9UT0dHTEVfQ0FSUk9ULGZ1bmN0aW9uKGUpe3ZhciBuPXQoZS50YXJnZXQpLmNsb3Nlc3QoYy5CVVRUT04pWzBdO3QobikudG9nZ2xlQ2xhc3MoaC5GT0NVUywvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpfSksdC5mbltlXT1kLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1kLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWwsZC5falF1ZXJ5SW50ZXJmYWNlfSxkfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiY2Fyb3VzZWxcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5jYXJvdXNlbFwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9NjAwLGQ9MzcsZj0zOSxfPXtpbnRlcnZhbDo1ZTMsa2V5Ym9hcmQ6ITAsc2xpZGU6ITEscGF1c2U6XCJob3ZlclwiLHdyYXA6ITB9LGc9e2ludGVydmFsOlwiKG51bWJlcnxib29sZWFuKVwiLGtleWJvYXJkOlwiYm9vbGVhblwiLHNsaWRlOlwiKGJvb2xlYW58c3RyaW5nKVwiLHBhdXNlOlwiKHN0cmluZ3xib29sZWFuKVwiLHdyYXA6XCJib29sZWFuXCJ9LHA9e05FWFQ6XCJuZXh0XCIsUFJFVjpcInByZXZcIixMRUZUOlwibGVmdFwiLFJJR0hUOlwicmlnaHRcIn0sbT17U0xJREU6XCJzbGlkZVwiK2wsU0xJRDpcInNsaWRcIitsLEtFWURPV046XCJrZXlkb3duXCIrbCxNT1VTRUVOVEVSOlwibW91c2VlbnRlclwiK2wsTU9VU0VMRUFWRTpcIm1vdXNlbGVhdmVcIitsLExPQURfREFUQV9BUEk6XCJsb2FkXCIrbCtoLENMSUNLX0RBVEFfQVBJOlwiY2xpY2tcIitsK2h9LEU9e0NBUk9VU0VMOlwiY2Fyb3VzZWxcIixBQ1RJVkU6XCJhY3RpdmVcIixTTElERTpcInNsaWRlXCIsUklHSFQ6XCJjYXJvdXNlbC1pdGVtLXJpZ2h0XCIsTEVGVDpcImNhcm91c2VsLWl0ZW0tbGVmdFwiLE5FWFQ6XCJjYXJvdXNlbC1pdGVtLW5leHRcIixQUkVWOlwiY2Fyb3VzZWwtaXRlbS1wcmV2XCIsSVRFTTpcImNhcm91c2VsLWl0ZW1cIn0sdj17QUNUSVZFOlwiLmFjdGl2ZVwiLEFDVElWRV9JVEVNOlwiLmFjdGl2ZS5jYXJvdXNlbC1pdGVtXCIsSVRFTTpcIi5jYXJvdXNlbC1pdGVtXCIsTkVYVF9QUkVWOlwiLmNhcm91c2VsLWl0ZW0tbmV4dCwgLmNhcm91c2VsLWl0ZW0tcHJldlwiLElORElDQVRPUlM6XCIuY2Fyb3VzZWwtaW5kaWNhdG9yc1wiLERBVEFfU0xJREU6XCJbZGF0YS1zbGlkZV0sIFtkYXRhLXNsaWRlLXRvXVwiLERBVEFfUklERTonW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJ30sVD1mdW5jdGlvbigpe2Z1bmN0aW9uIGgoZSxpKXtuKHRoaXMsaCksdGhpcy5faXRlbXM9bnVsbCx0aGlzLl9pbnRlcnZhbD1udWxsLHRoaXMuX2FjdGl2ZUVsZW1lbnQ9bnVsbCx0aGlzLl9pc1BhdXNlZD0hMSx0aGlzLl9pc1NsaWRpbmc9ITEsdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9lbGVtZW50PXQoZSlbMF0sdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQ9dCh0aGlzLl9lbGVtZW50KS5maW5kKHYuSU5ESUNBVE9SUylbMF0sdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKX1yZXR1cm4gaC5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe2lmKHRoaXMuX2lzU2xpZGluZyl0aHJvdyBuZXcgRXJyb3IoXCJDYXJvdXNlbCBpcyBzbGlkaW5nXCIpO3RoaXMuX3NsaWRlKHAuTkVYVCl9LGgucHJvdG90eXBlLm5leHRXaGVuVmlzaWJsZT1mdW5jdGlvbigpe2RvY3VtZW50LmhpZGRlbnx8dGhpcy5uZXh0KCl9LGgucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXtpZih0aGlzLl9pc1NsaWRpbmcpdGhyb3cgbmV3IEVycm9yKFwiQ2Fyb3VzZWwgaXMgc2xpZGluZ1wiKTt0aGlzLl9zbGlkZShwLlBSRVZJT1VTKX0saC5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oZSl7ZXx8KHRoaXMuX2lzUGF1c2VkPSEwKSx0KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5ORVhUX1BSRVYpWzBdJiZyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiYoci50cmlnZ2VyVHJhbnNpdGlvbkVuZCh0aGlzLl9lbGVtZW50KSx0aGlzLmN5Y2xlKCEwKSksY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCksdGhpcy5faW50ZXJ2YWw9bnVsbH0saC5wcm90b3R5cGUuY3ljbGU9ZnVuY3Rpb24odCl7dHx8KHRoaXMuX2lzUGF1c2VkPSExKSx0aGlzLl9pbnRlcnZhbCYmKGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpLHRoaXMuX2ludGVydmFsPW51bGwpLHRoaXMuX2NvbmZpZy5pbnRlcnZhbCYmIXRoaXMuX2lzUGF1c2VkJiYodGhpcy5faW50ZXJ2YWw9c2V0SW50ZXJ2YWwoKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZT90aGlzLm5leHRXaGVuVmlzaWJsZTp0aGlzLm5leHQpLmJpbmQodGhpcyksdGhpcy5fY29uZmlnLmludGVydmFsKSl9LGgucHJvdG90eXBlLnRvPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7dGhpcy5fYWN0aXZlRWxlbWVudD10KHRoaXMuX2VsZW1lbnQpLmZpbmQodi5BQ1RJVkVfSVRFTSlbMF07dmFyIGk9dGhpcy5fZ2V0SXRlbUluZGV4KHRoaXMuX2FjdGl2ZUVsZW1lbnQpO2lmKCEoZT50aGlzLl9pdGVtcy5sZW5ndGgtMXx8ZTwwKSl7aWYodGhpcy5faXNTbGlkaW5nKXJldHVybiB2b2lkIHQodGhpcy5fZWxlbWVudCkub25lKG0uU0xJRCxmdW5jdGlvbigpe3JldHVybiBuLnRvKGUpfSk7aWYoaT09PWUpcmV0dXJuIHRoaXMucGF1c2UoKSx2b2lkIHRoaXMuY3ljbGUoKTt2YXIgbz1lPmk/cC5ORVhUOnAuUFJFVklPVVM7dGhpcy5fc2xpZGUobyx0aGlzLl9pdGVtc1tlXSl9fSxoLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dCh0aGlzLl9lbGVtZW50KS5vZmYobCksdC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsYSksdGhpcy5faXRlbXM9bnVsbCx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5faW50ZXJ2YWw9bnVsbCx0aGlzLl9pc1BhdXNlZD1udWxsLHRoaXMuX2lzU2xpZGluZz1udWxsLHRoaXMuX2FjdGl2ZUVsZW1lbnQ9bnVsbCx0aGlzLl9pbmRpY2F0b3JzRWxlbWVudD1udWxsfSxoLnByb3RvdHlwZS5fZ2V0Q29uZmlnPWZ1bmN0aW9uKG4pe3JldHVybiBuPXQuZXh0ZW5kKHt9LF8sbiksci50eXBlQ2hlY2tDb25maWcoZSxuLGcpLG59LGgucHJvdG90eXBlLl9hZGRFdmVudExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5fY29uZmlnLmtleWJvYXJkJiZ0KHRoaXMuX2VsZW1lbnQpLm9uKG0uS0VZRE9XTixmdW5jdGlvbih0KXtyZXR1cm4gZS5fa2V5ZG93bih0KX0pLFwiaG92ZXJcIiE9PXRoaXMuX2NvbmZpZy5wYXVzZXx8XCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudHx8dCh0aGlzLl9lbGVtZW50KS5vbihtLk1PVVNFRU5URVIsZnVuY3Rpb24odCl7cmV0dXJuIGUucGF1c2UodCl9KS5vbihtLk1PVVNFTEVBVkUsZnVuY3Rpb24odCl7cmV0dXJuIGUuY3ljbGUodCl9KX0saC5wcm90b3R5cGUuX2tleWRvd249ZnVuY3Rpb24odCl7aWYoIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QodC50YXJnZXQudGFnTmFtZSkpc3dpdGNoKHQud2hpY2gpe2Nhc2UgZDp0LnByZXZlbnREZWZhdWx0KCksdGhpcy5wcmV2KCk7YnJlYWs7Y2FzZSBmOnQucHJldmVudERlZmF1bHQoKSx0aGlzLm5leHQoKTticmVhaztkZWZhdWx0OnJldHVybn19LGgucHJvdG90eXBlLl9nZXRJdGVtSW5kZXg9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX2l0ZW1zPXQubWFrZUFycmF5KHQoZSkucGFyZW50KCkuZmluZCh2LklURU0pKSx0aGlzLl9pdGVtcy5pbmRleE9mKGUpfSxoLnByb3RvdHlwZS5fZ2V0SXRlbUJ5RGlyZWN0aW9uPWZ1bmN0aW9uKHQsZSl7dmFyIG49dD09PXAuTkVYVCxpPXQ9PT1wLlBSRVZJT1VTLG89dGhpcy5fZ2V0SXRlbUluZGV4KGUpLHI9dGhpcy5faXRlbXMubGVuZ3RoLTEscz1pJiYwPT09b3x8biYmbz09PXI7aWYocyYmIXRoaXMuX2NvbmZpZy53cmFwKXJldHVybiBlO3ZhciBhPXQ9PT1wLlBSRVZJT1VTPy0xOjEsbD0obythKSV0aGlzLl9pdGVtcy5sZW5ndGg7cmV0dXJuIGw9PT0tMT90aGlzLl9pdGVtc1t0aGlzLl9pdGVtcy5sZW5ndGgtMV06dGhpcy5faXRlbXNbbF19LGgucHJvdG90eXBlLl90cmlnZ2VyU2xpZGVFdmVudD1mdW5jdGlvbihlLG4pe3ZhciBpPXQuRXZlbnQobS5TTElERSx7cmVsYXRlZFRhcmdldDplLGRpcmVjdGlvbjpufSk7cmV0dXJuIHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihpKSxpfSxoLnByb3RvdHlwZS5fc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudD1mdW5jdGlvbihlKXtpZih0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCl7dCh0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCkuZmluZCh2LkFDVElWRSkucmVtb3ZlQ2xhc3MoRS5BQ1RJVkUpO3ZhciBuPXRoaXMuX2luZGljYXRvcnNFbGVtZW50LmNoaWxkcmVuW3RoaXMuX2dldEl0ZW1JbmRleChlKV07biYmdChuKS5hZGRDbGFzcyhFLkFDVElWRSl9fSxoLnByb3RvdHlwZS5fc2xpZGU9ZnVuY3Rpb24oZSxuKXt2YXIgaT10aGlzLG89dCh0aGlzLl9lbGVtZW50KS5maW5kKHYuQUNUSVZFX0lURU0pWzBdLHM9bnx8byYmdGhpcy5fZ2V0SXRlbUJ5RGlyZWN0aW9uKGUsbyksYT1Cb29sZWFuKHRoaXMuX2ludGVydmFsKSxsPXZvaWQgMCxoPXZvaWQgMCxjPXZvaWQgMDtpZihlPT09cC5ORVhUPyhsPUUuTEVGVCxoPUUuTkVYVCxjPXAuTEVGVCk6KGw9RS5SSUdIVCxoPUUuUFJFVixjPXAuUklHSFQpLHMmJnQocykuaGFzQ2xhc3MoRS5BQ1RJVkUpKXJldHVybiB2b2lkKHRoaXMuX2lzU2xpZGluZz0hMSk7dmFyIGQ9dGhpcy5fdHJpZ2dlclNsaWRlRXZlbnQocyxjKTtpZighZC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmbyYmcyl7dGhpcy5faXNTbGlkaW5nPSEwLGEmJnRoaXMucGF1c2UoKSx0aGlzLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50KHMpO3ZhciBmPXQuRXZlbnQobS5TTElELHtyZWxhdGVkVGFyZ2V0OnMsZGlyZWN0aW9uOmN9KTtyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKEUuU0xJREUpPyh0KHMpLmFkZENsYXNzKGgpLHIucmVmbG93KHMpLHQobykuYWRkQ2xhc3MobCksdChzKS5hZGRDbGFzcyhsKSx0KG8pLm9uZShyLlRSQU5TSVRJT05fRU5ELGZ1bmN0aW9uKCl7dChzKS5yZW1vdmVDbGFzcyhsK1wiIFwiK2gpLmFkZENsYXNzKEUuQUNUSVZFKSx0KG8pLnJlbW92ZUNsYXNzKEUuQUNUSVZFK1wiIFwiK2grXCIgXCIrbCksaS5faXNTbGlkaW5nPSExLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtyZXR1cm4gdChpLl9lbGVtZW50KS50cmlnZ2VyKGYpfSwwKX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpKToodChvKS5yZW1vdmVDbGFzcyhFLkFDVElWRSksdChzKS5hZGRDbGFzcyhFLkFDVElWRSksdGhpcy5faXNTbGlkaW5nPSExLHQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihmKSksYSYmdGhpcy5jeWNsZSgpfX0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLmRhdGEoYSksbz10LmV4dGVuZCh7fSxfLHQodGhpcykuZGF0YSgpKTtcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJnQuZXh0ZW5kKG8sZSk7dmFyIHI9XCJzdHJpbmdcIj09dHlwZW9mIGU/ZTpvLnNsaWRlO2lmKG58fChuPW5ldyBoKHRoaXMsbyksdCh0aGlzKS5kYXRhKGEsbikpLFwibnVtYmVyXCI9PXR5cGVvZiBlKW4udG8oZSk7ZWxzZSBpZihcInN0cmluZ1wiPT10eXBlb2Ygcil7aWYodm9pZCAwPT09bltyXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrcisnXCInKTtuW3JdKCl9ZWxzZSBvLmludGVydmFsJiYobi5wYXVzZSgpLG4uY3ljbGUoKSl9KX0saC5fZGF0YUFwaUNsaWNrSGFuZGxlcj1mdW5jdGlvbihlKXt2YXIgbj1yLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7aWYobil7dmFyIGk9dChuKVswXTtpZihpJiZ0KGkpLmhhc0NsYXNzKEUuQ0FST1VTRUwpKXt2YXIgbz10LmV4dGVuZCh7fSx0KGkpLmRhdGEoKSx0KHRoaXMpLmRhdGEoKSkscz10aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtc2xpZGUtdG9cIik7cyYmKG8uaW50ZXJ2YWw9ITEpLGguX2pRdWVyeUludGVyZmFjZS5jYWxsKHQoaSksbykscyYmdChpKS5kYXRhKGEpLnRvKHMpLGUucHJldmVudERlZmF1bHQoKX19fSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIF99fV0pLGh9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKG0uQ0xJQ0tfREFUQV9BUEksdi5EQVRBX1NMSURFLFQuX2RhdGFBcGlDbGlja0hhbmRsZXIpLHQod2luZG93KS5vbihtLkxPQURfREFUQV9BUEksZnVuY3Rpb24oKXt0KHYuREFUQV9SSURFKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzKTtULl9qUXVlcnlJbnRlcmZhY2UuY2FsbChlLGUuZGF0YSgpKX0pfSksdC5mbltlXT1ULl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1ULHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsVC5falF1ZXJ5SW50ZXJmYWNlfSxUfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiY29sbGFwc2VcIixzPVwiNC4wLjAtYWxwaGEuNlwiLGE9XCJicy5jb2xsYXBzZVwiLGw9XCIuXCIrYSxoPVwiLmRhdGEtYXBpXCIsYz10LmZuW2VdLHU9NjAwLGQ9e3RvZ2dsZTohMCxwYXJlbnQ6XCJcIn0sZj17dG9nZ2xlOlwiYm9vbGVhblwiLHBhcmVudDpcInN0cmluZ1wifSxfPXtTSE9XOlwic2hvd1wiK2wsU0hPV046XCJzaG93blwiK2wsSElERTpcImhpZGVcIitsLEhJRERFTjpcImhpZGRlblwiK2wsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2wraH0sZz17U0hPVzpcInNob3dcIixDT0xMQVBTRTpcImNvbGxhcHNlXCIsQ09MTEFQU0lORzpcImNvbGxhcHNpbmdcIixDT0xMQVBTRUQ6XCJjb2xsYXBzZWRcIn0scD17V0lEVEg6XCJ3aWR0aFwiLEhFSUdIVDpcImhlaWdodFwifSxtPXtBQ1RJVkVTOlwiLmNhcmQgPiAuc2hvdywgLmNhcmQgPiAuY29sbGFwc2luZ1wiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXSd9LEU9ZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGUsaSl7bih0aGlzLGwpLHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl9lbGVtZW50PWUsdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl90cmlnZ2VyQXJyYXk9dC5tYWtlQXJyYXkodCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMnK2UuaWQrJ1wiXSwnKygnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS10YXJnZXQ9XCIjJytlLmlkKydcIl0nKSkpLHRoaXMuX3BhcmVudD10aGlzLl9jb25maWcucGFyZW50P3RoaXMuX2dldFBhcmVudCgpOm51bGwsdGhpcy5fY29uZmlnLnBhcmVudHx8dGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuX2VsZW1lbnQsdGhpcy5fdHJpZ2dlckFycmF5KSx0aGlzLl9jb25maWcudG9nZ2xlJiZ0aGlzLnRvZ2dsZSgpfXJldHVybiBsLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGcuU0hPVyk/dGhpcy5oaWRlKCk6dGhpcy5zaG93KCl9LGwucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJDb2xsYXBzZSBpcyB0cmFuc2l0aW9uaW5nXCIpO2lmKCF0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGcuU0hPVykpe3ZhciBuPXZvaWQgMCxpPXZvaWQgMDtpZih0aGlzLl9wYXJlbnQmJihuPXQubWFrZUFycmF5KHQodGhpcy5fcGFyZW50KS5maW5kKG0uQUNUSVZFUykpLG4ubGVuZ3RofHwobj1udWxsKSksIShuJiYoaT10KG4pLmRhdGEoYSksaSYmaS5faXNUcmFuc2l0aW9uaW5nKSkpe3ZhciBvPXQuRXZlbnQoXy5TSE9XKTtpZih0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobyksIW8uaXNEZWZhdWx0UHJldmVudGVkKCkpe24mJihsLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KG4pLFwiaGlkZVwiKSxpfHx0KG4pLmRhdGEoYSxudWxsKSk7dmFyIHM9dGhpcy5fZ2V0RGltZW5zaW9uKCk7dCh0aGlzLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNFKS5hZGRDbGFzcyhnLkNPTExBUFNJTkcpLHRoaXMuX2VsZW1lbnQuc3R5bGVbc109MCx0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksdGhpcy5fdHJpZ2dlckFycmF5Lmxlbmd0aCYmdCh0aGlzLl90cmlnZ2VyQXJyYXkpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0VEKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLnNldFRyYW5zaXRpb25pbmcoITApO3ZhciBoPWZ1bmN0aW9uKCl7dChlLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhnLkNPTExBUFNJTkcpLmFkZENsYXNzKGcuQ09MTEFQU0UpLmFkZENsYXNzKGcuU0hPVyksZS5fZWxlbWVudC5zdHlsZVtzXT1cIlwiLGUuc2V0VHJhbnNpdGlvbmluZyghMSksdChlLl9lbGVtZW50KS50cmlnZ2VyKF8uU0hPV04pfTtpZighci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSlyZXR1cm4gdm9pZCBoKCk7dmFyIGM9c1swXS50b1VwcGVyQ2FzZSgpK3Muc2xpY2UoMSksZD1cInNjcm9sbFwiK2M7dCh0aGlzLl9lbGVtZW50KS5vbmUoci5UUkFOU0lUSU9OX0VORCxoKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KSx0aGlzLl9lbGVtZW50LnN0eWxlW3NdPXRoaXMuX2VsZW1lbnRbZF0rXCJweFwifX19fSxsLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZih0aGlzLl9pc1RyYW5zaXRpb25pbmcpdGhyb3cgbmV3IEVycm9yKFwiQ29sbGFwc2UgaXMgdHJhbnNpdGlvbmluZ1wiKTtpZih0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGcuU0hPVykpe3ZhciBuPXQuRXZlbnQoXy5ISURFKTtpZih0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobiksIW4uaXNEZWZhdWx0UHJldmVudGVkKCkpe3ZhciBpPXRoaXMuX2dldERpbWVuc2lvbigpLG89aT09PXAuV0lEVEg/XCJvZmZzZXRXaWR0aFwiOlwib2Zmc2V0SGVpZ2h0XCI7dGhpcy5fZWxlbWVudC5zdHlsZVtpXT10aGlzLl9lbGVtZW50W29dK1wicHhcIixyLnJlZmxvdyh0aGlzLl9lbGVtZW50KSx0KHRoaXMuX2VsZW1lbnQpLmFkZENsYXNzKGcuQ09MTEFQU0lORykucmVtb3ZlQ2xhc3MoZy5DT0xMQVBTRSkucmVtb3ZlQ2xhc3MoZy5TSE9XKSx0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMSksdGhpcy5fdHJpZ2dlckFycmF5Lmxlbmd0aCYmdCh0aGlzLl90cmlnZ2VyQXJyYXkpLmFkZENsYXNzKGcuQ09MTEFQU0VEKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLnNldFRyYW5zaXRpb25pbmcoITApO3ZhciBzPWZ1bmN0aW9uKCl7ZS5zZXRUcmFuc2l0aW9uaW5nKCExKSx0KGUuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKGcuQ09MTEFQU0lORykuYWRkQ2xhc3MoZy5DT0xMQVBTRSkudHJpZ2dlcihfLkhJRERFTil9O3JldHVybiB0aGlzLl9lbGVtZW50LnN0eWxlW2ldPVwiXCIsci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKT92b2lkIHQodGhpcy5fZWxlbWVudCkub25lKHIuVFJBTlNJVElPTl9FTkQscykuZW11bGF0ZVRyYW5zaXRpb25FbmQodSk6dm9pZCBzKCl9fX0sbC5wcm90b3R5cGUuc2V0VHJhbnNpdGlvbmluZz1mdW5jdGlvbih0KXt0aGlzLl9pc1RyYW5zaXRpb25pbmc9dH0sbC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX3BhcmVudD1udWxsLHRoaXMuX2VsZW1lbnQ9bnVsbCx0aGlzLl90cmlnZ2VyQXJyYXk9bnVsbCx0aGlzLl9pc1RyYW5zaXRpb25pbmc9bnVsbH0sbC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSxkLG4pLG4udG9nZ2xlPUJvb2xlYW4obi50b2dnbGUpLHIudHlwZUNoZWNrQ29uZmlnKGUsbixmKSxufSxsLnByb3RvdHlwZS5fZ2V0RGltZW5zaW9uPWZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhwLldJRFRIKTtyZXR1cm4gZT9wLldJRFRIOnAuSEVJR0hUfSxsLnByb3RvdHlwZS5fZ2V0UGFyZW50PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxuPXQodGhpcy5fY29uZmlnLnBhcmVudClbMF0saT0nW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInK3RoaXMuX2NvbmZpZy5wYXJlbnQrJ1wiXSc7cmV0dXJuIHQobikuZmluZChpKS5lYWNoKGZ1bmN0aW9uKHQsbil7ZS5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGwuX2dldFRhcmdldEZyb21FbGVtZW50KG4pLFtuXSl9KSxufSxsLnByb3RvdHlwZS5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzPWZ1bmN0aW9uKGUsbil7aWYoZSl7dmFyIGk9dChlKS5oYXNDbGFzcyhnLlNIT1cpO2Uuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLGkpLG4ubGVuZ3RoJiZ0KG4pLnRvZ2dsZUNsYXNzKGcuQ09MTEFQU0VELCFpKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLGkpfX0sbC5fZ2V0VGFyZ2V0RnJvbUVsZW1lbnQ9ZnVuY3Rpb24oZSl7dmFyIG49ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBuP3QobilbMF06bnVsbH0sbC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgbj10KHRoaXMpLG89bi5kYXRhKGEpLHI9dC5leHRlbmQoe30sZCxuLmRhdGEoKSxcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmUpO2lmKCFvJiZyLnRvZ2dsZSYmL3Nob3d8aGlkZS8udGVzdChlKSYmKHIudG9nZ2xlPSExKSxvfHwobz1uZXcgbCh0aGlzLHIpLG4uZGF0YShhLG8pKSxcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYodm9pZCAwPT09b1tlXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrZSsnXCInKTtvW2VdKCl9fSl9LG8obCxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzfX0se2tleTpcIkRlZmF1bHRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZH19XSksbH0oKTtyZXR1cm4gdChkb2N1bWVudCkub24oXy5DTElDS19EQVRBX0FQSSxtLkRBVEFfVE9HR0xFLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt2YXIgbj1FLl9nZXRUYXJnZXRGcm9tRWxlbWVudCh0aGlzKSxpPXQobikuZGF0YShhKSxvPWk/XCJ0b2dnbGVcIjp0KHRoaXMpLmRhdGEoKTtFLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCh0KG4pLG8pfSksdC5mbltlXT1FLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1FLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsRS5falF1ZXJ5SW50ZXJmYWNlfSxFfShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiZHJvcGRvd25cIixpPVwiNC4wLjAtYWxwaGEuNlwiLHM9XCJicy5kcm9wZG93blwiLGE9XCIuXCIrcyxsPVwiLmRhdGEtYXBpXCIsaD10LmZuW2VdLGM9MjcsdT0zOCxkPTQwLGY9MyxfPXtISURFOlwiaGlkZVwiK2EsSElEREVOOlwiaGlkZGVuXCIrYSxTSE9XOlwic2hvd1wiK2EsU0hPV046XCJzaG93blwiK2EsQ0xJQ0s6XCJjbGlja1wiK2EsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2ErbCxGT0NVU0lOX0RBVEFfQVBJOlwiZm9jdXNpblwiK2ErbCxLRVlET1dOX0RBVEFfQVBJOlwia2V5ZG93blwiK2ErbH0sZz17QkFDS0RST1A6XCJkcm9wZG93bi1iYWNrZHJvcFwiLERJU0FCTEVEOlwiZGlzYWJsZWRcIixTSE9XOlwic2hvd1wifSxwPXtCQUNLRFJPUDpcIi5kcm9wZG93bi1iYWNrZHJvcFwiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsRk9STV9DSElMRDpcIi5kcm9wZG93biBmb3JtXCIsUk9MRV9NRU5VOidbcm9sZT1cIm1lbnVcIl0nLFJPTEVfTElTVEJPWDonW3JvbGU9XCJsaXN0Ym94XCJdJyxOQVZCQVJfTkFWOlwiLm5hdmJhci1uYXZcIixWSVNJQkxFX0lURU1TOidbcm9sZT1cIm1lbnVcIl0gbGk6bm90KC5kaXNhYmxlZCkgYSwgW3JvbGU9XCJsaXN0Ym94XCJdIGxpOm5vdCguZGlzYWJsZWQpIGEnfSxtPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtuKHRoaXMsZSksdGhpcy5fZWxlbWVudD10LHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCl9cmV0dXJuIGUucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe2lmKHRoaXMuZGlzYWJsZWR8fHQodGhpcykuaGFzQ2xhc3MoZy5ESVNBQkxFRCkpcmV0dXJuITE7dmFyIG49ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQodGhpcyksaT10KG4pLmhhc0NsYXNzKGcuU0hPVyk7aWYoZS5fY2xlYXJNZW51cygpLGkpcmV0dXJuITE7aWYoXCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCYmIXQobikuY2xvc2VzdChwLk5BVkJBUl9OQVYpLmxlbmd0aCl7dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtvLmNsYXNzTmFtZT1nLkJBQ0tEUk9QLHQobykuaW5zZXJ0QmVmb3JlKHRoaXMpLHQobykub24oXCJjbGlja1wiLGUuX2NsZWFyTWVudXMpfXZhciByPXtyZWxhdGVkVGFyZ2V0OnRoaXN9LHM9dC5FdmVudChfLlNIT1cscik7cmV0dXJuIHQobikudHJpZ2dlcihzKSwhcy5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmKHRoaXMuZm9jdXMoKSx0aGlzLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwhMCksdChuKS50b2dnbGVDbGFzcyhnLlNIT1cpLHQobikudHJpZ2dlcih0LkV2ZW50KF8uU0hPV04scikpLCExKX0sZS5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LHMpLHQodGhpcy5fZWxlbWVudCkub2ZmKGEpLHRoaXMuX2VsZW1lbnQ9bnVsbH0sZS5wcm90b3R5cGUuX2FkZEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dCh0aGlzLl9lbGVtZW50KS5vbihfLkNMSUNLLHRoaXMudG9nZ2xlKX0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLmRhdGEocyk7aWYoaXx8KGk9bmV3IGUodGhpcyksdCh0aGlzKS5kYXRhKHMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBuKXtpZih2b2lkIDA9PT1pW25dKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytuKydcIicpO2lbbl0uY2FsbCh0aGlzKX19KX0sZS5fY2xlYXJNZW51cz1mdW5jdGlvbihuKXtpZighbnx8bi53aGljaCE9PWYpe3ZhciBpPXQocC5CQUNLRFJPUClbMF07aSYmaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGkpO2Zvcih2YXIgbz10Lm1ha2VBcnJheSh0KHAuREFUQV9UT0dHTEUpKSxyPTA7cjxvLmxlbmd0aDtyKyspe3ZhciBzPWUuX2dldFBhcmVudEZyb21FbGVtZW50KG9bcl0pLGE9e3JlbGF0ZWRUYXJnZXQ6b1tyXX07aWYodChzKS5oYXNDbGFzcyhnLlNIT1cpJiYhKG4mJihcImNsaWNrXCI9PT1uLnR5cGUmJi9pbnB1dHx0ZXh0YXJlYS9pLnRlc3Qobi50YXJnZXQudGFnTmFtZSl8fFwiZm9jdXNpblwiPT09bi50eXBlKSYmdC5jb250YWlucyhzLG4udGFyZ2V0KSkpe3ZhciBsPXQuRXZlbnQoXy5ISURFLGEpO3QocykudHJpZ2dlcihsKSxsLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwob1tyXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsXCJmYWxzZVwiKSx0KHMpLnJlbW92ZUNsYXNzKGcuU0hPVykudHJpZ2dlcih0LkV2ZW50KF8uSElEREVOLGEpKSl9fX19LGUuX2dldFBhcmVudEZyb21FbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXZvaWQgMCxpPXIuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlKTtyZXR1cm4gaSYmKG49dChpKVswXSksbnx8ZS5wYXJlbnROb2RlfSxlLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXI9ZnVuY3Rpb24obil7aWYoLygzOHw0MHwyN3wzMikvLnRlc3Qobi53aGljaCkmJiEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KG4udGFyZ2V0LnRhZ05hbWUpJiYobi5wcmV2ZW50RGVmYXVsdCgpLG4uc3RvcFByb3BhZ2F0aW9uKCksIXRoaXMuZGlzYWJsZWQmJiF0KHRoaXMpLmhhc0NsYXNzKGcuRElTQUJMRUQpKSl7dmFyIGk9ZS5fZ2V0UGFyZW50RnJvbUVsZW1lbnQodGhpcyksbz10KGkpLmhhc0NsYXNzKGcuU0hPVyk7aWYoIW8mJm4ud2hpY2ghPT1jfHxvJiZuLndoaWNoPT09Yyl7aWYobi53aGljaD09PWMpe3ZhciByPXQoaSkuZmluZChwLkRBVEFfVE9HR0xFKVswXTt0KHIpLnRyaWdnZXIoXCJmb2N1c1wiKX1yZXR1cm4gdm9pZCB0KHRoaXMpLnRyaWdnZXIoXCJjbGlja1wiKX12YXIgcz10KGkpLmZpbmQocC5WSVNJQkxFX0lURU1TKS5nZXQoKTtpZihzLmxlbmd0aCl7dmFyIGE9cy5pbmRleE9mKG4udGFyZ2V0KTtuLndoaWNoPT09dSYmYT4wJiZhLS0sbi53aGljaD09PWQmJmE8cy5sZW5ndGgtMSYmYSsrLGE8MCYmKGE9MCksc1thXS5mb2N1cygpfX19LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbihfLktFWURPV05fREFUQV9BUEkscC5EQVRBX1RPR0dMRSxtLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLlJPTEVfTUVOVSxtLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKF8uS0VZRE9XTl9EQVRBX0FQSSxwLlJPTEVfTElTVEJPWCxtLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKF8uQ0xJQ0tfREFUQV9BUEkrXCIgXCIrXy5GT0NVU0lOX0RBVEFfQVBJLG0uX2NsZWFyTWVudXMpLm9uKF8uQ0xJQ0tfREFUQV9BUEkscC5EQVRBX1RPR0dMRSxtLnByb3RvdHlwZS50b2dnbGUpLm9uKF8uQ0xJQ0tfREFUQV9BUEkscC5GT1JNX0NISUxELGZ1bmN0aW9uKHQpe3Quc3RvcFByb3BhZ2F0aW9uKCl9KSx0LmZuW2VdPW0uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPW0sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxtLl9qUXVlcnlJbnRlcmZhY2V9LG19KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJtb2RhbFwiLHM9XCI0LjAuMC1hbHBoYS42XCIsYT1cImJzLm1vZGFsXCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT0zMDAsZD0xNTAsZj0yNyxfPXtiYWNrZHJvcDohMCxrZXlib2FyZDohMCxmb2N1czohMCxzaG93OiEwfSxnPXtiYWNrZHJvcDpcIihib29sZWFufHN0cmluZylcIixrZXlib2FyZDpcImJvb2xlYW5cIixmb2N1czpcImJvb2xlYW5cIixzaG93OlwiYm9vbGVhblwifSxwPXtISURFOlwiaGlkZVwiK2wsSElEREVOOlwiaGlkZGVuXCIrbCxTSE9XOlwic2hvd1wiK2wsU0hPV046XCJzaG93blwiK2wsRk9DVVNJTjpcImZvY3VzaW5cIitsLFJFU0laRTpcInJlc2l6ZVwiK2wsQ0xJQ0tfRElTTUlTUzpcImNsaWNrLmRpc21pc3NcIitsLEtFWURPV05fRElTTUlTUzpcImtleWRvd24uZGlzbWlzc1wiK2wsTU9VU0VVUF9ESVNNSVNTOlwibW91c2V1cC5kaXNtaXNzXCIrbCxNT1VTRURPV05fRElTTUlTUzpcIm1vdXNlZG93bi5kaXNtaXNzXCIrbCxDTElDS19EQVRBX0FQSTpcImNsaWNrXCIrbCtofSxtPXtTQ1JPTExCQVJfTUVBU1VSRVI6XCJtb2RhbC1zY3JvbGxiYXItbWVhc3VyZVwiLEJBQ0tEUk9QOlwibW9kYWwtYmFja2Ryb3BcIixPUEVOOlwibW9kYWwtb3BlblwiLEZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sRT17RElBTE9HOlwiLm1vZGFsLWRpYWxvZ1wiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsREFUQV9ESVNNSVNTOidbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLEZJWEVEX0NPTlRFTlQ6XCIuZml4ZWQtdG9wLCAuZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQsIC5zdGlja3ktdG9wXCJ9LHY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKGUsaSl7bih0aGlzLGgpLHRoaXMuX2NvbmZpZz10aGlzLl9nZXRDb25maWcoaSksdGhpcy5fZWxlbWVudD1lLHRoaXMuX2RpYWxvZz10KGUpLmZpbmQoRS5ESUFMT0cpWzBdLHRoaXMuX2JhY2tkcm9wPW51bGwsdGhpcy5faXNTaG93bj0hMSx0aGlzLl9pc0JvZHlPdmVyZmxvd2luZz0hMSx0aGlzLl9pZ25vcmVCYWNrZHJvcENsaWNrPSExLHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl9vcmlnaW5hbEJvZHlQYWRkaW5nPTAsdGhpcy5fc2Nyb2xsYmFyV2lkdGg9MH1yZXR1cm4gaC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9pc1Nob3duP3RoaXMuaGlkZSgpOnRoaXMuc2hvdyh0KX0saC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbihlKXt2YXIgbj10aGlzO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJNb2RhbCBpcyB0cmFuc2l0aW9uaW5nXCIpO3Iuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKSYmKHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCk7dmFyIGk9dC5FdmVudChwLlNIT1cse3JlbGF0ZWRUYXJnZXQ6ZX0pO3QodGhpcy5fZWxlbWVudCkudHJpZ2dlcihpKSx0aGlzLl9pc1Nob3dufHxpLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwodGhpcy5faXNTaG93bj0hMCx0aGlzLl9jaGVja1Njcm9sbGJhcigpLHRoaXMuX3NldFNjcm9sbGJhcigpLHQoZG9jdW1lbnQuYm9keSkuYWRkQ2xhc3MobS5PUEVOKSx0aGlzLl9zZXRFc2NhcGVFdmVudCgpLHRoaXMuX3NldFJlc2l6ZUV2ZW50KCksdCh0aGlzLl9lbGVtZW50KS5vbihwLkNMSUNLX0RJU01JU1MsRS5EQVRBX0RJU01JU1MsZnVuY3Rpb24odCl7cmV0dXJuIG4uaGlkZSh0KX0pLHQodGhpcy5fZGlhbG9nKS5vbihwLk1PVVNFRE9XTl9ESVNNSVNTLGZ1bmN0aW9uKCl7dChuLl9lbGVtZW50KS5vbmUocC5NT1VTRVVQX0RJU01JU1MsZnVuY3Rpb24oZSl7dChlLnRhcmdldCkuaXMobi5fZWxlbWVudCkmJihuLl9pZ25vcmVCYWNrZHJvcENsaWNrPSEwKX0pfSksdGhpcy5fc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7cmV0dXJuIG4uX3Nob3dFbGVtZW50KGUpfSkpfSxoLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXM7aWYoZSYmZS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJNb2RhbCBpcyB0cmFuc2l0aW9uaW5nXCIpO3ZhciBpPXIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MobS5GQURFKTtpJiYodGhpcy5faXNUcmFuc2l0aW9uaW5nPSEwKTt2YXIgbz10LkV2ZW50KHAuSElERSk7dCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKG8pLHRoaXMuX2lzU2hvd24mJiFvLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYodGhpcy5faXNTaG93bj0hMSx0aGlzLl9zZXRFc2NhcGVFdmVudCgpLHRoaXMuX3NldFJlc2l6ZUV2ZW50KCksdChkb2N1bWVudCkub2ZmKHAuRk9DVVNJTiksdCh0aGlzLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhtLlNIT1cpLHQodGhpcy5fZWxlbWVudCkub2ZmKHAuQ0xJQ0tfRElTTUlTUyksdCh0aGlzLl9kaWFsb2cpLm9mZihwLk1PVVNFRE9XTl9ESVNNSVNTKSxpP3QodGhpcy5fZWxlbWVudCkub25lKHIuVFJBTlNJVElPTl9FTkQsZnVuY3Rpb24odCl7cmV0dXJuIG4uX2hpZGVNb2RhbCh0KX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHUpOnRoaXMuX2hpZGVNb2RhbCgpKX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe3QucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LGEpLHQod2luZG93LGRvY3VtZW50LHRoaXMuX2VsZW1lbnQsdGhpcy5fYmFja2Ryb3ApLm9mZihsKSx0aGlzLl9jb25maWc9bnVsbCx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5fZGlhbG9nPW51bGwsdGhpcy5fYmFja2Ryb3A9bnVsbCx0aGlzLl9pc1Nob3duPW51bGwsdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmc9bnVsbCx0aGlzLl9pZ25vcmVCYWNrZHJvcENsaWNrPW51bGwsdGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZz1udWxsLHRoaXMuX3Njcm9sbGJhcldpZHRoPW51bGx9LGgucHJvdG90eXBlLl9nZXRDb25maWc9ZnVuY3Rpb24obil7cmV0dXJuIG49dC5leHRlbmQoe30sXyxuKSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sZyksbn0saC5wcm90b3R5cGUuX3Nob3dFbGVtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT1yLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk7dGhpcy5fZWxlbWVudC5wYXJlbnROb2RlJiZ0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERXx8ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50KSx0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiLHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiksdGhpcy5fZWxlbWVudC5zY3JvbGxUb3A9MCxpJiZyLnJlZmxvdyh0aGlzLl9lbGVtZW50KSx0KHRoaXMuX2VsZW1lbnQpLmFkZENsYXNzKG0uU0hPVyksdGhpcy5fY29uZmlnLmZvY3VzJiZ0aGlzLl9lbmZvcmNlRm9jdXMoKTt2YXIgbz10LkV2ZW50KHAuU0hPV04se3JlbGF0ZWRUYXJnZXQ6ZX0pLHM9ZnVuY3Rpb24oKXtuLl9jb25maWcuZm9jdXMmJm4uX2VsZW1lbnQuZm9jdXMoKSxuLl9pc1RyYW5zaXRpb25pbmc9ITEsdChuLl9lbGVtZW50KS50cmlnZ2VyKG8pfTtpP3QodGhpcy5fZGlhbG9nKS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh1KTpzKCl9LGgucHJvdG90eXBlLl9lbmZvcmNlRm9jdXM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3QoZG9jdW1lbnQpLm9mZihwLkZPQ1VTSU4pLm9uKHAuRk9DVVNJTixmdW5jdGlvbihuKXtkb2N1bWVudD09PW4udGFyZ2V0fHxlLl9lbGVtZW50PT09bi50YXJnZXR8fHQoZS5fZWxlbWVudCkuaGFzKG4udGFyZ2V0KS5sZW5ndGh8fGUuX2VsZW1lbnQuZm9jdXMoKX0pfSxoLnByb3RvdHlwZS5fc2V0RXNjYXBlRXZlbnQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2lzU2hvd24mJnRoaXMuX2NvbmZpZy5rZXlib2FyZD90KHRoaXMuX2VsZW1lbnQpLm9uKHAuS0VZRE9XTl9ESVNNSVNTLGZ1bmN0aW9uKHQpe3Qud2hpY2g9PT1mJiZlLmhpZGUoKX0pOnRoaXMuX2lzU2hvd258fHQodGhpcy5fZWxlbWVudCkub2ZmKHAuS0VZRE9XTl9ESVNNSVNTKX0saC5wcm90b3R5cGUuX3NldFJlc2l6ZUV2ZW50PWZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLl9pc1Nob3duP3Qod2luZG93KS5vbihwLlJFU0laRSxmdW5jdGlvbih0KXtyZXR1cm4gZS5faGFuZGxlVXBkYXRlKHQpfSk6dCh3aW5kb3cpLm9mZihwLlJFU0laRSl9LGgucHJvdG90eXBlLl9oaWRlTW9kYWw9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheT1cIm5vbmVcIix0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpLHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl9zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXt0KGRvY3VtZW50LmJvZHkpLnJlbW92ZUNsYXNzKG0uT1BFTiksZS5fcmVzZXRBZGp1c3RtZW50cygpLGUuX3Jlc2V0U2Nyb2xsYmFyKCksdChlLl9lbGVtZW50KS50cmlnZ2VyKHAuSElEREVOKX0pfSxoLnByb3RvdHlwZS5fcmVtb3ZlQmFja2Ryb3A9ZnVuY3Rpb24oKXt0aGlzLl9iYWNrZHJvcCYmKHQodGhpcy5fYmFja2Ryb3ApLnJlbW92ZSgpLHRoaXMuX2JhY2tkcm9wPW51bGwpfSxoLnByb3RvdHlwZS5fc2hvd0JhY2tkcm9wPWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMsaT10KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKG0uRkFERSk/bS5GQURFOlwiXCI7aWYodGhpcy5faXNTaG93biYmdGhpcy5fY29uZmlnLmJhY2tkcm9wKXt2YXIgbz1yLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZpO2lmKHRoaXMuX2JhY2tkcm9wPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdGhpcy5fYmFja2Ryb3AuY2xhc3NOYW1lPW0uQkFDS0RST1AsaSYmdCh0aGlzLl9iYWNrZHJvcCkuYWRkQ2xhc3MoaSksdCh0aGlzLl9iYWNrZHJvcCkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSksdCh0aGlzLl9lbGVtZW50KS5vbihwLkNMSUNLX0RJU01JU1MsZnVuY3Rpb24odCl7cmV0dXJuIG4uX2lnbm9yZUJhY2tkcm9wQ2xpY2s/dm9pZChuLl9pZ25vcmVCYWNrZHJvcENsaWNrPSExKTp2b2lkKHQudGFyZ2V0PT09dC5jdXJyZW50VGFyZ2V0JiYoXCJzdGF0aWNcIj09PW4uX2NvbmZpZy5iYWNrZHJvcD9uLl9lbGVtZW50LmZvY3VzKCk6bi5oaWRlKCkpKX0pLG8mJnIucmVmbG93KHRoaXMuX2JhY2tkcm9wKSx0KHRoaXMuX2JhY2tkcm9wKS5hZGRDbGFzcyhtLlNIT1cpLCFlKXJldHVybjtpZighbylyZXR1cm4gdm9pZCBlKCk7dCh0aGlzLl9iYWNrZHJvcCkub25lKHIuVFJBTlNJVElPTl9FTkQsZSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoZCl9ZWxzZSBpZighdGhpcy5faXNTaG93biYmdGhpcy5fYmFja2Ryb3Ape3QodGhpcy5fYmFja2Ryb3ApLnJlbW92ZUNsYXNzKG0uU0hPVyk7dmFyIHM9ZnVuY3Rpb24oKXtuLl9yZW1vdmVCYWNrZHJvcCgpLGUmJmUoKX07ci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmdCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhtLkZBREUpP3QodGhpcy5fYmFja2Ryb3ApLm9uZShyLlRSQU5TSVRJT05fRU5ELHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGQpOnMoKX1lbHNlIGUmJmUoKX0saC5wcm90b3R5cGUuX2hhbmRsZVVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuX2FkanVzdERpYWxvZygpfSxoLnByb3RvdHlwZS5fYWRqdXN0RGlhbG9nPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fZWxlbWVudC5zY3JvbGxIZWlnaHQ+ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDshdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcmJnQmJih0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0PXRoaXMuX3Njcm9sbGJhcldpZHRoK1wicHhcIiksdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcmJiF0JiYodGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQ9dGhpcy5fc2Nyb2xsYmFyV2lkdGgrXCJweFwiKX0saC5wcm90b3R5cGUuX3Jlc2V0QWRqdXN0bWVudHM9ZnVuY3Rpb24oKXt0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0PVwiXCIsdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQ9XCJcIn0saC5wcm90b3R5cGUuX2NoZWNrU2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dGhpcy5faXNCb2R5T3ZlcmZsb3dpbmc9ZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDx3aW5kb3cuaW5uZXJXaWR0aCx0aGlzLl9zY3JvbGxiYXJXaWR0aD10aGlzLl9nZXRTY3JvbGxiYXJXaWR0aCgpfSxoLnByb3RvdHlwZS5fc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dmFyIGU9cGFyc2VJbnQodChFLkZJWEVEX0NPTlRFTlQpLmNzcyhcInBhZGRpbmctcmlnaHRcIil8fDAsMTApO3RoaXMuX29yaWdpbmFsQm9keVBhZGRpbmc9ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHR8fFwiXCIsdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcmJihkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodD1lK3RoaXMuX3Njcm9sbGJhcldpZHRoK1wicHhcIil9LGgucHJvdG90eXBlLl9yZXNldFNjcm9sbGJhcj1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0PXRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmd9LGgucHJvdG90eXBlLl9nZXRTY3JvbGxiYXJXaWR0aD1mdW5jdGlvbigpe3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dC5jbGFzc05hbWU9bS5TQ1JPTExCQVJfTUVBU1VSRVIsZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0KTt2YXIgZT10Lm9mZnNldFdpZHRoLXQuY2xpZW50V2lkdGg7cmV0dXJuIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodCksZX0saC5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKGUsbil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBvPXQodGhpcykuZGF0YShhKSxyPXQuZXh0ZW5kKHt9LGguRGVmYXVsdCx0KHRoaXMpLmRhdGEoKSxcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlP1widW5kZWZpbmVkXCI6aShlKSkmJmUpO2lmKG98fChvPW5ldyBoKHRoaXMsciksdCh0aGlzKS5kYXRhKGEsbykpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1vW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO29bZV0obil9ZWxzZSByLnNob3cmJm8uc2hvdyhuKX0pfSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIF99fV0pLGh9KCk7cmV0dXJuIHQoZG9jdW1lbnQpLm9uKHAuQ0xJQ0tfREFUQV9BUEksRS5EQVRBX1RPR0dMRSxmdW5jdGlvbihlKXt2YXIgbj10aGlzLGk9dm9pZCAwLG89ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpO28mJihpPXQobylbMF0pO3ZhciBzPXQoaSkuZGF0YShhKT9cInRvZ2dsZVwiOnQuZXh0ZW5kKHt9LHQoaSkuZGF0YSgpLHQodGhpcykuZGF0YSgpKTtcIkFcIiE9PXRoaXMudGFnTmFtZSYmXCJBUkVBXCIhPT10aGlzLnRhZ05hbWV8fGUucHJldmVudERlZmF1bHQoKTt2YXIgbD10KGkpLm9uZShwLlNIT1csZnVuY3Rpb24oZSl7ZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8bC5vbmUocC5ISURERU4sZnVuY3Rpb24oKXt0KG4pLmlzKFwiOnZpc2libGVcIikmJm4uZm9jdXMoKX0pfSk7di5falF1ZXJ5SW50ZXJmYWNlLmNhbGwodChpKSxzLHRoaXMpfSksdC5mbltlXT12Ll9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj12LHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWMsdi5falF1ZXJ5SW50ZXJmYWNlfSx2fShqUXVlcnkpLGZ1bmN0aW9uKHQpe3ZhciBlPVwic2Nyb2xsc3B5XCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMuc2Nyb2xsc3B5XCIsbD1cIi5cIithLGg9XCIuZGF0YS1hcGlcIixjPXQuZm5bZV0sdT17b2Zmc2V0OjEwLG1ldGhvZDpcImF1dG9cIix0YXJnZXQ6XCJcIn0sZD17b2Zmc2V0OlwibnVtYmVyXCIsbWV0aG9kOlwic3RyaW5nXCIsdGFyZ2V0OlwiKHN0cmluZ3xlbGVtZW50KVwifSxmPXtBQ1RJVkFURTpcImFjdGl2YXRlXCIrbCxTQ1JPTEw6XCJzY3JvbGxcIitsLExPQURfREFUQV9BUEk6XCJsb2FkXCIrbCtofSxfPXtEUk9QRE9XTl9JVEVNOlwiZHJvcGRvd24taXRlbVwiLERST1BET1dOX01FTlU6XCJkcm9wZG93bi1tZW51XCIsTkFWX0xJTks6XCJuYXYtbGlua1wiLE5BVjpcIm5hdlwiLEFDVElWRTpcImFjdGl2ZVwifSxnPXtEQVRBX1NQWTonW2RhdGEtc3B5PVwic2Nyb2xsXCJdJyxBQ1RJVkU6XCIuYWN0aXZlXCIsTElTVF9JVEVNOlwiLmxpc3QtaXRlbVwiLExJOlwibGlcIixMSV9EUk9QRE9XTjpcImxpLmRyb3Bkb3duXCIsTkFWX0xJTktTOlwiLm5hdi1saW5rXCIsRFJPUERPV046XCIuZHJvcGRvd25cIixEUk9QRE9XTl9JVEVNUzpcIi5kcm9wZG93bi1pdGVtXCIsRFJPUERPV05fVE9HR0xFOlwiLmRyb3Bkb3duLXRvZ2dsZVwifSxwPXtPRkZTRVQ6XCJvZmZzZXRcIixQT1NJVElPTjpcInBvc2l0aW9uXCJ9LG09ZnVuY3Rpb24oKXtmdW5jdGlvbiBoKGUsaSl7dmFyIG89dGhpcztuKHRoaXMsaCksdGhpcy5fZWxlbWVudD1lLHRoaXMuX3Njcm9sbEVsZW1lbnQ9XCJCT0RZXCI9PT1lLnRhZ05hbWU/d2luZG93OmUsdGhpcy5fY29uZmlnPXRoaXMuX2dldENvbmZpZyhpKSx0aGlzLl9zZWxlY3Rvcj10aGlzLl9jb25maWcudGFyZ2V0K1wiIFwiK2cuTkFWX0xJTktTK1wiLFwiKyh0aGlzLl9jb25maWcudGFyZ2V0K1wiIFwiK2cuRFJPUERPV05fSVRFTVMpLHRoaXMuX29mZnNldHM9W10sdGhpcy5fdGFyZ2V0cz1bXSx0aGlzLl9hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLl9zY3JvbGxIZWlnaHQ9MCx0KHRoaXMuX3Njcm9sbEVsZW1lbnQpLm9uKGYuU0NST0xMLGZ1bmN0aW9uKHQpe3JldHVybiBvLl9wcm9jZXNzKHQpfSksdGhpcy5yZWZyZXNoKCksdGhpcy5fcHJvY2VzcygpfXJldHVybiBoLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxuPXRoaXMuX3Njcm9sbEVsZW1lbnQhPT10aGlzLl9zY3JvbGxFbGVtZW50LndpbmRvdz9wLlBPU0lUSU9OOnAuT0ZGU0VULGk9XCJhdXRvXCI9PT10aGlzLl9jb25maWcubWV0aG9kP246dGhpcy5fY29uZmlnLm1ldGhvZCxvPWk9PT1wLlBPU0lUSU9OP3RoaXMuX2dldFNjcm9sbFRvcCgpOjA7dGhpcy5fb2Zmc2V0cz1bXSx0aGlzLl90YXJnZXRzPVtdLHRoaXMuX3Njcm9sbEhlaWdodD10aGlzLl9nZXRTY3JvbGxIZWlnaHQoKTt2YXIgcz10Lm1ha2VBcnJheSh0KHRoaXMuX3NlbGVjdG9yKSk7cy5tYXAoZnVuY3Rpb24oZSl7dmFyIG49dm9pZCAwLHM9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KGUpO3JldHVybiBzJiYobj10KHMpWzBdKSxuJiYobi5vZmZzZXRXaWR0aHx8bi5vZmZzZXRIZWlnaHQpP1t0KG4pW2ldKCkudG9wK28sc106bnVsbH0pLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdH0pLnNvcnQoZnVuY3Rpb24odCxlKXtyZXR1cm4gdFswXS1lWzBdfSkuZm9yRWFjaChmdW5jdGlvbih0KXtlLl9vZmZzZXRzLnB1c2godFswXSksZS5fdGFyZ2V0cy5wdXNoKHRbMV0pfSl9LGgucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCxhKSx0KHRoaXMuX3Njcm9sbEVsZW1lbnQpLm9mZihsKSx0aGlzLl9lbGVtZW50PW51bGwsdGhpcy5fc2Nyb2xsRWxlbWVudD1udWxsLHRoaXMuX2NvbmZpZz1udWxsLHRoaXMuX3NlbGVjdG9yPW51bGwsdGhpcy5fb2Zmc2V0cz1udWxsLHRoaXMuX3RhcmdldHM9bnVsbCx0aGlzLl9hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLl9zY3JvbGxIZWlnaHQ9bnVsbH0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtpZihuPXQuZXh0ZW5kKHt9LHUsbiksXCJzdHJpbmdcIiE9dHlwZW9mIG4udGFyZ2V0KXt2YXIgaT10KG4udGFyZ2V0KS5hdHRyKFwiaWRcIik7aXx8KGk9ci5nZXRVSUQoZSksdChuLnRhcmdldCkuYXR0cihcImlkXCIsaSkpLG4udGFyZ2V0PVwiI1wiK2l9cmV0dXJuIHIudHlwZUNoZWNrQ29uZmlnKGUsbixkKSxufSxoLnByb3RvdHlwZS5fZ2V0U2Nyb2xsVG9wPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQ9PT13aW5kb3c/dGhpcy5fc2Nyb2xsRWxlbWVudC5wYWdlWU9mZnNldDp0aGlzLl9zY3JvbGxFbGVtZW50LnNjcm9sbFRvcH0saC5wcm90b3R5cGUuX2dldFNjcm9sbEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50LnNjcm9sbEhlaWdodHx8TWF0aC5tYXgoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCl9LGgucHJvdG90eXBlLl9nZXRPZmZzZXRIZWlnaHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudD09PXdpbmRvdz93aW5kb3cuaW5uZXJIZWlnaHQ6dGhpcy5fc2Nyb2xsRWxlbWVudC5vZmZzZXRIZWlnaHR9LGgucHJvdG90eXBlLl9wcm9jZXNzPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fZ2V0U2Nyb2xsVG9wKCkrdGhpcy5fY29uZmlnLm9mZnNldCxlPXRoaXMuX2dldFNjcm9sbEhlaWdodCgpLG49dGhpcy5fY29uZmlnLm9mZnNldCtlLXRoaXMuX2dldE9mZnNldEhlaWdodCgpO2lmKHRoaXMuX3Njcm9sbEhlaWdodCE9PWUmJnRoaXMucmVmcmVzaCgpLHQ+PW4pe3ZhciBpPXRoaXMuX3RhcmdldHNbdGhpcy5fdGFyZ2V0cy5sZW5ndGgtMV07cmV0dXJuIHZvaWQodGhpcy5fYWN0aXZlVGFyZ2V0IT09aSYmdGhpcy5fYWN0aXZhdGUoaSkpfWlmKHRoaXMuX2FjdGl2ZVRhcmdldCYmdDx0aGlzLl9vZmZzZXRzWzBdJiZ0aGlzLl9vZmZzZXRzWzBdPjApcmV0dXJuIHRoaXMuX2FjdGl2ZVRhcmdldD1udWxsLHZvaWQgdGhpcy5fY2xlYXIoKTtmb3IodmFyIG89dGhpcy5fb2Zmc2V0cy5sZW5ndGg7by0tOyl7dmFyIHI9dGhpcy5fYWN0aXZlVGFyZ2V0IT09dGhpcy5fdGFyZ2V0c1tvXSYmdD49dGhpcy5fb2Zmc2V0c1tvXSYmKHZvaWQgMD09PXRoaXMuX29mZnNldHNbbysxXXx8dDx0aGlzLl9vZmZzZXRzW28rMV0pO3ImJnRoaXMuX2FjdGl2YXRlKHRoaXMuX3RhcmdldHNbb10pfX0saC5wcm90b3R5cGUuX2FjdGl2YXRlPWZ1bmN0aW9uKGUpe3RoaXMuX2FjdGl2ZVRhcmdldD1lLHRoaXMuX2NsZWFyKCk7dmFyIG49dGhpcy5fc2VsZWN0b3Iuc3BsaXQoXCIsXCIpO249bi5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQrJ1tkYXRhLXRhcmdldD1cIicrZSsnXCJdLCcrKHQrJ1tocmVmPVwiJytlKydcIl0nKX0pO3ZhciBpPXQobi5qb2luKFwiLFwiKSk7aS5oYXNDbGFzcyhfLkRST1BET1dOX0lURU0pPyhpLmNsb3Nlc3QoZy5EUk9QRE9XTikuZmluZChnLkRST1BET1dOX1RPR0dMRSkuYWRkQ2xhc3MoXy5BQ1RJVkUpLGkuYWRkQ2xhc3MoXy5BQ1RJVkUpKTppLnBhcmVudHMoZy5MSSkuZmluZChcIj4gXCIrZy5OQVZfTElOS1MpLmFkZENsYXNzKF8uQUNUSVZFKSx0KHRoaXMuX3Njcm9sbEVsZW1lbnQpLnRyaWdnZXIoZi5BQ1RJVkFURSx7cmVsYXRlZFRhcmdldDplfSl9LGgucHJvdG90eXBlLl9jbGVhcj1mdW5jdGlvbigpe3QodGhpcy5fc2VsZWN0b3IpLmZpbHRlcihnLkFDVElWRSkucmVtb3ZlQ2xhc3MoXy5BQ1RJVkUpfSxoLl9qUXVlcnlJbnRlcmZhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBuPXQodGhpcykuZGF0YShhKSxvPVwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIGU/XCJ1bmRlZmluZWRcIjppKGUpKSYmZTtcbmlmKG58fChuPW5ldyBoKHRoaXMsbyksdCh0aGlzKS5kYXRhKGEsbikpLFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZih2b2lkIDA9PT1uW2VdKXRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJytlKydcIicpO25bZV0oKX19KX0sbyhoLG51bGwsW3trZXk6XCJWRVJTSU9OXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9fSx7a2V5OlwiRGVmYXVsdFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB1fX1dKSxofSgpO3JldHVybiB0KHdpbmRvdykub24oZi5MT0FEX0RBVEFfQVBJLGZ1bmN0aW9uKCl7Zm9yKHZhciBlPXQubWFrZUFycmF5KHQoZy5EQVRBX1NQWSkpLG49ZS5sZW5ndGg7bi0tOyl7dmFyIGk9dChlW25dKTttLl9qUXVlcnlJbnRlcmZhY2UuY2FsbChpLGkuZGF0YSgpKX19KSx0LmZuW2VdPW0uX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPW0sdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09YyxtLl9qUXVlcnlJbnRlcmZhY2V9LG19KGpRdWVyeSksZnVuY3Rpb24odCl7dmFyIGU9XCJ0YWJcIixpPVwiNC4wLjAtYWxwaGEuNlwiLHM9XCJicy50YWJcIixhPVwiLlwiK3MsbD1cIi5kYXRhLWFwaVwiLGg9dC5mbltlXSxjPTE1MCx1PXtISURFOlwiaGlkZVwiK2EsSElEREVOOlwiaGlkZGVuXCIrYSxTSE9XOlwic2hvd1wiK2EsU0hPV046XCJzaG93blwiK2EsQ0xJQ0tfREFUQV9BUEk6XCJjbGlja1wiK2ErbH0sZD17RFJPUERPV05fTUVOVTpcImRyb3Bkb3duLW1lbnVcIixBQ1RJVkU6XCJhY3RpdmVcIixESVNBQkxFRDpcImRpc2FibGVkXCIsRkFERTpcImZhZGVcIixTSE9XOlwic2hvd1wifSxmPXtBOlwiYVwiLExJOlwibGlcIixEUk9QRE9XTjpcIi5kcm9wZG93blwiLExJU1Q6XCJ1bDpub3QoLmRyb3Bkb3duLW1lbnUpLCBvbDpub3QoLmRyb3Bkb3duLW1lbnUpLCBuYXY6bm90KC5kcm9wZG93bi1tZW51KVwiLEZBREVfQ0hJTEQ6XCI+IC5uYXYtaXRlbSAuZmFkZSwgPiAuZmFkZVwiLEFDVElWRTpcIi5hY3RpdmVcIixBQ1RJVkVfQ0hJTEQ6XCI+IC5uYXYtaXRlbSA+IC5hY3RpdmUsID4gLmFjdGl2ZVwiLERBVEFfVE9HR0xFOidbZGF0YS10b2dnbGU9XCJ0YWJcIl0sIFtkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLERST1BET1dOX1RPR0dMRTpcIi5kcm9wZG93bi10b2dnbGVcIixEUk9QRE9XTl9BQ1RJVkVfQ0hJTEQ6XCI+IC5kcm9wZG93bi1tZW51IC5hY3RpdmVcIn0sXz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7bih0aGlzLGUpLHRoaXMuX2VsZW1lbnQ9dH1yZXR1cm4gZS5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYoISh0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUmJnRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFJiZ0KHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKGQuQUNUSVZFKXx8dCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhkLkRJU0FCTEVEKSkpe3ZhciBuPXZvaWQgMCxpPXZvaWQgMCxvPXQodGhpcy5fZWxlbWVudCkuY2xvc2VzdChmLkxJU1QpWzBdLHM9ci5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpO28mJihpPXQubWFrZUFycmF5KHQobykuZmluZChmLkFDVElWRSkpLGk9aVtpLmxlbmd0aC0xXSk7dmFyIGE9dC5FdmVudCh1LkhJREUse3JlbGF0ZWRUYXJnZXQ6dGhpcy5fZWxlbWVudH0pLGw9dC5FdmVudCh1LlNIT1cse3JlbGF0ZWRUYXJnZXQ6aX0pO2lmKGkmJnQoaSkudHJpZ2dlcihhKSx0KHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIobCksIWwuaXNEZWZhdWx0UHJldmVudGVkKCkmJiFhLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtzJiYobj10KHMpWzBdKSx0aGlzLl9hY3RpdmF0ZSh0aGlzLl9lbGVtZW50LG8pO3ZhciBoPWZ1bmN0aW9uKCl7dmFyIG49dC5FdmVudCh1LkhJRERFTix7cmVsYXRlZFRhcmdldDplLl9lbGVtZW50fSksbz10LkV2ZW50KHUuU0hPV04se3JlbGF0ZWRUYXJnZXQ6aX0pO3QoaSkudHJpZ2dlcihuKSx0KGUuX2VsZW1lbnQpLnRyaWdnZXIobyl9O24/dGhpcy5fYWN0aXZhdGUobixuLnBhcmVudE5vZGUsaCk6aCgpfX19LGUucHJvdG90eXBlLmRpc3Bvc2U9ZnVuY3Rpb24oKXt0LnJlbW92ZUNsYXNzKHRoaXMuX2VsZW1lbnQscyksdGhpcy5fZWxlbWVudD1udWxsfSxlLnByb3RvdHlwZS5fYWN0aXZhdGU9ZnVuY3Rpb24oZSxuLGkpe3ZhciBvPXRoaXMscz10KG4pLmZpbmQoZi5BQ1RJVkVfQ0hJTEQpWzBdLGE9aSYmci5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSYmKHMmJnQocykuaGFzQ2xhc3MoZC5GQURFKXx8Qm9vbGVhbih0KG4pLmZpbmQoZi5GQURFX0NISUxEKVswXSkpLGw9ZnVuY3Rpb24oKXtyZXR1cm4gby5fdHJhbnNpdGlvbkNvbXBsZXRlKGUscyxhLGkpfTtzJiZhP3Qocykub25lKHIuVFJBTlNJVElPTl9FTkQsbCkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYyk6bCgpLHMmJnQocykucmVtb3ZlQ2xhc3MoZC5TSE9XKX0sZS5wcm90b3R5cGUuX3RyYW5zaXRpb25Db21wbGV0ZT1mdW5jdGlvbihlLG4saSxvKXtpZihuKXt0KG4pLnJlbW92ZUNsYXNzKGQuQUNUSVZFKTt2YXIgcz10KG4ucGFyZW50Tm9kZSkuZmluZChmLkRST1BET1dOX0FDVElWRV9DSElMRClbMF07cyYmdChzKS5yZW1vdmVDbGFzcyhkLkFDVElWRSksbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITEpfWlmKHQoZSkuYWRkQ2xhc3MoZC5BQ1RJVkUpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCEwKSxpPyhyLnJlZmxvdyhlKSx0KGUpLmFkZENsYXNzKGQuU0hPVykpOnQoZSkucmVtb3ZlQ2xhc3MoZC5GQURFKSxlLnBhcmVudE5vZGUmJnQoZS5wYXJlbnROb2RlKS5oYXNDbGFzcyhkLkRST1BET1dOX01FTlUpKXt2YXIgYT10KGUpLmNsb3Nlc3QoZi5EUk9QRE9XTilbMF07YSYmdChhKS5maW5kKGYuRFJPUERPV05fVE9HR0xFKS5hZGRDbGFzcyhkLkFDVElWRSksZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsITApfW8mJm8oKX0sZS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgaT10KHRoaXMpLG89aS5kYXRhKHMpO2lmKG98fChvPW5ldyBlKHRoaXMpLGkuZGF0YShzLG8pKSxcInN0cmluZ1wiPT10eXBlb2Ygbil7aWYodm9pZCAwPT09b1tuXSl0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicrbisnXCInKTtvW25dKCl9fSl9LG8oZSxudWxsLFt7a2V5OlwiVkVSU0lPTlwiLGdldDpmdW5jdGlvbigpe3JldHVybiBpfX1dKSxlfSgpO3JldHVybiB0KGRvY3VtZW50KS5vbih1LkNMSUNLX0RBVEFfQVBJLGYuREFUQV9UT0dHTEUsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpLF8uX2pRdWVyeUludGVyZmFjZS5jYWxsKHQodGhpcyksXCJzaG93XCIpfSksdC5mbltlXT1fLl9qUXVlcnlJbnRlcmZhY2UsdC5mbltlXS5Db25zdHJ1Y3Rvcj1fLHQuZm5bZV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiB0LmZuW2VdPWgsXy5falF1ZXJ5SW50ZXJmYWNlfSxffShqUXVlcnkpLGZ1bmN0aW9uKHQpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBUZXRoZXIpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwIHRvb2x0aXBzIHJlcXVpcmUgVGV0aGVyIChodHRwOi8vdGV0aGVyLmlvLylcIik7dmFyIGU9XCJ0b29sdGlwXCIscz1cIjQuMC4wLWFscGhhLjZcIixhPVwiYnMudG9vbHRpcFwiLGw9XCIuXCIrYSxoPXQuZm5bZV0sYz0xNTAsdT1cImJzLXRldGhlclwiLGQ9e2FuaW1hdGlvbjohMCx0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+Jyx0cmlnZ2VyOlwiaG92ZXIgZm9jdXNcIix0aXRsZTpcIlwiLGRlbGF5OjAsaHRtbDohMSxzZWxlY3RvcjohMSxwbGFjZW1lbnQ6XCJ0b3BcIixvZmZzZXQ6XCIwIDBcIixjb25zdHJhaW50czpbXSxjb250YWluZXI6ITF9LGY9e2FuaW1hdGlvbjpcImJvb2xlYW5cIix0ZW1wbGF0ZTpcInN0cmluZ1wiLHRpdGxlOlwiKHN0cmluZ3xlbGVtZW50fGZ1bmN0aW9uKVwiLHRyaWdnZXI6XCJzdHJpbmdcIixkZWxheTpcIihudW1iZXJ8b2JqZWN0KVwiLGh0bWw6XCJib29sZWFuXCIsc2VsZWN0b3I6XCIoc3RyaW5nfGJvb2xlYW4pXCIscGxhY2VtZW50OlwiKHN0cmluZ3xmdW5jdGlvbilcIixvZmZzZXQ6XCJzdHJpbmdcIixjb25zdHJhaW50czpcImFycmF5XCIsY29udGFpbmVyOlwiKHN0cmluZ3xlbGVtZW50fGJvb2xlYW4pXCJ9LF89e1RPUDpcImJvdHRvbSBjZW50ZXJcIixSSUdIVDpcIm1pZGRsZSBsZWZ0XCIsQk9UVE9NOlwidG9wIGNlbnRlclwiLExFRlQ6XCJtaWRkbGUgcmlnaHRcIn0sZz17U0hPVzpcInNob3dcIixPVVQ6XCJvdXRcIn0scD17SElERTpcImhpZGVcIitsLEhJRERFTjpcImhpZGRlblwiK2wsU0hPVzpcInNob3dcIitsLFNIT1dOOlwic2hvd25cIitsLElOU0VSVEVEOlwiaW5zZXJ0ZWRcIitsLENMSUNLOlwiY2xpY2tcIitsLEZPQ1VTSU46XCJmb2N1c2luXCIrbCxGT0NVU09VVDpcImZvY3Vzb3V0XCIrbCxNT1VTRUVOVEVSOlwibW91c2VlbnRlclwiK2wsTU9VU0VMRUFWRTpcIm1vdXNlbGVhdmVcIitsfSxtPXtGQURFOlwiZmFkZVwiLFNIT1c6XCJzaG93XCJ9LEU9e1RPT0xUSVA6XCIudG9vbHRpcFwiLFRPT0xUSVBfSU5ORVI6XCIudG9vbHRpcC1pbm5lclwifSx2PXtlbGVtZW50OiExLGVuYWJsZWQ6ITF9LFQ9e0hPVkVSOlwiaG92ZXJcIixGT0NVUzpcImZvY3VzXCIsQ0xJQ0s6XCJjbGlja1wiLE1BTlVBTDpcIm1hbnVhbFwifSxJPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaCh0LGUpe24odGhpcyxoKSx0aGlzLl9pc0VuYWJsZWQ9ITAsdGhpcy5fdGltZW91dD0wLHRoaXMuX2hvdmVyU3RhdGU9XCJcIix0aGlzLl9hY3RpdmVUcmlnZ2VyPXt9LHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMSx0aGlzLl90ZXRoZXI9bnVsbCx0aGlzLmVsZW1lbnQ9dCx0aGlzLmNvbmZpZz10aGlzLl9nZXRDb25maWcoZSksdGhpcy50aXA9bnVsbCx0aGlzLl9zZXRMaXN0ZW5lcnMoKX1yZXR1cm4gaC5wcm90b3R5cGUuZW5hYmxlPWZ1bmN0aW9uKCl7dGhpcy5faXNFbmFibGVkPSEwfSxoLnByb3RvdHlwZS5kaXNhYmxlPWZ1bmN0aW9uKCl7dGhpcy5faXNFbmFibGVkPSExfSxoLnByb3RvdHlwZS50b2dnbGVFbmFibGVkPWZ1bmN0aW9uKCl7dGhpcy5faXNFbmFibGVkPSF0aGlzLl9pc0VuYWJsZWR9LGgucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihlKXtpZihlKXt2YXIgbj10aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZLGk9dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEobik7aXx8KGk9bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKG4saSkpLGkuX2FjdGl2ZVRyaWdnZXIuY2xpY2s9IWkuX2FjdGl2ZVRyaWdnZXIuY2xpY2ssaS5faXNXaXRoQWN0aXZlVHJpZ2dlcigpP2kuX2VudGVyKG51bGwsaSk6aS5fbGVhdmUobnVsbCxpKX1lbHNle2lmKHQodGhpcy5nZXRUaXBFbGVtZW50KCkpLmhhc0NsYXNzKG0uU0hPVykpcmV0dXJuIHZvaWQgdGhpcy5fbGVhdmUobnVsbCx0aGlzKTt0aGlzLl9lbnRlcihudWxsLHRoaXMpfX0saC5wcm90b3R5cGUuZGlzcG9zZT1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0KSx0aGlzLmNsZWFudXBUZXRoZXIoKSx0LnJlbW92ZURhdGEodGhpcy5lbGVtZW50LHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVkpLHQodGhpcy5lbGVtZW50KS5vZmYodGhpcy5jb25zdHJ1Y3Rvci5FVkVOVF9LRVkpLHQodGhpcy5lbGVtZW50KS5jbG9zZXN0KFwiLm1vZGFsXCIpLm9mZihcImhpZGUuYnMubW9kYWxcIiksdGhpcy50aXAmJnQodGhpcy50aXApLnJlbW92ZSgpLHRoaXMuX2lzRW5hYmxlZD1udWxsLHRoaXMuX3RpbWVvdXQ9bnVsbCx0aGlzLl9ob3ZlclN0YXRlPW51bGwsdGhpcy5fYWN0aXZlVHJpZ2dlcj1udWxsLHRoaXMuX3RldGhlcj1udWxsLHRoaXMuZWxlbWVudD1udWxsLHRoaXMuY29uZmlnPW51bGwsdGhpcy50aXA9bnVsbH0saC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYoXCJub25lXCI9PT10KHRoaXMuZWxlbWVudCkuY3NzKFwiZGlzcGxheVwiKSl0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgdXNlIHNob3cgb24gdmlzaWJsZSBlbGVtZW50c1wiKTt2YXIgbj10LkV2ZW50KHRoaXMuY29uc3RydWN0b3IuRXZlbnQuU0hPVyk7aWYodGhpcy5pc1dpdGhDb250ZW50KCkmJnRoaXMuX2lzRW5hYmxlZCl7aWYodGhpcy5faXNUcmFuc2l0aW9uaW5nKXRocm93IG5ldyBFcnJvcihcIlRvb2x0aXAgaXMgdHJhbnNpdGlvbmluZ1wiKTt0KHRoaXMuZWxlbWVudCkudHJpZ2dlcihuKTt2YXIgaT10LmNvbnRhaW5zKHRoaXMuZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCx0aGlzLmVsZW1lbnQpO2lmKG4uaXNEZWZhdWx0UHJldmVudGVkKCl8fCFpKXJldHVybjt2YXIgbz10aGlzLmdldFRpcEVsZW1lbnQoKSxzPXIuZ2V0VUlEKHRoaXMuY29uc3RydWN0b3IuTkFNRSk7by5zZXRBdHRyaWJ1dGUoXCJpZFwiLHMpLHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIscyksdGhpcy5zZXRDb250ZW50KCksdGhpcy5jb25maWcuYW5pbWF0aW9uJiZ0KG8pLmFkZENsYXNzKG0uRkFERSk7dmFyIGE9XCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5jb25maWcucGxhY2VtZW50P3RoaXMuY29uZmlnLnBsYWNlbWVudC5jYWxsKHRoaXMsbyx0aGlzLmVsZW1lbnQpOnRoaXMuY29uZmlnLnBsYWNlbWVudCxsPXRoaXMuX2dldEF0dGFjaG1lbnQoYSksYz10aGlzLmNvbmZpZy5jb250YWluZXI9PT0hMT9kb2N1bWVudC5ib2R5OnQodGhpcy5jb25maWcuY29udGFpbmVyKTt0KG8pLmRhdGEodGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSx0aGlzKS5hcHBlbmRUbyhjKSx0KHRoaXMuZWxlbWVudCkudHJpZ2dlcih0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LklOU0VSVEVEKSx0aGlzLl90ZXRoZXI9bmV3IFRldGhlcih7YXR0YWNobWVudDpsLGVsZW1lbnQ6byx0YXJnZXQ6dGhpcy5lbGVtZW50LGNsYXNzZXM6dixjbGFzc1ByZWZpeDp1LG9mZnNldDp0aGlzLmNvbmZpZy5vZmZzZXQsY29uc3RyYWludHM6dGhpcy5jb25maWcuY29uc3RyYWludHMsYWRkVGFyZ2V0Q2xhc3NlczohMX0pLHIucmVmbG93KG8pLHRoaXMuX3RldGhlci5wb3NpdGlvbigpLHQobykuYWRkQ2xhc3MobS5TSE9XKTt2YXIgZD1mdW5jdGlvbigpe3ZhciBuPWUuX2hvdmVyU3RhdGU7ZS5faG92ZXJTdGF0ZT1udWxsLGUuX2lzVHJhbnNpdGlvbmluZz0hMSx0KGUuZWxlbWVudCkudHJpZ2dlcihlLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1dOKSxuPT09Zy5PVVQmJmUuX2xlYXZlKG51bGwsZSl9O2lmKHIuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkmJnQodGhpcy50aXApLmhhc0NsYXNzKG0uRkFERSkpcmV0dXJuIHRoaXMuX2lzVHJhbnNpdGlvbmluZz0hMCx2b2lkIHQodGhpcy50aXApLm9uZShyLlRSQU5TSVRJT05fRU5ELGQpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGguX1RSQU5TSVRJT05fRFVSQVRJT04pO2QoKX19LGgucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oZSl7dmFyIG49dGhpcyxpPXRoaXMuZ2V0VGlwRWxlbWVudCgpLG89dC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkhJREUpO2lmKHRoaXMuX2lzVHJhbnNpdGlvbmluZyl0aHJvdyBuZXcgRXJyb3IoXCJUb29sdGlwIGlzIHRyYW5zaXRpb25pbmdcIik7dmFyIHM9ZnVuY3Rpb24oKXtuLl9ob3ZlclN0YXRlIT09Zy5TSE9XJiZpLnBhcmVudE5vZGUmJmkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpKSxuLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiKSx0KG4uZWxlbWVudCkudHJpZ2dlcihuLmNvbnN0cnVjdG9yLkV2ZW50LkhJRERFTiksbi5faXNUcmFuc2l0aW9uaW5nPSExLG4uY2xlYW51cFRldGhlcigpLGUmJmUoKX07dCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIobyksby5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KHQoaSkucmVtb3ZlQ2xhc3MobS5TSE9XKSx0aGlzLl9hY3RpdmVUcmlnZ2VyW1QuQ0xJQ0tdPSExLHRoaXMuX2FjdGl2ZVRyaWdnZXJbVC5GT0NVU109ITEsdGhpcy5fYWN0aXZlVHJpZ2dlcltULkhPVkVSXT0hMSxyLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpJiZ0KHRoaXMudGlwKS5oYXNDbGFzcyhtLkZBREUpPyh0aGlzLl9pc1RyYW5zaXRpb25pbmc9ITAsdChpKS5vbmUoci5UUkFOU0lUSU9OX0VORCxzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjKSk6cygpLHRoaXMuX2hvdmVyU3RhdGU9XCJcIil9LGgucHJvdG90eXBlLmlzV2l0aENvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gQm9vbGVhbih0aGlzLmdldFRpdGxlKCkpfSxoLnByb3RvdHlwZS5nZXRUaXBFbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlwPXRoaXMudGlwfHx0KHRoaXMuY29uZmlnLnRlbXBsYXRlKVswXX0saC5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciBlPXQodGhpcy5nZXRUaXBFbGVtZW50KCkpO3RoaXMuc2V0RWxlbWVudENvbnRlbnQoZS5maW5kKEUuVE9PTFRJUF9JTk5FUiksdGhpcy5nZXRUaXRsZSgpKSxlLnJlbW92ZUNsYXNzKG0uRkFERStcIiBcIittLlNIT1cpLHRoaXMuY2xlYW51cFRldGhlcigpfSxoLnByb3RvdHlwZS5zZXRFbGVtZW50Q29udGVudD1mdW5jdGlvbihlLG4pe3ZhciBvPXRoaXMuY29uZmlnLmh0bWw7XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2Ygbj9cInVuZGVmaW5lZFwiOmkobikpJiYobi5ub2RlVHlwZXx8bi5qcXVlcnkpP28/dChuKS5wYXJlbnQoKS5pcyhlKXx8ZS5lbXB0eSgpLmFwcGVuZChuKTplLnRleHQodChuKS50ZXh0KCkpOmVbbz9cImh0bWxcIjpcInRleHRcIl0obil9LGgucHJvdG90eXBlLmdldFRpdGxlPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIik7cmV0dXJuIHR8fCh0PVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuY29uZmlnLnRpdGxlP3RoaXMuY29uZmlnLnRpdGxlLmNhbGwodGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy50aXRsZSksdH0saC5wcm90b3R5cGUuY2xlYW51cFRldGhlcj1mdW5jdGlvbigpe3RoaXMuX3RldGhlciYmdGhpcy5fdGV0aGVyLmRlc3Ryb3koKX0saC5wcm90b3R5cGUuX2dldEF0dGFjaG1lbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIF9bdC50b1VwcGVyQ2FzZSgpXX0saC5wcm90b3R5cGUuX3NldExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBlPXRoaXMsbj10aGlzLmNvbmZpZy50cmlnZ2VyLnNwbGl0KFwiIFwiKTtuLmZvckVhY2goZnVuY3Rpb24obil7aWYoXCJjbGlja1wiPT09bil0KGUuZWxlbWVudCkub24oZS5jb25zdHJ1Y3Rvci5FdmVudC5DTElDSyxlLmNvbmZpZy5zZWxlY3RvcixmdW5jdGlvbih0KXtyZXR1cm4gZS50b2dnbGUodCl9KTtlbHNlIGlmKG4hPT1ULk1BTlVBTCl7dmFyIGk9bj09PVQuSE9WRVI/ZS5jb25zdHJ1Y3Rvci5FdmVudC5NT1VTRUVOVEVSOmUuY29uc3RydWN0b3IuRXZlbnQuRk9DVVNJTixvPW49PT1ULkhPVkVSP2UuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VMRUFWRTplLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTT1VUO3QoZS5lbGVtZW50KS5vbihpLGUuY29uZmlnLnNlbGVjdG9yLGZ1bmN0aW9uKHQpe3JldHVybiBlLl9lbnRlcih0KX0pLm9uKG8sZS5jb25maWcuc2VsZWN0b3IsZnVuY3Rpb24odCl7cmV0dXJuIGUuX2xlYXZlKHQpfSl9dChlLmVsZW1lbnQpLmNsb3Nlc3QoXCIubW9kYWxcIikub24oXCJoaWRlLmJzLm1vZGFsXCIsZnVuY3Rpb24oKXtyZXR1cm4gZS5oaWRlKCl9KX0pLHRoaXMuY29uZmlnLnNlbGVjdG9yP3RoaXMuY29uZmlnPXQuZXh0ZW5kKHt9LHRoaXMuY29uZmlnLHt0cmlnZ2VyOlwibWFudWFsXCIsc2VsZWN0b3I6XCJcIn0pOnRoaXMuX2ZpeFRpdGxlKCl9LGgucHJvdG90eXBlLl9maXhUaXRsZT1mdW5jdGlvbigpe3ZhciB0PWkodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpOyh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGl0bGVcIil8fFwic3RyaW5nXCIhPT10KSYmKHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIsdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInRpdGxlXCIpfHxcIlwiKSx0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidGl0bGVcIixcIlwiKSl9LGgucHJvdG90eXBlLl9lbnRlcj1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMuY29uc3RydWN0b3IuREFUQV9LRVk7cmV0dXJuIG49bnx8dChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSksbnx8KG49bmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpLHQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKGksbikpLGUmJihuLl9hY3RpdmVUcmlnZ2VyW1wiZm9jdXNpblwiPT09ZS50eXBlP1QuRk9DVVM6VC5IT1ZFUl09ITApLHQobi5nZXRUaXBFbGVtZW50KCkpLmhhc0NsYXNzKG0uU0hPVyl8fG4uX2hvdmVyU3RhdGU9PT1nLlNIT1c/dm9pZChuLl9ob3ZlclN0YXRlPWcuU0hPVyk6KGNsZWFyVGltZW91dChuLl90aW1lb3V0KSxuLl9ob3ZlclN0YXRlPWcuU0hPVyxuLmNvbmZpZy5kZWxheSYmbi5jb25maWcuZGVsYXkuc2hvdz92b2lkKG4uX3RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe24uX2hvdmVyU3RhdGU9PT1nLlNIT1cmJm4uc2hvdygpfSxuLmNvbmZpZy5kZWxheS5zaG93KSk6dm9pZCBuLnNob3coKSl9LGgucHJvdG90eXBlLl9sZWF2ZT1mdW5jdGlvbihlLG4pe3ZhciBpPXRoaXMuY29uc3RydWN0b3IuREFUQV9LRVk7aWYobj1ufHx0KGUuY3VycmVudFRhcmdldCkuZGF0YShpKSxufHwobj1uZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsdGhpcy5fZ2V0RGVsZWdhdGVDb25maWcoKSksdChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoaSxuKSksZSYmKG4uX2FjdGl2ZVRyaWdnZXJbXCJmb2N1c291dFwiPT09ZS50eXBlP1QuRk9DVVM6VC5IT1ZFUl09ITEpLCFuLl9pc1dpdGhBY3RpdmVUcmlnZ2VyKCkpcmV0dXJuIGNsZWFyVGltZW91dChuLl90aW1lb3V0KSxuLl9ob3ZlclN0YXRlPWcuT1VULG4uY29uZmlnLmRlbGF5JiZuLmNvbmZpZy5kZWxheS5oaWRlP3ZvaWQobi5fdGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bi5faG92ZXJTdGF0ZT09PWcuT1VUJiZuLmhpZGUoKX0sbi5jb25maWcuZGVsYXkuaGlkZSkpOnZvaWQgbi5oaWRlKCl9LGgucHJvdG90eXBlLl9pc1dpdGhBY3RpdmVUcmlnZ2VyPWZ1bmN0aW9uKCl7Zm9yKHZhciB0IGluIHRoaXMuX2FjdGl2ZVRyaWdnZXIpaWYodGhpcy5fYWN0aXZlVHJpZ2dlclt0XSlyZXR1cm4hMDtyZXR1cm4hMX0saC5wcm90b3R5cGUuX2dldENvbmZpZz1mdW5jdGlvbihuKXtyZXR1cm4gbj10LmV4dGVuZCh7fSx0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHQsdCh0aGlzLmVsZW1lbnQpLmRhdGEoKSxuKSxuLmRlbGF5JiZcIm51bWJlclwiPT10eXBlb2Ygbi5kZWxheSYmKG4uZGVsYXk9e3Nob3c6bi5kZWxheSxoaWRlOm4uZGVsYXl9KSxyLnR5cGVDaGVja0NvbmZpZyhlLG4sdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0VHlwZSksbn0saC5wcm90b3R5cGUuX2dldERlbGVnYXRlQ29uZmlnPWZ1bmN0aW9uKCl7dmFyIHQ9e307aWYodGhpcy5jb25maWcpZm9yKHZhciBlIGluIHRoaXMuY29uZmlnKXRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFtlXSE9PXRoaXMuY29uZmlnW2VdJiYodFtlXT10aGlzLmNvbmZpZ1tlXSk7cmV0dXJuIHR9LGguX2pRdWVyeUludGVyZmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49dCh0aGlzKS5kYXRhKGEpLG89XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmkoZSkpJiZlO2lmKChufHwhL2Rpc3Bvc2V8aGlkZS8udGVzdChlKSkmJihufHwobj1uZXcgaCh0aGlzLG8pLHQodGhpcykuZGF0YShhLG4pKSxcInN0cmluZ1wiPT10eXBlb2YgZSkpe2lmKHZvaWQgMD09PW5bZV0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK2UrJ1wiJyk7bltlXSgpfX0pfSxvKGgsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc319LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGR9fSx7a2V5OlwiTkFNRVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBlfX0se2tleTpcIkRBVEFfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGF9fSx7a2V5OlwiRXZlbnRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcH19LHtrZXk6XCJFVkVOVF9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbH19LHtrZXk6XCJEZWZhdWx0VHlwZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBmfX1dKSxofSgpO3JldHVybiB0LmZuW2VdPUkuX2pRdWVyeUludGVyZmFjZSx0LmZuW2VdLkNvbnN0cnVjdG9yPUksdC5mbltlXS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHQuZm5bZV09aCxJLl9qUXVlcnlJbnRlcmZhY2V9LEl9KGpRdWVyeSkpOyhmdW5jdGlvbihyKXt2YXIgYT1cInBvcG92ZXJcIixsPVwiNC4wLjAtYWxwaGEuNlwiLGg9XCJicy5wb3BvdmVyXCIsYz1cIi5cIitoLHU9ci5mblthXSxkPXIuZXh0ZW5kKHt9LHMuRGVmYXVsdCx7cGxhY2VtZW50OlwicmlnaHRcIix0cmlnZ2VyOlwiY2xpY2tcIixjb250ZW50OlwiXCIsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J30pLGY9ci5leHRlbmQoe30scy5EZWZhdWx0VHlwZSx7Y29udGVudDpcIihzdHJpbmd8ZWxlbWVudHxmdW5jdGlvbilcIn0pLF89e0ZBREU6XCJmYWRlXCIsU0hPVzpcInNob3dcIn0sZz17VElUTEU6XCIucG9wb3Zlci10aXRsZVwiLENPTlRFTlQ6XCIucG9wb3Zlci1jb250ZW50XCJ9LHA9e0hJREU6XCJoaWRlXCIrYyxISURERU46XCJoaWRkZW5cIitjLFNIT1c6XCJzaG93XCIrYyxTSE9XTjpcInNob3duXCIrYyxJTlNFUlRFRDpcImluc2VydGVkXCIrYyxDTElDSzpcImNsaWNrXCIrYyxGT0NVU0lOOlwiZm9jdXNpblwiK2MsRk9DVVNPVVQ6XCJmb2N1c291dFwiK2MsTU9VU0VFTlRFUjpcIm1vdXNlZW50ZXJcIitjLE1PVVNFTEVBVkU6XCJtb3VzZWxlYXZlXCIrY30sbT1mdW5jdGlvbihzKXtmdW5jdGlvbiB1KCl7cmV0dXJuIG4odGhpcyx1KSx0KHRoaXMscy5hcHBseSh0aGlzLGFyZ3VtZW50cykpfXJldHVybiBlKHUscyksdS5wcm90b3R5cGUuaXNXaXRoQ29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFRpdGxlKCl8fHRoaXMuX2dldENvbnRlbnQoKX0sdS5wcm90b3R5cGUuZ2V0VGlwRWxlbWVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpcD10aGlzLnRpcHx8cih0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF19LHUucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgdD1yKHRoaXMuZ2V0VGlwRWxlbWVudCgpKTt0aGlzLnNldEVsZW1lbnRDb250ZW50KHQuZmluZChnLlRJVExFKSx0aGlzLmdldFRpdGxlKCkpLHRoaXMuc2V0RWxlbWVudENvbnRlbnQodC5maW5kKGcuQ09OVEVOVCksdGhpcy5fZ2V0Q29udGVudCgpKSx0LnJlbW92ZUNsYXNzKF8uRkFERStcIiBcIitfLlNIT1cpLHRoaXMuY2xlYW51cFRldGhlcigpfSx1LnByb3RvdHlwZS5fZ2V0Q29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb250ZW50XCIpfHwoXCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5jb25maWcuY29udGVudD90aGlzLmNvbmZpZy5jb250ZW50LmNhbGwodGhpcy5lbGVtZW50KTp0aGlzLmNvbmZpZy5jb250ZW50KX0sdS5falF1ZXJ5SW50ZXJmYWNlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1yKHRoaXMpLmRhdGEoaCksbj1cIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6aSh0KSk/dDpudWxsO2lmKChlfHwhL2Rlc3Ryb3l8aGlkZS8udGVzdCh0KSkmJihlfHwoZT1uZXcgdSh0aGlzLG4pLHIodGhpcykuZGF0YShoLGUpKSxcInN0cmluZ1wiPT10eXBlb2YgdCkpe2lmKHZvaWQgMD09PWVbdF0pdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInK3QrJ1wiJyk7ZVt0XSgpfX0pfSxvKHUsbnVsbCxbe2tleTpcIlZFUlNJT05cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbH19LHtrZXk6XCJEZWZhdWx0XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGR9fSx7a2V5OlwiTkFNRVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBhfX0se2tleTpcIkRBVEFfS0VZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGh9fSx7a2V5OlwiRXZlbnRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcH19LHtrZXk6XCJFVkVOVF9LRVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY319LHtrZXk6XCJEZWZhdWx0VHlwZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBmfX1dKSx1fShzKTtyZXR1cm4gci5mblthXT1tLl9qUXVlcnlJbnRlcmZhY2Usci5mblthXS5Db25zdHJ1Y3Rvcj1tLHIuZm5bYV0ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiByLmZuW2FdPXUsbS5falF1ZXJ5SW50ZXJmYWNlfSxtfSkoalF1ZXJ5KX0oKTsiLCIvKipcbiAqIFNob3dzIHRoZSBuZXh0IGNhbGVuZGFyIHNjcmVlblxuICogXG4gKiBAcGFyYW0ge2FueX0gZWxlbWVudCBcbiAqL1xuZnVuY3Rpb24gbmV4dENhbGVuZGFyU2NyZWVuKGVsZW1lbnQpe1xuICAgIHZhciBjdXJyZW50U2NyZWVuID0gJChlbGVtZW50KS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignLkNhbGVuZGFyX19TY3JlZW4nKTtcbiAgICBjdXJyZW50U2NyZWVuLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcbiAgICBcbiAgICB2YXIgbmV4dFNjcmVlbiA9ICQoY3VycmVudFNjcmVlbikubmV4dCgnLkNhbGVuZGFyX19TY3JlZW4nKTtcbiAgICBuZXh0U2NyZWVuLmFkZENsYXNzKCdBY3RpdmUnKTtcbn1cblxuLyoqXG4gKiBTaG93cyB0aGUgcHJldmlvdXMgY2FsZW5kYXIgc2NyZWVuXG4gKiBcbiAqIEBwYXJhbSB7YW55fSBlbGVtZW50IFxuICovXG5mdW5jdGlvbiBwcmV2aW91c0NhbGVuZGFyU2NyZWVuKGVsZW1lbnQpe1xuICAgIHZhciBjdXJyZW50U2NyZWVuID0gJChlbGVtZW50KS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignLkNhbGVuZGFyX19TY3JlZW4nKTtcbiAgICBjdXJyZW50U2NyZWVuLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcbiAgICBcbiAgICB2YXIgcHJldlNjcmVlbiA9ICQoY3VycmVudFNjcmVlbikucHJldignLkNhbGVuZGFyX19TY3JlZW4nKTtcbiAgICBwcmV2U2NyZWVuLmFkZENsYXNzKCdBY3RpdmUnKTtcbn1cbiIsIi8vIFRoaXMgaXMgdXNlZCB3aXRoaW4gZGFzaGJvYXJkX19jYWxlbmRhci0tbW9udGguaHRtbCB0byBhZGQgY2xhc3MgYWN0aXZlIHRvIGNvbG9yIHBhbGV0dGVcblxuJChcIi5Db2xvcl9fc3dhdGNoXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICQoXCIuQ29sb3JfX3N3YXRjaFwiKS5yZW1vdmVDbGFzcyhcIkFjdGl2ZVwiKTtcbiAgJCh0aGlzKS5hZGRDbGFzcyhcIkFjdGl2ZVwiKTtcbn0pXG4iLCIvKlxuKiBTZXQgdmFsdWUgb24gYSBmaWVsZCBvbmZvY3VzIGV2ZW50IGlmIGZpZWxkIHZhbHVlIGlzIGVtcHR5XG4qXG4qIEBwYXJhbSBPYmplY3QgZWxlbWVudCBUaGUgZmllbGRcbiogQHBhcmFtIHN0cmluZyB2YWx1ZSAgIFRoZSB2YWx1ZSBcbiovXG5mdW5jdGlvbiBzZXRGb2N1c1ZhbHVlKGVsZW1lbnQsIHZhbHVlKXtcbiAgICBpZighJChlbGVtZW50KS52YWwoKSlcbiAgICB7XG4gICAgICAgICQoZWxlbWVudCkudmFsKHZhbHVlKTtcbiAgICB9XG59XG5cbi8qXG4qIENvbGxhcHNlcyBhY2NvcmRpb24ocykgXG4qXG4qIEBwYXJhbSBlbGVtZW50ICAgIGFjY29yZGlvbiAgIFRoZSBhY2NvcmRpb24gZWxlbWVudFxuKiBAcGFyYW0gc3RyaW5nICAgICBhY3Rpb24gICAgICBUaGUgYWN0aW9uXG4qL1xuZnVuY3Rpb24gY29sbGFwc2VBbGwoYWNjb3JkaW9uLCBhY3Rpb24pXG57XG4gICAgJChhY2NvcmRpb24pLmNvbGxhcHNlKGFjdGlvbik7XG59XG5cbi8vIENoZWNrcyBhbGwgdGhlIGNoZWNrYm94ZXMgY2hpbGRyZW4gd2hvIGhhdmUgdGhlIC5jaGVja0FsbCBlbGVtZW50IGlkXG4kKCcuY2hlY2tBbGwnKS5jbGljayhmdW5jdGlvbigpe1xuICAgIC8vIGdldCB0aGUgaWRcbiAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG5cbiAgICAvLyBjaGVjayBhbGwgdGhlIGNoZWNrYm94ZXMgd2hvIGhhdmUgdGhlIHBhcmVudCBpZCBhcyBjbGFzc1xuICAgICQoJy4nICsgaWQpLnByb3AoJ2NoZWNrZWQnLCB0aGlzLmNoZWNrZWQpO1xufSlcblxuLypcbiogICBFbmFibGVzL2Rpc2FibGVzIGlubGluZSBlZGl0aW5nXG4qL1xuZnVuY3Rpb24gZWRpdElubGluZUVkaXRhYmxlKCl7XG4gICAgLy8gaGlkZS9zaG93IHRoZSBhZGQgYW5kIGVkaXQgYnV0dG9ucyBhbmQgc2hvdy9oaWRlIGVkaXQgYWN0aW9uIGJ1dHRvbnNcbiAgICAkKCcuSW5saW5lLWVkaXRhYmxlLS1lbmFibGUnKS50b2dnbGUoKTtcbiAgICAkKCcuQWRkLW5ldy1pbmxpbmUtZWRpdGFibGUnKS50b2dnbGUoKTtcbiAgICAkKCcuRWRpdC1pbmxpbmUtYWN0aW9uJykudG9nZ2xlKCk7XG5cbiAgICAvLyBzaG93L2hpZGUgdGhlIGVkaXRhYmxlIGlucHV0c1xuICAgICQoJy5FZGl0YWJsZS1jaGVjay10ZXh0IGlucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmdW5jdGlvbihpLCB2KSB7IHJldHVybiAhdjsgfSk7O1xufVxuXG4vKlxuKiBTZXRzIHRoZSBTZWxlY3RlZCBjbGFzcyBvbiB0aGUgc2VsZWN0ZWQgZWxlbWVudFxuKi9cbmZ1bmN0aW9uIHNldFNlbGVjdGVkSWNvbihlbGVtZW50KXtcbiAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ1NlbGVjdGVkJyk7XG4gICAgJChlbGVtZW50KS5hZGRDbGFzcygnU2VsZWN0ZWQnKTtcbn0iLCIkKCdzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgIGlmICgkKHRoaXMpLnZhbCgpID09IFwibW9kYWwtdHJpZ2dlclwiKSB7XG4gICAgICAgICQoJyNteU1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICB9XG59KTsiLCIkKCcuSGFtYnVyZ2VyJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ09wZW4nKTtcbiAgICAkKCcuU3ViLWhlYWRlcl9iYXInKS50b2dnbGVDbGFzcygnSGFtYnVyZ2VyLW9wZW4nKTtcbiAgICBjb25zb2xlLmxvZygndG9nZ2xlZCcpXG59KTsiLCIkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkgeyAgICBcbiAgICB2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgaWYgKHNjcm9sbCA+PSA1MCkge1xuICAgICAgICAkKFwiLlN1Yi1oZWFkZXJfYmFyXCIpLmFkZENsYXNzKFwiU3RpY2t5LWhlYWRlclwiKTtcbiAgICAgICAgJChcIi5IZWFkZXJfYmFyXCIpLmFkZENsYXNzKFwiT25seVwiKTtcbiAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJXLVN0aWNreS1uYXYtLWVuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCIuU3ViLWhlYWRlcl9iYXJcIikucmVtb3ZlQ2xhc3MoXCJTdGlja3ktaGVhZGVyXCIpO1xuICAgICAgICAkKFwiLkhlYWRlcl9iYXJcIikucmVtb3ZlQ2xhc3MoXCJPbmx5XCIpO1xuICAgICAgICAkKFwiaHRtbFwiKS5yZW1vdmVDbGFzcyhcIlctU3RpY2t5LW5hdi0tZW5cIik7XG4gICAgfVxufSk7XG5cbiQoJy5IZWFkZXJfYmFyX19hbGVydCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgJCgnLkhlYWRlcl9iYXJfX2FsZXJ0LS1ub3RpZmljYXRpb24nKS5oaWRlKCk7XG59KSIsIi8qXG4qIEFkZHMgYSBtYXJrZXIgb24gdGhlIG1hcFxuKlxuKiBAcGFyYW0gTWFwXHRtYXBcdFx0XHRcdFRoZSBtYXAgd2hlcmUgdG8gYWRkIHRoZSBtYXJrZXJcbiogQHBhcmFtIGZsb2F0ICBsYXQgICAgIFx0XHRUaGUgcGxhY2UgbGF0aXR1ZGUgXG4qIEBwYXJhbSBmbG9hdCAgbG9uZyAgICBcdFx0VGhlIHBsYWNlIGxvbmdpdHVkZVxuKiBAcGFyYW0gc3RyaW5nIGNvbnRlbnRTdHJpbmdcdFRoZSB3aW5kb3cgaW5mbyBjb250ZW50XG4qIEBwYXJhbSBzdHJpbmcgdHlwZSAgICBcdFx0VGhlIHBpbiB0eXBlLiBBdmFpbGFibGUgcGluczogW3JlZCxhbWJlcixncmVlbl1cbiogQHBhcmFtIHN0cmluZyBsYWJlbCAgIFx0XHRUaGUgcGluIGxhYmVsLiBBdmFpbGFibGUgbGFiZWw6IFtjeWNsb25lLGNvbmZsaWN0LGVhcnRocXVha2UsdHN1bmFtaSxzdG9ybSx2b2xjYW5vLHRvcm5hZG8saW5zZWN0LWluZmVzdGF0aW9uLGRhbmdlcm91cy1hcmVhXVxuKiBAcmV0dXJuIHtOdW1iZXJ9IHN1bVxuKi9cbmZ1bmN0aW9uIGFkZE1hcmtlcihtYXAsIGxhdCwgbG9uZywgY29udGVudFN0cmluZywgdHlwZSAsIGxhYmVsID0gbnVsbClcbntcblx0dmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoe1xuXHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG9uZyksXG5cdFx0bWFwOiBtYXAsXG5cdFx0aWNvbjogJ2ltZy9tYXJrZXJzLycgKyB0eXBlICsgJy5zdmcnLFxuXHRcdG1hcF9pY29uX2xhYmVsOiAobGFiZWwgIT09IG51bGwpID8gJzxpIGNsYXNzPVwibWFwLWljb24gSWNvbi0tJyArIGxhYmVsICsgJyBJY29uLS1zbVwiPjwvaT4nIDogJydcblx0fSk7XG4gXHRcblx0dmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50U3RyaW5nLFxuXHRcdFx0bWF4V2lkdGg6IDQ4MFxuXHR9KTtcblxuXHRtYXJrZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcblx0fSk7XG59IiwiLy8gWW91IGNhbiBzZWUgdGhlc2UgaW4gdXNlIG9uIGNvdW50cnktYWRtaW5fX2NvdW50cnktb2ZmaWNlLS1tb2R1bGUtc2V0dGluZ3MuaHRtbCB0byByZXBsaWNhdGUgcmFkaW8gYnV0dG9ucywgd2l0aCBib290c3RyYXAgYnV0dG9uc1xuXG4kKCcuUmFkaW9fX2J1dHRvbi0tanMgLmJ0bicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1wcmltYXJ5IEFjdGl2ZScpLmFkZENsYXNzKCdidG4tb3V0bGluZS1wcmltYXJ5Jyk7XG5cdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2J0bi1vdXRsaW5lLXByaW1hcnknKS5hZGRDbGFzcygnYnRuLXByaW1hcnkgQWN0aXZlJyk7XG59KTtcblxuLy8gTmV0d29yayBBZG1pbiA+IE5ldHdvcmsgU2V0dGluZ3MgPiBSZXNwb25zZSBQbGFuIFNldHRpbmdzIGVuYWJsZWQvZGlzYWJsZWQgYnV0dG9uIHN3YXBwZXIgKFRCQylcblxuXG5cbi8vIE5ldHdvcmsgQWRtaW4gPiBOZXR3b3JrIFNldHRpbmdzID4gRG9jdW1lbnRzIGV4cG9ydCBzZWxlY3RlZCBkb2N1bWVudHMgYnV0dG9uIGFuZCBjaGVja2JveGVzXG52YXIgZXhwb3J0U2VsZWN0ZWREb2N1bWVudCA9ICQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJykuY2hhbmdlKFxuICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkKCcjZXhwb3J0RG9jdW1lbnRCdG4nKS5wYXJlbnQoKS5jaGlsZHJlbignLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tcHJpbWFyeSBmYWRlZCcpLmFkZENsYXNzKCdidG4tcHJpbWFyeSBBY3RpdmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJyNleHBvcnREb2N1bWVudEJ0bicpLnBhcmVudCgpLmNoaWxkcmVuKCcuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1wcmltYXJ5JykuYWRkQ2xhc3MoJ2J0bi1wcmltYXJ5IGZhZGVkJyk7XG4gICAgICAgIH1cbiAgICB9KTsiLCIvKipcbiAqIEFkZHMgdGhlIHNlbGVjdGVkIGNsYXNzIHRvIHRoZSBjbGlja2VkIHJhZGlvIGJ1dHRvblxuICogXG4gKiBAcGFyYW0gRWxlbWVudCBpbnB1dCBcbiAqL1xuZnVuY3Rpb24gbXVsdGlfc2VsZWN0X3JhZGlvU2VsZWN0ZWQoaW5wdXQpe1xuICAgICQoaW5wdXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5TZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdTZWxlY3RlZCcpO1xuICAgICQoaW5wdXQpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdTZWxlY3RlZCcpO1xufSIsImZ1bmN0aW9uIHJpYmJvbkNsaWNrKGVsZW1lbnQpe1xuICAgIC8vUmVzZXQgYWxsIGFjdGl2ZSBjbGFzc2VzXG4gICAgaWYgKCAkKCBlbGVtZW50ICkuaGFzQ2xhc3MoIFwiQWN0aXZlXCIgKSApIHtcbiAgICAgICAgJChcIi5SaWJib25fX2hlYWRlcl9fd3JhcCwgLlJpYmJvbl9fcmVzcG9uc2UsIC5SaWJib25fX2hlYWRlcl9fY2hldnJvblwiKS5yZW1vdmVDbGFzcygnQWN0aXZlJyk7XG4gICAgICAgICQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVVcCgpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAkKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19yZXNwb25zZSwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcbiAgICAgICAgJChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVVwKCk7XG5cbiAgICAgICAgLy9BZGQgQWN0aXZlIHRvIFJpYmJvbiBIZWFkZXIgV3JhcFxuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFkZENsYXNzKCdBY3RpdmUnKTtcbiAgICAgICAgJChlbGVtZW50KS50b2dnbGVDbGFzcygnQWN0aXZlJyk7XG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkubmV4dChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdBY3RpdmUnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbnRpbnVlVG9OZXh0UmliYm9uKGVsZW1lbnQpe1xuICAgICAgICAkKFwiLlJpYmJvbl9faGVhZGVyX193cmFwLCAuUmliYm9uX19yZXNwb25zZSwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLnJlbW92ZUNsYXNzKCdBY3RpdmUnKTtcbiAgICAgICAgJChcIi5SZXNwb25zZV9fY29udGVudFwiKS5zbGlkZVVwKCk7XG5cbiAgICAgICAgLy9BZGQgQWN0aXZlIHRvIG5leHQgcmliYm9uXG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkubmV4dCgpLm5leHQoXCIuUmVzcG9uc2VfX2NvbnRlbnRcIikuc2xpZGVEb3duKCk7XG4gICAgICAgICQoZWxlbWVudCkucGFyZW50KCkucGFyZW50KCkubmV4dChcIi5SaWJib25fX3Jlc3BvbnNlXCIpLmFkZENsYXNzKCdBY3RpdmUnKTtcbiAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KCkuZmluZChcIi5SaWJib25fX2hlYWRlcl9fd3JhcCwgLlJpYmJvbl9faGVhZGVyX19jaGV2cm9uXCIpLmFkZENsYXNzKCdBY3RpdmUnKTtcbn1cblxuLy8gSW52ZXJzZXMgYXJyb3cgb24gYWNjb3JkaW9uIGV4cGFuc2lvblxuJCgnLmNvbGxhcHNlJykub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oZSl7XG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKFwiLmZhLWNhcmV0LWRvd25cIikucmVtb3ZlQ2xhc3MoXCJmYS1jYXJldC1kb3duXCIpLmFkZENsYXNzKFwiZmEtY2FyZXQtdXBcIik7XG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuSGlkZS1hbGwnKS5zaG93KCk7XG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKCcuU2hvdy1hbGwnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9KS5vbignaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oZSl7XG4gICAgICAgIGlmKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygncHJldmVudF9wYXJlbnRfY29sbGFwc2UnKSl7IC8vIHByZXZlbnRzIHRoZSB0cmlnZXJyaW5nIHRoZSBjb2xsYXBzZSBldmVudCBmb3IgcGFyZW50XG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS5maW5kKFwiLmZhLWNhcmV0LXVwXCIpLnJlbW92ZUNsYXNzKFwiZmEtY2FyZXQtdXBcIikuYWRkQ2xhc3MoXCJmYS1jYXJldC1kb3duXCIpO1xuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLkhpZGUtYWxsJykuaGlkZSgpO1xuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkuZmluZCgnLlNob3ctYWxsJykuc2hvdygpO1xuICAgICAgICB9XG59KTtcblxuIiwiJChkb2N1bWVudCkuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgIGlmICghJCh0YXJnZXQpLmlzKCcuSW5mb19faWNvbicpICYmICEkKHRhcmdldCkucGFyZW50cygpLmlzKCcuSW5mb19faWNvbicpKSB7XG4gICAgICAgICQoJy5JbmZvX19idWJibGUnKS5mYWRlT3V0KCk7XG4gICAgfVxufSk7XG5cbiQoXCIuSW5mb19faWNvblwiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgJChcIi5JbmZvX19idWJibGVcIikuZmFkZUluKCk7XG59KTtcblxuXG5cbiQoXCIuRXh0ZW5kX19zcGFuXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdBY3RpdmUnKTtcbiAgJChcIi5FeHRlbmRlZF9fY29udGVudFwiKS5zbGlkZVRvZ2dsZSgpXG4gICQoXCIuSW5mb19fYnViYmxlXCIpLnRvZ2dsZUNsYXNzKCdBY3RpdmUnKTtcbn0pO1xuIl19
