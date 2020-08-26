var expect = require('expect.js');
var Ego = require("../../build/Ego");

describe("DecisionTree", function(){

  it("should initialize", function(){

    var rootDecision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());

    var decisionTree = new Ego.DecisionTree(rootDecision);

    expect(decisionTree._rootNode).to.equal(rootDecision);
  });

  it("should throw an error on construction if rootNode is not a Decision", function(){

    var catchedErr = null;
    try {
      var decisionTree = new Ego.DecisionTree("not_a_decision");
    }catch(err){
      catchedErr = err;
    }

    expect(catchedErr).not.to.eql(null);
    expect(catchedErr.message).to.eql("Root node must be an instance of Ego.Decision")
  });

  describe("should make decision", function(){

    it("root node only", function(){

      var knowledge = new Ego.Knowledge();
      knowledge.addBooleanInformation("isStuffHappening", true);

      var rootDecision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());

      rootDecision.setYesNode("chill.");
      rootDecision.setNoNode("make it happen.");

      var decisionTree = new Ego.DecisionTree(rootDecision);

      expect(decisionTree.makeDecision(knowledge)).to.eql("chill.");

      knowledge.updateBooleanInformation("isStuffHappening", false);

      expect(decisionTree.makeDecision(knowledge)).to.eql("make it happen.");
    });

    it("two levels", function(){

      var knowledge = new Ego.Knowledge();
      knowledge.addBooleanInformation("isStuffHappening", true);
      knowledge.addBooleanInformation("doYouWantThis", true);

      var isTrueMethod = new Ego.IsTrue();

      var rootDecision = new Ego.Decision("isStuffHappening", Ego.InformationTypes.TYPE_BOOLEAN, isTrueMethod);
      var decision2 = new Ego.Decision("doYouWantThis", Ego.InformationTypes.TYPE_BOOLEAN, isTrueMethod);
      var decision3 = new Ego.Decision("doYouWantThis", Ego.InformationTypes.TYPE_BOOLEAN, isTrueMethod);

      decision2.setYesNode("chill");
      decision2.setNoNode("stop it");

      decision3.setYesNode("chill");
      decision3.setNoNode("make it happen");

      rootDecision.setYesNode(decision2);
      rootDecision.setNoNode(decision3);

      var decisionTree = new Ego.DecisionTree(rootDecision);

      expect(decisionTree.makeDecision(knowledge)).to.eql("chill");

      knowledge.updateBooleanInformation("doYouWantThis", false);

      expect(decisionTree.makeDecision(knowledge)).to.eql("stop it");

      knowledge.updateBooleanInformation("isStuffHappening", false);
      knowledge.updateBooleanInformation("doYouWantThis", true);

      expect(decisionTree.makeDecision(knowledge)).to.eql("chill");

      knowledge.updateBooleanInformation("doYouWantThis", false);

      expect(decisionTree.makeDecision(knowledge)).to.eql("make it happen");
    });

    it("three levels", function(){

      var knowledge = new Ego.Knowledge();
      knowledge.addNumericalInformation("numberOfFamilyMembers", 4);
      knowledge.addNumericalInformation("salary", 100000);
      knowledge.addBooleanInformation("isMarried", true);

      var familyMemberRange = new Ego.Range(3, Infinity);
      familyMemberRange.makeLowerBoundInclusive();

      var salaryRange1 = new Ego.Range(80000, Infinity);
      salaryRange1.makeLowerBoundInclusive();

      var salaryRange2 = new Ego.Range(40000, Infinity);
      salaryRange2.makeLowerBoundInclusive();

      var decision1 = new Ego.Decision("numberOfFamilyMembers", Ego.InformationTypes.TYPE_NUMERICAL, new Ego.IsInRange(familyMemberRange));
      var decision2 = new Ego.Decision("salary", Ego.InformationTypes.TYPE_NUMERICAL, new Ego.IsInRange(salaryRange1));
      var decision3 = new Ego.Decision("isMarried", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());
      var decision4 = new Ego.Decision("isMarried", Ego.InformationTypes.TYPE_BOOLEAN, new Ego.IsTrue());
      var decision5 = new Ego.Decision("salary", Ego.InformationTypes.TYPE_NUMERICAL, new Ego.IsInRange(salaryRange1));

      decision1.setYesNode(decision3);
      decision1.setNoNode(decision2);

      decision2.setYesNode("4BHK");
      decision2.setNoNode(decision4);

      decision3.setYesNode("3BHK");
      decision3.setNoNode(decision5);

      decision4.setYesNode("3BHK");
      decision4.setNoNode("2BHK");

      decision5.setYesNode("2BHK");
      decision5.setNoNode("1BHK");

      var decisionTree = new Ego.DecisionTree(decision1);

      expect(decisionTree.makeDecision(knowledge)).to.eql("3BHK");

      knowledge.updateBooleanInformation("isMarried", false);
      expect(decisionTree.makeDecision(knowledge)).to.eql("2BHK");

      knowledge.updateNumericalInformation("salary", 20000);
      expect(decisionTree.makeDecision(knowledge)).to.eql("1BHK");

      knowledge.updateNumericalInformation("numberOfFamilyMembers", 1);
      knowledge.updateNumericalInformation("salary", 100000);
      expect(decisionTree.makeDecision(knowledge)).to.eql("4BHK");

      knowledge.updateNumericalInformation("salary", 50000);
      knowledge.updateBooleanInformation("isMarried", true);
      expect(decisionTree.makeDecision(knowledge)).to.eql("3BHK");

      knowledge.updateBooleanInformation("isMarried", false);
      expect(decisionTree.makeDecision(knowledge)).to.eql("2BHK");
    });
  });
});
