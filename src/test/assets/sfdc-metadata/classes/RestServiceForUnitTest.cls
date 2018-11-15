@RestResource(urlMapping='/myservice')
global with sharing class RestServiceForUnitTest {
    @HttpPost
     global static Account doPost(Account acc) {
        return acc;
    }
}