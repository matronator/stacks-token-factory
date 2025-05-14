import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import ConnectWallet from './ConnectWallet/ConnectWallet';

export function TopNav() {
    return (
        <NavigationMenu className='flex flex-row justify-end ml-auto' delayDuration={0}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href='/'>
                        Create Token
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <ConnectWallet />
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export function Logo() {
    return (
        <h1 className='display-5 my-12'><span className='title-orange-text'>Stacks</span> <strong className='title-blue-text'>Token Factory</strong></h1>
    );
}
