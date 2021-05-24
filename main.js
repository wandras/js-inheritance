var Class = (function() {
    var Class = function(Constructor) {
        if (typeof(Constructor) !== 'function') {
            return;
        }

        function Proxy() {
            if (this instanceof Proxy && 'init' in this && Proxy.extending !== true) {
                this.init.apply(this, Proxy.reflecting === true ? arguments[0] : arguments);
            }
        };
        
        // create an uninitialized instance:
        var instance = new Constructor();

        // we cannot assign the whole prototype to the proxy constructor with Proxy.prototype = instance
        // it would overwrite every further prototype, so we assign property by property:
        for (prop in instance) {
            Proxy.prototype[prop] = instance[prop];
        }
        
        // save in the Proxy a reference to the primary constructor:
        Proxy.assignee = Constructor;
        // make it extensible and reflectable:
        Proxy.extend = Class.extend;
        Proxy.construct = Class.construct;

        return Proxy;
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
        
        // make the child constructor a class:
        var ChildProxy = Class(Child);
        
        return ChildProxy;
    };
    
    Class.construct = function construct() {
        // inform the constructor that it's being reflected:
        this.reflecting = true;
        var reflection = new this(arguments);
        delete this.reflecting;
        return reflection;
    }
    return Class;
})();

