class NadeoApi {

  async nadeoservicesstorageobjectcontenturlredirect(params) {
    const url = `/storageObjects/${params.storageObjectId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesdriverbotlistadd(params) {
    const url = `/bots/drivers/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesdriverbotlistget(params) {
    const url = `/bots/drivers/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclientconfigget(params) {
    const url = `/accounts/${params.accountId}/client/config`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclientpluginsget(params) {
    const url = `/accounts/${params.accountId}/client/plugins`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclientsignatureget(params) {
    const url = `/accounts/${params.accountId}/client/signature`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclienturlconfigget(params) {
    const url = `/v2/accounts/${params.accountId}/client/urls`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclienturlsget(params) {
    const url = `/accounts/${params.accountId}/client/urls`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientconfigget(params) {
    const url = `/client/config`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestitleclientconfigget(params) {
    const url = `/titles/${params.titleId}/client/config`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientfilecreate(params) {
    const url = `/client/files/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientfileget(params) {
    const url = `/client/files/${params.clientFileId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientfilelistget(params) {
    const url = `/client/files/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientupdaterfileget(params) {
    const url = `/client/updaters/current`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientupdaterfilegetv2(params) {
    const url = `/v2/client/updaters/${params.clientUpdaterId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientupdaterfileset(params) {
    const url = `/client/updaters/${params.clientUpdaterId}`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclientlogadd(params) {
    const url = `/client/logs/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclubget(params) {
    const url = `/clubs/${params.clubId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesclublistget(params) {
    const url = `/clubs/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountencryptedpackagekeyget(params) {
    const url = `/accounts/${params.accountId}/encryptedPackage/key`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesencryptedpackagelistget(params) {
    const url = `/encryptedPackages/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesencryptedpackagecreate(params) {
    const url = `/encryptedPackages/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesencryptedpackageset(params) {
    const url = `/encryptedPackages/${params.encryptedPackageId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountencryptedpackagelistget(params) {
    const url = `/accounts/${params.accountId}/encryptedPackages/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesencrypted-package-versionlistget(params) {
    const url = `/encryptedPackages/versions/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesencryptedpackageversioncryptkeyget(params) {
    const url = `/encryptedPackages/versions/${params.encryptedPackageVersionId}/cryptKey/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesencryptedpackageversioncreate(params) {
    const url = `/encryptedPackages/${params.encryptedPackageId}/versions/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountdisplaynamelistget(params) {
    const url = `/accounts/displayNames/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesserveraccountlistget(params) {
    const url = `/accounts/${params.accountId}/servers/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesserveraccountlistgetdeprecated(params) {
    const url = `/accounts/${params.accountId}/servers`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesuseraccountpatch(params) {
    const url = `/accounts/${params.accountId}`;
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PATCH')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesuseraccountget(params) {
    const url = `/accounts/${params.accountId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountpasswordset(params) {
    const url = `/accounts/${params.accountId}/password`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessanctionadd(params) {
    const url = `/sanctions/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessanctionliftadd(params) {
    const url = `/sanctionsLift/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestokencreatefrombasicv2(params) {
    const url = `/v2/authentication/token/basic`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestokencreatefromdummyv2(params) {
    const url = `/v2/authentication/token/dummy`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestokencreatefromnadeoservicesv2(params) {
    const url = `/v2/authentication/token/nadeoservices`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestokenrefreshv2(params) {
    const url = `/v2/authentication/token/refresh`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestokencreatefromubiservicesv2(params) {
    const url = `/v2/authentication/token/ubiservices`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestokencreatefromunsecurev2(params) {
    const url = `/v2/authentication/token/unsecure`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesdelegationtokencreatefromnadeoservicesv2(params) {
    const url = `/v2/authentication/delegation-token/nadeoservices`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoserviceswebidentitylistget(params) {
    const url = `/webidentities/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountitemcollectionfavoriteadd(params) {
    const url = `/accounts/${params.accountId}/itemCollections/favorites/${params.itemCollectionId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountitemcollectionfavoritelistget(params) {
    const url = `/accounts/${params.accountId}/itemCollections/favorites/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountitemcollectionfavoriteremove(params) {
    const url = `/accounts/${params.accountId}/itemCollections/favorites/${params.itemCollectionId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectioncreate(params) {
    const url = `/itemCollections/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectionget(params) {
    const url = `/itemCollections/${params.itemCollectionId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectionlistget(params) {
    const url = `/itemCollections/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectionset(params) {
    const url = `/itemCollections/${params.itemCollectionId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectionactivityset(params) {
    const url = `/itemCollections/${params.itemCollectionId}/activity`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectionversioncreate(params) {
    const url = `/itemCollections/${params.itemCollectionId}/versions/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectionversionget(params) {
    const url = `/itemCollections/${params.itemCollectionId}/versions/${params.itemCollectionVersionId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesitemcollectionversionlistget(params) {
    const url = `/itemCollections/${params.itemCollectionId}/versions/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmapcreate(params) {
    const url = `/maps/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmapget(params) {
    const url = `/maps/${params.mapId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmaplistget(params) {
    const url = `/maps/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmapset(params) {
    const url = `/maps/${params.mapId}`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmaprecordsecureattemptcreate(params) {
    const url = `/accounts/${params.accountId}/mapRecordSecureAttempts/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountmaprecordlistget(params) {
    const url = `/accounts/${params.accountId}/mapRecords/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmaprecordget(params) {
    const url = `/mapRecords/${params.mapRecordId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmaprecordlistget(params) {
    const url = `/mapRecords/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmaprecordsecureattemptpatch(params) {
    const url = `/accounts/${params.accountId}/mapRecordSecureAttempts/${params.creatorId}`;
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PATCH')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmaprecordattemptset(params) {
    const url = `/mapRecordAttempts/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesmaprecordset(params) {
    const url = `/mapRecords/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesplayableseasonlistget(params) {
    const url = `/accounts/${params.accountId}/playableSeasons/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesseasonget(params) {
    const url = `/seasons/${params.seasonId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesseasonlistget(params) {
    const url = `/seasons/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclubpolicyrulelistget(params) {
    const url = `/accounts/${params.accountId}/policies/club/${params.clubId}/rules/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountencryptedpackagepolicyrulelistget(params) {
    const url = `/accounts/${params.accountId}/policies/encryptedPackages/${params.encryptedPackageId}/rules/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountglobalpolicyrulelistget(params) {
    const url = `/accounts/${params.accountId}/policies/global/rules/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccounttitlepolicyrulelistget(params) {
    const url = `/accounts/${params.accountId}/policies/titles/${params.titleId}/rules/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicespolicylistget(params) {
    const url = `/policies/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountsubscriptionadd(params) {
    const url = `/accounts/${params.accountId}/subscriptions/${params.subscriptionName}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountsubscriptionadddeprecated(params) {
    const url = `/accounts/${params.accountId}/subscription/${params.subscriptionName}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountsubscriptionlistget(params) {
    const url = `/accounts/${params.accountId}/subscriptions/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountpresencedelete(params) {
    const url = `/accounts/${params.accountId}/presence`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountpresenceset(params) {
    const url = `/accounts/${params.accountId}/presence`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicescurrentaccountprestigeget(params) {
    const url = `/accounts/${params.accountId}/prestiges/current`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicescurrentaccountprestigelistget(params) {
    const url = `/accounts/prestiges/currents/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprestigelistget(params) {
    const url = `/accounts/${params.accountId}/prestiges/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprestigecurrentdelete(params) {
    const url = `/accounts/${params.accountId}/currentPrestige`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprestigecurrentget(params) {
    const url = `/accounts/${params.accountId}/currentPrestige`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprestigecurrentset(params) {
    const url = `/accounts/${params.accountId}/currentPrestige`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesprestigelistget(params) {
    const url = `/prestiges/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesprestigesettingsget(params) {
    const url = `/prestiges/settings`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprofilechunkcreate(params) {
    const url = `/accounts/${params.accountId}/profile/chunks/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprofilechunkdelete(params) {
    const url = `/accounts/${params.accountId}/profile/chunks/${params.chunkId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprofilechunklistget(params) {
    const url = `/accounts/${params.accountId}/profile/chunks/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountprofilechunkset(params) {
    const url = `/accounts/${params.accountId}/profile/chunks/${params.chunkId}`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesserverget(params) {
    const url = `/servers/${params.accountId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskinfavoriteadd(params) {
    const url = `/accounts/${params.accountId}/skins/favorites/${params.skinId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskinfavoriteremove(params) {
    const url = `/accounts/${params.accountId}/skins/favorites/${params.skinId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskindelete(params) {
    const url = `/accounts/${params.accountId}/skins/${params.skinType}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskinfavoritelistget(params) {
    const url = `/accounts/${params.accountId}/skins/favorites/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskinget(params) {
    const url = `/accounts/${params.accountId}/skins/${params.skinType}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskinlistget(params) {
    const url = `/accounts/${params.accountId}/skins/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskinlistaccountlistget(params) {
    const url = `/accounts/skins/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountskinset(params) {
    const url = `/accounts/${params.accountId}/skins/${params.skinType}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountinventoryget(params) {
    const url = `/accounts/${params.accountId}/inventory`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesskincreate(params) {
    const url = `/skins/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesskinget(params) {
    const url = `/skins/${params.skinId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesskinlistget(params) {
    const url = `/skins/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessquadinvitationaccept(params) {
    const url = `/squads/${params.squadId}/members/${params.accountId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessquadinvitationadd(params) {
    const url = `/squads/${params.squadId}/invitations/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessquadcreate(params) {
    const url = `/squads/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountsquadget(params) {
    const url = `/accounts/${params.accountId}/squad`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessquadget(params) {
    const url = `/squads/${params.squadId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessquadleaderset(params) {
    const url = `/squads/${params.squadId}/leader`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessquadinvitationremove(params) {
    const url = `/squads/${params.squadId}/invitations/${params.invitedAccountId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicessquadmemberremove(params) {
    const url = `/squads/${params.squadId}/members/${params.memberAccountId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountstationlistget(params) {
    const url = `/accounts/${params.accountId}/stations/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountstationset(params) {
    const url = `/accounts/${params.accountId}/stations/${params.encryptedPackageId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountstationdelete(params) {
    const url = `/accounts/${params.accountId}/stations/${params.encryptedPackageId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclubtagdelete(params) {
    const url = `/accounts/${params.accountId}/clubTag`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclubtagget(params) {
    const url = `/accounts/${params.accountId}/clubTag`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclubtaglistget(params) {
    const url = `/accounts/clubTags/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountclubtagset(params) {
    const url = `/accounts/${params.accountId}/clubTag`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestitlecreate(params) {
    const url = `/titles/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestitleset(params) {
    const url = `/titles/${params.titleId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccounttitlelistget(params) {
    const url = `/accounts/${params.accountId}/titles/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestrophysettingsget(params) {
    const url = `/trophies/settings`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccounttrophygainlistget(params) {
    const url = `/accounts/${params.accountId}/trophies/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccounttrophylastyearsummaryget(params) {
    const url = `/accounts/${params.accountId}/trophies/lastYearSummary`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestrophycompetitionmatchachievementadd(params) {
    const url = `/trophies/achievements/competition/matchs/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestrophycompetitionget(params) {
    const url = `/competitions/${params.trophyCompetitionId}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicestrophycompetitionlistget(params) {
    const url = `/competitions/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesuploadconfigurationget(params) {
    const url = `/uploads/`;
    const requestOptions = {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('OPTIONS')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesuploadterminate(params) {
    const url = `/uploads/${params.uploadId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('DELETE')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesuploadinfoget(params) {
    const url = `/uploads/${params.uploadId}`;
    const requestOptions = {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('HEAD')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesuploaddataadd(params) {
    const url = `/uploads/${params.uploadId}`;
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PATCH')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesuploadcreate(params) {
    const url = `/uploads/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('POST')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoserviceswaitingqueueclientadd(params) {
    const url = `/waitingQueue/${params.waitingClientId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountzoneget(params) {
    const url = `/accounts/${params.accountId}/zone`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountzonelistget(params) {
    const url = `/accounts/zones/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoservicesaccountzoneset(params) {
    const url = `/accounts/${params.accountId}/zone`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('PUT')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }

  async nadeoserviceszonelistget(params) {
    const url = `/zones/`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes('GET')) {
      requestOptions.body = JSON.stringify(params.body);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();
  }
}
module.exports = NadeoApi;
