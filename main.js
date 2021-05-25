var Class = (function() {
    var Class = function(Constructor) {
        if (typeof(Constructor) === 'function') {
            return Class.extend(Constructor);
        }
    };

    Class.extend = function extend(Child) {
        if (typeof(Child) !== 'function') {
            return;
        }

        // inform the constructor that it's being extendd:
        this.extending = true;
        // get an uninitialized instance of the parent:
        var parent = new this();
        delete this.extending;

        Child.prototype = parent;
        // reference the parent prototype instance in a reserved attribute:
        Child.prototype.parent = parent;

        // Proxy constructor:
        function Proxy() {
            if (this instanceof Proxy && 'init' in this && Proxy.extending !== true) {
                this.init.apply(this, Proxy.reflecting === true ? arguments[0] : arguments);
            }
        };

        // create an uninitialized instance:
        var instance = new Child();
        // inherit from the constructor:
        Proxy.prototype = instance;
        // save in the Proxy a reference to the primary constructor:
        Proxy.assignee = Child;
        // make it extensible and reflectable:
        Proxy.extend = Class.extend;
        Proxy.construct = Class.construct;

        return Proxy;
    };

    Class.construct = function construct() {
        // inform the constructor that it's being reflected:
        this.reflecting = true;
        var reflection = new this(arguments);
        delete this.reflecting;
        return reflection;
    }

    Class.parent = Class;

    return Class;
})();
