function adder(num) {
    return

    function(x) {
        return num + x;
    }
}

var add5 = adder(5);
var add6 = adder(6);

print(add5(1));
print(add6(1));