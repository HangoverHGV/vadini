from typing import Dict, Optional
from typing import  Dict, Optional
from fastapi.security import OAuth2
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi import Request,status,HTTPException
from fastapi.security.utils import get_authorization_scheme_param
from starlette.responses import RedirectResponse

class OAuth2PasswordBearerWithCookie(OAuth2):
    """
        Custom OAuth2 authentication scheme that extracts Bearer tokens from HTTP-only cookies.
    
        This class extends FastAPI's OAuth2 functionality to support token authentication
        via cookies instead of the standard Authorization header, providing enhanced security
        for web applications.

        Attributes:
            tokenUrl (str): The URL where clients can obtain tokens (used for OpenAPI docs)
            scheme_name (Optional[str]): Name for the authentication scheme
            scopes (Optional[Dict[str, str]]): OAuth2 scopes for the scheme
            auto_error (bool): Whether to automatically raise errors on auth failure
    """

    def __init__(
        self,
        tokenUrl: str,
        scheme_name: Optional[str] = None,
        scopes: Optional[Dict[str, str]] = None,
        auto_error: bool = True,
    ):
        
        """
            Initialize the OAuth2 Password Bearer with Cookie authentication scheme.
        """

        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        """
            Extract and validate Bearer token from the 'access_token' cookie.
        
        This method is called automatically by FastAPI's dependency injection system
        when used as a dependency. It looks for the token in cookies rather than
        the standard Authorization header.
        
        Args:
            request: The incoming FastAPI Request object containing cookies
            
        Returns:
            Optional[str]: The extracted token string if authentication is successful,
                          None if auto_error=False and authentication fails

        """

        # authorization: str = request.cookies.get("access_token")  # changed to accept access token from httpOnly Cookie

        # scheme, param = get_authorization_scheme_param(authorization)
        # if not authorization or scheme.lower() != "bearer":
        #     if self.auto_error:
        #       raise HTTPException(status_code=401, detail="Not authorized")
        #     else:
        #         return None
        # return param
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(status_code=401, detail="Not authorized")
        return token