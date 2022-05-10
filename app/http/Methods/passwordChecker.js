function passwordChecker(password)
{
    var c=0,caps=0;
    if(password.length<4)
    return false;
    for(s in password)
    {
      if(s===" ")
      return false;
      if(s>='0' && s<='9')
      c++;
      if(s>='A' && S<='Z')
      caps++;
    }
    if(c<=0)
    return false;
    if(caps<=0)
    return false;
    return true;
}

module.exports=passwordChecker;