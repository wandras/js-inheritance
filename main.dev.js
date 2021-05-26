/**
 * JavaScript Inheritance solution - Plug FW
 * Based on native prototypal chain inheritance
 * Clear names and methods, for development purposes
 * 
**/
var Class = (function() {
    // the Class super-constructor, a classes-builder factory:
    function Class(Constructor) {
        if (typeof(Constructor) === 'function') {
            // invoked as class builder:
            return extend(Class, Constructor);
        } else if (this instanceof Class) {
            // invoked as a constructor:
            return this;
        }
    };
    
    // reflective method to create an instances of a class:
    Class.construct = function() {
        return construct(this, arguments);
    }
    
    // method for extension of the Class super-constructor itself:
    Class.extend = function(Child) {
        return extend(this, Child);
    }
    
    Class.parent = Class;
    
    function construct(Constructor, args) {
        // inform the constructor that it's being reflected:
        Constructor.reflecting = true;
        // get the instance:
        var reflection = new Constructor(arguments);
        delete Constructor.reflecting;
        return reflection;
    }
    
    function extend(Parent, Child) {
        if (typeof(Parent) !== 'function' || typeof(Child) !== 'function') {
            return;
        }
        
        // inform the constructor that it's being extendd:
        Parent.extending = true;
        // get an uninitialized instance of the parent:
        var parent = new Parent();
        delete Parent.extending;
        // inherit from the parent:
        Child.prototype = parent;
        
        // Proxy constructor:
        function Proxy() {
            if (this instanceof Proxy && 'init' in this && Proxy.extending !== true) {
                this.init.apply(this, Proxy.reflecting === true ? arguments[0] : arguments);
            }
        }
        
        // get an uninitialized instance of the Child:
        var instance = new Child();
        // reference the parent instance:
        instance.parent = parent;
        // set the instance constructor:
        instance.constructor = Proxy;
        // inherit from the constructor:
        Proxy.prototype = instance;

        // save in the proxy constructor a reference to the parent and the primary constructor:
        Proxy.parent = Parent;
        Proxy.assignee = Child;

        // make it extensible and reflectable:
        Proxy.extend = Parent.extend;
        Proxy.construct = Parent.construct;
        
        return Proxy;
    }
    
    return Class;
})();
