var Class = (function() {
    var Class = function(Constructor) {
        if (typeof(Constructor) === 'function') {
            return extend(Class, Constructor);
        }
    };
    
    Class.extend = function(Child) {
        return extend(this, Child);
    }

    function extend(Parent, Child) {
        if (typeof(Child) !== 'function') {
            return;
        }
        
        // inform the constructor that it's being extendd:
        Parent.extending = true;
        // get an uninitialized instance of the parent:
        var parent = new Parent();
        delete Parent.extending;
        
        // inherit from the parent:
        Child.prototype = parent;
        // reference the parent prototype instance in a reserved attribute:
        Child.prototype.parent = parent;
        
        // Proxy constructor:
        function Class() {
            if (this instanceof Class && 'init' in this && Class.extending !== true) {
                this.init.apply(this, Class.reflecting === true ? arguments[0] : arguments);
            }
        };
        
        // create an uninitialized instance:
        var instance = new Child();
        // adjust the instance constructor:
        instance.constructor = Class;
        // inherit from the constructor:
        Class.prototype = instance;
        // save in the proxy constructor a reference to the primary constructor:
        Class.assignee = Child;
        // make it extensible and reflectable:
        Class.extend = Parent.extend;
        Class.construct = Parent.construct;
        
        return Class;
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
