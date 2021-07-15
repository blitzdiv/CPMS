const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const e = require("express");
const { route } = require("../routes/pages");
const user = new Map();
const adminpw = '1234';

//connect to database (make code looks cleaner)
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

//this fuction makes sure user enter the proper email & password to login,
//and then it will redirect user to appropriate page
exports.login = async(req, res)=>{

    try {
        const{email, password, login, forgotpassword} = req.body;

        if(forgotpassword){
            return res.redirect('forgotpassword');
        }
        else if(!email || !password){
            return res.status(401).render('login', {
                message: 'Please enter email and password.'
            });
        }
        
        db.query('SELECT * FROM usersregister WHERE email = ?', [email], async(error, results)=>{

            if(email == 'stevesmith@gmail.com' && password.length > 0){
                res.redirect('/admin');
            }
            else if(!(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login',{
                    message: 'Email or Password is incorrect.'
                });
            }
            else{
                return res.status(200).redirect("/bridge");
            }
        });
    } catch (error) {
        console.log(error);
    }   
}

//function which returns users password
exports.forgotpassword = (req, res) =>{
       
    const{email} = req.body;
    db.query('SELECT password FROM usersregister WHERE email = ?', [email], async(error, results) =>{
        console.log(results[0].password);

        if(error){
            console.log(error);
        }
        else if(email == 'stevesmith@gmail.com'){
            return res.render('forgotpassword', {
                message: 'Password is: ' + adminpw
            });
        }

        else{
            return res.render('forgotpassword', {
                message: 'Password is: ' + user.get(email)
            });
        } 
    });
}


//function used to register users and hash password
exports.register = (req, res)=>{
    console.log(req.body);

    const{firstname,lastname, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM usersregister WHERE email = ?', [email], async(error, results) =>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already used.'
            });
        }else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Password do not match.'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO usersregister SET ?', {firstname: firstname, lastname: lastname, 
            email: email, password: hashedPassword }, (error, results)=>{
            if(error){
                console.log(error);
            }else{

                user.set(email, password);

                console.log(results);
                return res.render('register', {
                    message: 'User registered.'
                });
            }
        })
    });
}

//function used to register user as an author
exports.authorRegistration = (req, res)=>{
    console.log(req.body);

    const{firstname, middleinitial, lastname, affiliation, department, address, city, 
        state, zipcode, phonenumber,emailaddress, } = req.body;

    db.query('SELECT EmailAddress FROM author WHERE EmailAddress = ?', [emailaddress], async(error, results) =>{
        if(error){
            console.log(error);
        }

        db.query('INSERT INTO author SET ?', {FirstName: firstname, MiddleInitial: middleinitial, 
            LastName: lastname, Affiliation: affiliation, Department: department,
            Address: address, City: city, State: state, Zipcode: zipcode, PhoneNumber: phonenumber, 
            EmailAddress: emailaddress}, (error, results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('authorRegistration', {
                    message: 'Author registered.'
                });
            }
        })
    });

}

//function used to register user as an reviewer
exports.reviewerRegistration = (req, res)=>{
    console.log(req.body);

    const{firstname, middleinitial, lastname, affiliation, department, 
        address, city, state, zipcode, phonenumber, emailaddress,
        AnalysisOfAlgorithms, Applications, Architecture, ArtificialIntelligence, 
        ComputerEngineering, Curriculum, DataStructures, Databases,
        DistancedLearning, DistributedSystems, EthicalSocietalIssues, FirstYearComputing, 
        GenderIssues, GrantWriting, GraphicsImageProcessing, HumanComputerInteraction, 
        LaboratoryEnvironments, Literacy, MathematicsInComputing, Multimedia, NetworkingDataCommunications,
        NonMajorCourses, ObjectOrientedIssues, OperatingSystems, ParallelProcessing, Pedagogy, 
        ProgrammingLanguages, Research, Security,SoftwareEngineering,SystemsAnalysisAndDesign, 
        UsingTechnologyInTheClassroom,WebAndInternetProgramming,Other,OtherDescription,
        ReviewsAcknowledged} = req.body;

    db.query('SELECT EmailAddress FROM reviewer WHERE EmailAddress = ?', [emailaddress], async(error, results) =>{
        if(error){
            console.log(error);
        }
        

        db.query('INSERT INTO reviewer SET ?', {FirstName: firstname, MiddleInitial: middleinitial, 
            LastName: lastname, Affiliation: affiliation, Department: department, 
            Address: address, City: city, State: state, Zipcode: zipcode, 
            PhoneNumber: phonenumber, EmailAddress: emailaddress, AnalysisOfAlgorithms: AnalysisOfAlgorithms, 
            Applications: Applications, Architecture:Architecture, ArtificialIntelligence:ArtificialIntelligence, 
            ComputerEngineering:ComputerEngineering, Curriculum:Curriculum, DataStructures:DataStructures, 
            Databases:Databases, DistancedLearning:DistancedLearning, DistributedSystems:DistributedSystems, 
            EthicalSocietalIssues:EthicalSocietalIssues, FirstYearComputing:FirstYearComputing, 
            GenderIssues:GenderIssues, GrantWriting:GrantWriting, GraphicsImageProcessing:GraphicsImageProcessing, 
            HumanComputerInteraction:HumanComputerInteraction, LaboratoryEnvironments:LaboratoryEnvironments, 
            Literacy:Literacy, MathematicsInComputing:MathematicsInComputing, Multimedia:Multimedia, 
            NetworkingDataCommunications:NetworkingDataCommunications, NonMajorCourses:NonMajorCourses, 
            ObjectOrientedIssues:ObjectOrientedIssues, OperatingSystems:OperatingSystems, 
            ParallelProcessing:ParallelProcessing, Pedagogy:Pedagogy, ProgrammingLanguages:ProgrammingLanguages, 
            Research:Research, Security:Security, SoftwareEngineering:SoftwareEngineering, 
            SystemsAnalysisAndDesign:SystemsAnalysisAndDesign, UsingTechnologyInTheClassroom:UsingTechnologyInTheClassroom, 
            WebAndInternetProgramming:WebAndInternetProgramming, Other:Other, OtherDescription:OtherDescription, 
            ReviewsAcknowledged:ReviewsAcknowledged}, (error, results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('reviewerRegistration', {
                    message: 'Reviewer registered.'
                });
            }
        })
    });

}


//function which used to let author submit paper form
exports.paperSubmit = (req, res)=>{
    console.log(req.body);

    
    const{FirstName, LastName, MiddleInitial, AuthorID,FilenameOriginal,Filename,
        Title,Certification,NotesToReviewers,AnalysisOfAlgorithms, 
        Applications, Architecture, ArtificialIntelligence, ComputerEngineering, 
        Curriculum, DataStructures, Databases,DistanceLearning, DistributedSystems, 
        EthicalSocietalIssues, FirstYearComputing, GenderIssues, GrantWriting, 
        GraphicsImageProcessing, HumanComputerInteraction, LaboratoryEnvironments, 
        Literacy, MathematicsInComputing, Multimedia, NetworkingDataCommunications, 
        NonMajorCourses, ObjectOrientedIssues, OperatingSystems, ParallelsProcessing, 
        Pedagogy, ProgrammingLanguages, Research, Security,SoftwareEngineering,
        SystemsAnalysisAndDesign,UsingTechnologyInTheClassroom,WebAndInternetProgramming,Other,
        OtherDescription,} = req.body;
    
    db.query('SELECT Title FROM paper WHERE Title = ?', [Title], async(error, results) =>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('paperSubmit', {
                message: 'This paper has already been submitted.'
            });s
        }

        db.query('INSERT INTO paper SET ?', {FirstName:FirstName, LastName:LastName, MiddleInitial:MiddleInitial, 
            FilenameOriginal:FilenameOriginal, Filename:Filename, Title:Title, Certification:Certification, 
            NotesToReviewers:NotesToReviewers, AnalysisOfAlgorithms: AnalysisOfAlgorithms, Applications: Applications, 
            Architecture:Architecture, ArtificialIntelligence:ArtificialIntelligence, ComputerEngineering:ComputerEngineering, 
            Curriculum:Curriculum, DataStructures:DataStructures, Databases:Databases, DistanceLearning:DistanceLearning, 
            DistributedSystems:DistributedSystems, EthicalSocietalIssues:EthicalSocietalIssues, FirstYearComputing:FirstYearComputing, 
            GenderIssues:GenderIssues, GrantWriting:GrantWriting, GraphicsImageProcessing:GraphicsImageProcessing, 
            HumanComputerInteraction:HumanComputerInteraction, LaboratoryEnvironments:LaboratoryEnvironments, Literacy:Literacy, 
            MathematicsInComputing:MathematicsInComputing, Multimedia:Multimedia, NetworkingDataCommunications:NetworkingDataCommunications, 
            NonMajorCourses:NonMajorCourses, ObjectOrientedIssues:ObjectOrientedIssues, OperatingSystems:OperatingSystems, 
            ParallelsProcessing:ParallelsProcessing, Pedagogy:Pedagogy, ProgrammingLanguages:ProgrammingLanguages, Research:Research, 
            Security:Security, SoftwareEngineering:SoftwareEngineering, SystemsAnalysisAndDesign:SystemsAnalysisAndDesign, 
            UsingTechnologyInTheClassroom:UsingTechnologyInTheClassroom, WebAndInternetProgramming:WebAndInternetProgramming, Other:Other, 
            OtherDescription:OtherDescription,}, (error, results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('paperSubmit', {
                    message: 'Paper Submitted.'
                });
            }
        })
    });

}



//function used to let reviewer to submit paper review form
exports.paperReview = (req, res)=>{
    console.log('Last name ' + req.body.Lastname);
    
    const{FirstName, LastName, MiddleInitial, Title, AppropriatenessOfTopic, TimelinessOfTopic, SupportiveEvidence, 
        TechnicalQuality, ScopeOfCoverage, CitationOfPreviousWork, Originality, ContentComments, OrganizationOfPaper, 
        ClarityOfMainMessage, Mechanics, WrittenDocumentComments, SuitabilityForPresentation, PotentialInterestInTopic, 
        PotentialForOralPresentationComments, OverallRating, OverallRatingComments, ComfortLevelTopic, 
        ComfortLevelAcceptability, Complete} = req.body;

    var reviewerID = null;
    var paperID = null;

    db.query('SELECT * FROM reviewer WHERE LastName = ?', [req.body.Lastname], async(error, rID) =>{

        
        reviewerID = rID[0].ReviewerID;
        console.log(rID);
        if(error){
            console.log(error);
        }
    });

    db.query('SELECT * FROM paper WHERE Title = ?', [req.body.Title], async(error, pID) =>{

         
        paperID = pID[0].PaperID;
        console.log(pID);

        if(error){
            throw error;
        }
        db.query('INSERT INTO review SET ?', { ReviewerID:reviewerID, PaperID:paperID, AppropriatenessOfTopic:AppropriatenessOfTopic, 
            TimelinessOfTopic:TimelinessOfTopic, SupportiveEvidence:SupportiveEvidence, TechnicalQuality:TechnicalQuality, 
            ScopeOfCoverage:ScopeOfCoverage, CitationOfPreviousWork:CitationOfPreviousWork, Originality:Originality, 
            ContentComments:ContentComments, OrganizationOfPaper:OrganizationOfPaper, ClarityOfMainMessage:ClarityOfMainMessage, 
            Mechanics:Mechanics, WrittenDocumentComments:WrittenDocumentComments, SuitabilityForPresentation:SuitabilityForPresentation, 
            PotentialInterestInTopic:PotentialInterestInTopic, PotentialForOralPresentationComments:PotentialForOralPresentationComments, 
            OverallRating:OverallRating, OverallRatingComments:OverallRatingComments, ComfortLevelTopic:ComfortLevelTopic, 
            ComfortLevelAcceptability:ComfortLevelAcceptability, 
            Complete:Complete}, (error, results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('paperReview', {
                    message: 'Review Submitted.'
                });
            }
        });
    });      
    
}


exports.authorAccount = (req, res)=>{
    console.log(req.body);
     
    var aID = null;
    var query = 'UPDATE author SET FirstName = ?, MiddleInitial =?, LastName=?, Affiliation=?, Department=?, Address=?, City=?,\
    State=?, Zipcode=?, PhoneNumber=?, EmailAddress=?, WHERE AuthorID=?';

    db.query('SELECT * FROM author WHERE LastName = ?', [req.body.lastname], (error, result)=>{
        console.log('hello WOrld' + result);
        if(error){
            console.log(error);
        }
        else{
            aID = result[0].AuthorID;
        }
        
        db.query(query, [req.body.FirstName, req.body.MiddleInitial, req.body.LastName, req.body.Affiliation, req.body.Department, 
            req.body.Address, req.body.City, req.body.State,req.body.Zipcode, req.body.PhoneNumber, req.body.EmailAddress,aID], 
            function(error, result, rows,field) {
            
            if(error){
                console.log(error);
            }
            else{
                console.log(rows);
            }
            
        });


    })
}

/*exports.view = (req, res) => {

    const commentReportQuery = 'SELECT reviewer.LastName, reviewer.FirstName, reviewer.MiddleInitial, reviewer.EmailAddress, paper.Title, paper.FileName,\
    review.WrittenDocumentComments, review.ContentComments, review.PotentialForOralPresentationComments, review.OverallRatingComments FROM paper JOIN review ON\
    review.PaperID = paper.PaperID JOIN reviewer ON review.ReviewerID = reviewer.ReviewerID';
    
    db.query(commentReportQuery, (error, results)=>{
        console.log('hello');
        console.log(results[0].PaperID);
        if(error){
            throw error;
        }
        else{
            res.render('reviewersCommentReport', {results});
        }
    });
}

exports.delete = (req, res) => {
      
    db.query('DELETE FROM review WHERE ReviewID = ? ', [req.body.ReviewID], (error, results)=>{

        if(error){
            throw error;
        }
        else{
            res.redirect('reviewersCommentReport');
        }
    });
}*/





