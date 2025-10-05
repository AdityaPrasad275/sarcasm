# Working principle 
In the backend, it is expecting a string for an answer. What if you, through manual api request send a {} object. Error thrown! because debug = true, the error log comes to me in a html
And the people who made this made the code compare the correct answer with the user submitted answer in code like string comparison instead of hashed comparison
This made is such that in the error log you could see the values of the variables lol
