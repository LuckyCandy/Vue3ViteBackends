export const clone = (obj: any):any => {
    let o;
    // 如果  他是对象object的话  , 因为null,object,array  也是'object';
    if (typeof obj === 'object') {
      
      // 如果  他是空的话
      if (obj === null) {
        o = null;
      }
      else {
    
        // 如果  他是数组arr的话
        if (obj instanceof Array) {
          o = [];
          for (let i = 0, len = obj.length; i < len; i++) {
            o.push(clone(obj[ i ]));
          }
        }
        // 如果  他是对象object的话
        else {
          o = {};
          for (const j in obj) {
            o[j] = clone(obj[ j ]);
          }
        }
        
      }
    }
    else {
      o = obj;
    }
    return o;
  };
  