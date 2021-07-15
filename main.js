/**
 * JavaScript Inheritance solution - Plug FW
 * Based on native prototypal chain inheritance
 * Shadowing of names and methods, for a minimal footprint.
 * 
**/
var Class = (function() {
    function Class(Constructor) {
        return build(this, Class, Constructor);
    }
    
    Class.construct = function() {
        return construct(this, arguments);
    }
    
    Class.extend = function(Child) {
        return extend(this, Child);
    }

    Class.parent = Class;
    
    function build(instance, Parent, Constructor, args) {
        if (typeof(Constructor) === 'function') {
            // invoking Class super-constructor as class builder:
            return extend(Parent, Constructor);
        } else if (instance instanceof Parent) {
            // invoking Class super-constructor as a constructor:
            return instance;
        } else if (instance instanceof Parent && 'init' in instance && Parent.extending !== true) {
            // invoking a class constructor:
            instance.init.apply(instance, Parent.reflecting === true ? args[0] : args);
        }
    }
    
    function construct(Constructor, args) {
        // inform the constructor that it's being reflected:
        Constructor.reflecting = true;
        var reflection = new Constructor(args);
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
        function Class() {
            return build(this, Class, false, arguments);
        }
        
        // create an uninitialized instance:
        var instance = new Child();
        // reference the parent instance:
        instance.parent = parent;
        // set the instance constructor:
        instance.constructor = Class;
        // inherit from the constructor:
        Class.prototype = instance;
        
        // save in the proxy constructor a reference to the parent and the primary constructor:
        Class.parent = Parent;
        Class.assignee = Child;
        
        // make it extensible and reflectable:
        Class.extend = Parent.extend;
        Class.construct = Parent.construct;
        
        return Class;
    }
    
    return Class;
})();
