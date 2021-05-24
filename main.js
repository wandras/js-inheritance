var Class = (function() {
    var Class = function(Constructor) {
        function Final() {
            if (this instanceof Final && Final.extending !== true) {
                this.init.apply(this, arguments);
            }
        };
        Constructor.extending = true;
        var instance = new Constructor();
        Constructor.extending = false;

        /* we cannot assign the whole prototype to the final constructor as follows:
        Final.prototype = instance;
        it would overwrite every further prototype, so we assign property by property: */
        for (prop in instance) {
            Final.prototype[prop = instance[prop];
        }
        
        Final.extend = Class.extend;
        /*
        Final.construct = function() {
            Final.constructing = true;
            var reflection = new Final(arguments);
            Final.constructing = false;
            return reflection;
        };
        */
        return Final;
    };

    Class.extend = function extend(Child) {
        this.extending = true;
        var parent = new this();
        this.extending = false;
        Child.prototype = parent;
        var C = Class(Child);
        
        return C;
    };
    return Class;
})();
