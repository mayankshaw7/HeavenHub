module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};
/*or another way of writing the same thing we have already seen*/