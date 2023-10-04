// // tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { Rest, SObject, getStandardError } from "../..";
import { createDefaultClient } from "../helper";
import { Account } from "../assets/sobs";

describe("Invokable", () => {
  before(async () => {
    await createDefaultClient();
  });

  it("should error", async () => {
    let client = new Rest();

    const data = [
      {
        subjectNameOrId: "jsmith@salesforce.com",
        type: "user",
        text: "first chatter post!",
      },
    ];

    try {
      const result = await client.invokeAction("invalid", data);
    } catch (e: any) {
      let stdErr = getStandardError(e);
      expect(stdErr.type).to.equal("invokable");
      expect(stdErr.errorDetails.length).to.equal(1);
      expect(stdErr.errorDetails[0].errorCode).to.equal("MISSING_RECORD");
    }
  });

  it("should work with rest object mapping", async () => {
    let client = new Rest();

    let acc1 = new Account({
      name: "acme",
      annualRevenue: 10,
    });

    let acc2 = new Account({
      name: "stark",
      annualRevenue: 10000,
    });

    //prepare data for invokable
    const data = [
      { accounts: acc1.toJson({ dmlMode: "all" }) },
      { accounts: acc1.toJson({ dmlMode: "all" }) },
    ];

    let results = await client.invokeAction<SObject>(
      "AccountInsertAction",
      data
    );

    expect(results).length(2);

    // map list of results be to ts-force RestObjects
    const parsedAccounts = results.map((rData) =>
      Account.fromSFObject(rData.outputValues.output)
    );

    expect(parsedAccounts[0].id).not.to.be.empty;
  });
});
